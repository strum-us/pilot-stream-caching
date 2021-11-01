import { dataUrlToFile } from '../file-uploader/utils/convertImage'
import { useUploadFile } from '../file-uploader'
import uuid from 'short-uuid'
const translator = uuid()

export function useImageUpload() {
  const { uploadSingleFile } = useUploadFile()

  const imageUploadByUrl = async (dataUrl: string, fileName?: string) => {
    const name = fileName ?? translator.generate()
    const file = await dataUrlToFile(dataUrl, name)
    const result = await uploadSingleFile(name, file)
    // const uploaded = await uploadFile(file.name, file)
    // const url = uploaded?.data.url

    console.log('imageUploadByUrl', { dataUrl, file, fileName, resultName: result.url })
    return result.url
  }

  const imageUploadByFile = async (file: Blob, fileName: string) => {
    console.log('imageUploadByFile', { fileName })
    // const name = fileName ?? translator.generate()
    // const uploaded = await uploadFile(name, file)
    // const url = uploaded?.data.url
    const result = await uploadSingleFile(fileName, file)
    console.log(result, result.url)
    return result.url
  }

  return {
    imageUploadByUrl,
    imageUploadByFile,
  }
}
