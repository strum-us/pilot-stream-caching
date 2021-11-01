import { PassThrough, Readable } from 'stream'

// import AWS from 'aws-sdk'
import request from 'request'

const AWS = require('aws-sdk')

export let storageConfig: S3Confing = {
  bucket: '',
  trashBucket: '',
  region: '',
  endpoint: '',
  cacheEndPoint: '',
}

export let s3SecretKey: S3Secret = {
  S3_ACCESS_KEY_ID: '',
  S3_SECRET_ACCESS_KEY: '',
}

type S3Confing = {
  bucket: string
  trashBucket: string
  region: string
  endpoint: string
  cacheEndPoint: string
}

type S3Secret = {
  S3_ACCESS_KEY_ID: string
  S3_SECRET_ACCESS_KEY: string
}

const { getS3,  initAwsS3 } = (function() {
  let s3: AWS.S3

  function initAwsS3(config: S3Confing, secret: S3Secret) {
    storageConfig = config

    // const AWS = require('aws-sdk')

    AWS.config.update({
      accessKeyId: secret.S3_ACCESS_KEY_ID,
      secretAccessKey: secret.S3_SECRET_ACCESS_KEY,
      region: storageConfig.region,
    })

    s3 = new AWS.S3()
  }

  const getS3 = () => s3 
  return { getS3, initAwsS3 }
})()

export { getS3,  initAwsS3 }

export const copyFile = (bucket: string, sourceKey: string, copiedKey: string) => {
  return new Promise((resolve, reject) => {
    getS3().copyObject({
      Bucket: bucket,
      CopySource: '/' + bucket + '/' + sourceKey,
      Key: copiedKey,
    }, (err: any, data: any) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

export const moveBucketFile = async (originalBucket: string, destinationBucket: string, targetKey: string) => {
  return new Promise((resolve, reject) => {
    getS3().copyObject({
      Bucket: destinationBucket,
      CopySource: '/' + originalBucket + '/' + targetKey,
      Key: targetKey,
    }, (err: any, data: any) => {
      if (err) {
        reject(err)
      } else {
        getS3().deleteObject({
          Bucket: originalBucket,
          Key: targetKey,
        }, (err: any, data: any) => {
          if (err) {
            getS3().deleteObject({
              Bucket: destinationBucket,
              Key: targetKey,
            })
            reject(err)
          } else {
            resolve(true)
          }
        })
      }
    })
  })
}

type S3result = {
  result: boolean
  error?: any
}

export const clearAllWorkspace = async (workspaceId: number, bucket: string): Promise<S3result> => {
  return new Promise((resolve, reject) => {
    getS3().listObjects({
      Bucket: bucket,
      Prefix: workspaceId + '/',
    }, (err: any, data: any) => {
      if (err) {
        resolve({ result: false, error: err })
      }
      // 지울 파일 없음.
      if (data.Contents.length === 0) {
        resolve({ result: true })
      }
      const param = {
        Bucket: bucket,
        Delete: {
          Objects: [],
        },
      }

      const deleteKeys: any = []

      for (let i = 0; i < data.Contents.length; i++) {
        const content = data.Contents[i]
        deleteKeys.push({ Key: content.Key })
      }
      param.Delete.Objects = deleteKeys
      if (deleteKeys.length > 0) {
        getS3().deleteObjects(param, (err: any, deleteData: any) => {
          if (err) {
            resolve({ result: false, error: err })
          }
          if (deleteData && deleteData.Contents && deleteData.Contents.length === 1000) {
            clearAllWorkspace(workspaceId, bucket)
          } else {
            resolve({ result: true })
          }
        })
      } else {
        resolve({ result: true })
      }
    })
  })
}

export const uploadImage = async (key: string, image: Buffer, type: string) => {
  return getS3().upload({
    Bucket: storageConfig.bucket,
    ACL: 'public-read',
    Body: image,
    Key: key,
    ContentEncoding: 'base64',
    ContentType: `image/${type}`,
  }).promise()

  // 그대로 throw 하는데 왜 try-catch 했는지?
  // try {
  //   await getS3().upload({
  //     Bucket: storageConfig.getS3().bucket,
  //     ACL: 'public-read',
  //     Body: image,
  //     Key: key,
  //     ContentEncoding: 'base64',
  //     ContentType: `image/${type}`,
  //   }).promise()
  // } catch (err) {
  //   throw new Error(err)
  // }
}

// can not user async & await because of pipe argument type
export const uploadFileS3 = async (url: string, fileKey: string): Promise<string> => {
  const pass = new PassThrough()

  request(url).pipe(pass)

  try {
    const { Location } = await getS3().upload({
      Bucket: storageConfig.bucket,
      Key: fileKey,
      ACL: 'public-read',
      ContentType: 'application/pdf',
      CacheControl: 'public, max-age=31536000',
      Body: pass,
    }).promise()

    return Location
  } catch (err) {
    throw err
  }
}
