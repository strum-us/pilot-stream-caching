import uuid from 'short-uuid'
const short = uuid()

export const pureFileName = (name: string): string => {
  if (!name || !name.split) {
    return ''
  }
  const seps = name.split('_')
  let result = ''
  for (let i = 1; i < seps.length; i++) {
    if (i >= 2) {
      result += '_'
    }
    result += seps[i]
  }
  return result
}

export const fileNameToname = (fileName: string) => {
  return short.generate() + '_' + fileName
}

export const originalToConvertedPDFFileName = (name: string) => {
  if (name) {
    const attrs = name.split('.')
    let result = ''
    for (let i = 0; i < attrs.length; i++) {
      if (i === attrs.length - 1) {
        result += 'pdf'
      } else {
        result += (attrs[i] + '.')
      }
    }
    return result
  } else {
    return ''
  }
}

export const isImage = (type: string) => {
  return type.indexOf('image') !== -1
}
