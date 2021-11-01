import { FileType, getEncodedFileId, getFileType, storageConfig } from '.'
import multer, { Multer } from 'multer'

import { CONVERTER_SECRET_KEY } from '../../../config/secretkey'
import { LIMIT_FILE_SIZE_PER_FILE } from '../../../config/limits'
import { ServerLog } from '../errors'
// import { ServerLog } from '@protocols/index'
import { getS3 } from './s3'
import multerS3 from 'multer-s3'
import path from 'path'
import request from 'request'
import shortid from 'short-uuid'
import stream from 'stream'

const transtalor = shortid()

export type ConvertResult = {
  url: string | null
  status: ConvertStatus
}

export enum ConvertStatus {
  success = 'success',
  fail = 'fail',
  needNot = 'needNot',
  wait = 'wait'
}

type ConvertResultType = {
  [fileId: number]: string
}

export const convertRequest: ConvertResultType = {}

const { s3UploadMiddleware, convertFileToPdf } = (function() {
  const converterapi = require('convertapi')(CONVERTER_SECRET_KEY)

  let multerS3Upload: multer.Multer
  const s3UploadMiddleware = () => {
    const s3 = getS3()
    if (!s3) {
      console.error({ s3 })
    }
    if (!multerS3Upload && s3) {
      multerS3Upload = multer({
        storage: multerS3({
          s3,
          bucket: storageConfig.bucket,
          contentType: multerS3.AUTO_CONTENT_TYPE,
          key: (req: any, file, callback) => {
            try {
              const key = 'files/'  + transtalor.generate() + path.extname(file.originalname)
              callback(null, key)
            } catch (err) {
              console.log(ServerLog.S3Error, err)
            }
          },
          cacheControl: 'public, max-age=31536000',
          acl: 'public-read',
        }),
        limits: { fileSize: LIMIT_FILE_SIZE_PER_FILE },
      })
    }
    
    return multerS3Upload && multerS3Upload.single('file')
  }

  const convertFileToPdf = async (fileS3Url: string, fileId: number): Promise<ConvertResult> => {
    let fileUrl: string | null = null
    let status: ConvertStatus
    const fileType = getFileType(fileS3Url)

    if (fileType !== FileType.pdfConvereted) {
      return {
        url: null,
        status: ConvertStatus.needNot,
      }
    }

    try {
      if (Object.keys(convertRequest).includes(`${fileId}`)) {
        return {
          url: null,
          status: ConvertStatus.wait,
        }
      }
      convertRequest[fileId] = fileS3Url
      const result: any = await converterapi.convert('pdf', { File: fileS3Url })
      const url = result.file.fileInfo.Url
      const fileName = result.file.fileInfo.FileName
      // create new filekey
      const fileKey = 'file/'  + shortid.generate() + '_' + fileName
      fileUrl = await uploadConvertedFile(url, fileKey)
      status = fileUrl ? ConvertStatus.success : ConvertStatus.fail

    } catch (err) {
      console.log({ 'fileconvert Error': err})
      fileUrl = null
      status = ConvertStatus.fail
    }
    fileId && delete convertRequest[fileId]

    return {
      url: fileUrl,
      status: status,
    }
  }

  const uploadConvertedFile = async (url: string, fileKey: string): Promise<string | null> => {
    const pass = new stream.PassThrough()
    request(url).pipe(pass)
    const params = {
      Bucket: storageConfig.bucket,
      Key: fileKey,
      ACL: 'public-read',
      ContentType: 'application/pdf',
      CacheControl: 'public, max-age=31536000',
      Body: pass,
    }
    // converted filed upload
    try {
      const s3 = getS3()
      await s3.upload(params).promise()
      return storageConfig.endpoint + getEncodedFileId(fileKey)
    } catch (err) {
      console.log(ServerLog.S3Error, err)
      return null
    }
  }

  return {
    s3UploadMiddleware,
    convertFileToPdf,
  }
})()

export { s3UploadMiddleware, convertFileToPdf }
