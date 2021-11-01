import path from 'path'

export const enum FileType {
  none,
  pdf,
  pdfConvereted,  // originally docx, pptx but converted to pdf from server
  notsupported,
  image,
  video,
  whiteboard,
  screenShare,
}

export const enum ExtensionType {
  none,
  document,   // pdf, pdfConverted, image
  video,      // video
}

export const getExtensionType = (fileName: string): ExtensionType => {
  const fileType = getFileType(fileName)
  if (fileType === FileType.pdf || fileType === FileType.pdfConvereted || fileType === FileType.image) {
    return ExtensionType.document
  } else if (fileType === FileType.video) {
    return ExtensionType.video
  }
  return ExtensionType.none
}

export const getFileType = (fileName: string | null): FileType => {
  if (!fileName) return FileType.none
  if (fileName === 'board') return FileType.whiteboard
  if (fileName === 'screen') return FileType.screenShare

  const extension = path.extname(fileName).toLowerCase()
  const type = extension.split('?')?.[0]

  if (type === '') {
    return FileType.pdf
  }
  return getExtentionType(type)
}

export const getExtentionType = (extension: string): FileType => {
  switch (extension) {
  case '.pdf':
    return FileType.pdf
  case '.apng':
  case '.png':
  case '.jpg':
  case '.jpeg':
  case '.gif':
  case '.ico':
  case '.svg':
  case '.tiff':
  case '.webp':
  case '.bmp':
    return FileType.image
  case '.mp4':
  case '.webm':
  case '.opgg':
  case '.theora':
    return FileType.video

  case '.key':
  case '.numbers':
  case '.pages':
  case '.azv':
  case '.azv1':
  case '.azv3':
  case '.azv4':
  case '.cbc':
  case '.cbr':
  case '.cbz':
  case '.chm':
  case '.djvu':
  case '.epub':
  case '.lit':
  case '.lrf':
  case '.mobi':
  case '.pml':
  case '.prc':
  case '.snb':
  case '.tcr':
  case '.tpz':
  case '.eml':
  case '.mbx':
  case '.msg':
  case '.oft':
  case '.csv': // MICROSOFT OFFICE
  case '.doc':
  case '.docx':
  case '.dot':
  case '.dotx':
  case '.log':
  case '.mpp':
  case '.mpt':
  case '.pot':
  case '.potx':
  case '.pps':
  case '.ppsx':
  case '.ppt':
  case '.pptx':
  case '.pub':
  case '.rtf':
  case '.txt':
  case '.vdx':
  case '.vsd':
  case '.vsdx':
  case '.vst':
  case '.vstx':
  case '.wpd':
  case '.wps':
  case '.wri':
  case '.xls':
  case '.xlsb':
  case '.xlsx':
  case '.xlt':
  case '.xltx':
  case '.mml':   // OPENOFFICE
  case '.odc':
  case '.odf':
  case '.odg':
  case '.odi':
  case '.odm':
  case '.odp':
  case '.ods':
  case '.odt':
  case '.otg':
  case '.oth':
  case '.otp':
  case '.ots':
  case '.pxl':
  case '.sgl':
  case '.smf':
  case '.srw':
  case '.stc':
  case '.sti':
  case '.stw':
  case '.sxc':
  case '.sxg':
  case '.sxi':
  case '.sxm':
  case '.sxw':
  case '.vor':
  case '.wv2':
  case '.123': // OTHER
  case '.12m':
  case '.eps':
  case '.fax':
  case '.heic':
  case '.htm':
  case '.html':
  case '.lwp':
  case '.mdi':
  case '.mwp':
  case '.oxps':
  case '.prn':
  case '.ps':
  case '.sam':
  case '.tif':
  case '.wk1':
  case '.wk2':
  case '.wk3':
  case '.xps':
  case '.web':
    return FileType.pdfConvereted
  default:
    return FileType.none
  }
}
