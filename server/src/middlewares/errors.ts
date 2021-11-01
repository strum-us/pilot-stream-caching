export const SocketProtocal = 'methods'

export const InternalError = {
  internalRedisSettingError: 'internalRedisSettingError',
  internalRedisValueError: 'internalRedisValueError',
  internalRedisSetError: 'internalRedisSetError',
  internalAnnotationFlushError: 'internalAnnotationFlushError',
  internalInvalidRoomKey: 'internalInvalidRoomKey',
  internalErrorRoomJoinFailed: 'internalErrorRoomJoinFailed',
}

export const ServerLog = {
  redisError: 'Redis error',
  logicalError: 'Logical error',
  databaseError: 'Database error',
  invitationError: 'invitationError',
  interalError: 'Interal Error',
  convertApi: 'convertApi Error',
  S3Error: 'S3 error',
}

export const enum ErrorMessage {
  internalServerError = 'Internal server error',
  invalidGoogleOAuthToken = 'Invalid google oauth token',
  invalidGmailInput = 'Invalid gmail input',
  networkError = 'Network error',
  s3UploadFailed = 'Failed to upload file to aws s3',
  getMailThreads = 'Failed to get mail threads',
  required = 'required argmuent',
}

export const enum GoogleAPIErrorMessage {
  invalidGrant = 'invalid_grant',
  invalidAttachmentToken = 'Invalid attachment token',
  invalidIdValue = 'Invalid id value',
  recipientAddressRequired = 'Recipient address required',
  requestedEntityWasNotFound = 'Requested entity was not found.',
  insufficientPermission = 'Insufficient Permission',
  invalidPageToken = 'Invalid pageToken',
}


export const enum Fails {
  fileConvert = 'fileConvert',
  invalidToken = 'invalidToken',
  noUser = 'noUser',
  abnormalAccess = 'abnormalAccess',
  failConfirmPassword = 'failConfirmPassword',
  wrongPassword = 'wrongPassword',
  alreadyUsedAccountId = 'alreadyUsedAccountId',
  encryptPassword = 'encryptPassword',
  notExistFileWithFileId = 'notExistFileWithFileId',
  notExistFile = 'notExistFile',
  canNotAccess = 'canNotAccess',
  fileUploadFail = 'fileUploadFail',
  fileUploadToS3Fail = 'fileUploadToS3Fail',
  makeThumbnailError = 'makeThumbnailError',
  saveDataError = 'saveDataError',
  notExistData = 'notExistData',
  notExistUser = 'notExistUser',
  createMessageFail = 'createMessageFail'
}

export const enum UserError {
  invalidToken = 'invalidToken',
  invalidArguments = 'invalidArguments',
  noUser = 'noUser',
  abnormalAccess = 'abnormalAccess',
  failConfirmPassword = 'failConfirmPassword',
  wrongPassword = 'wrongPassword',
  alreadyUsedAccountId = 'alreadyUsedAccountId',
  encryptPassword = 'encryptPassword',
  notExistFileWithFileId = 'notExistFileWithFileId',
  notExistFile = 'notExistFile',
  canNotAccess = 'canNotAccess',
  saveDataError = 'saveDataError',
}

export const enum DataError {
  dataNotExist = 'dataNotExist',
}

export const enum SystemError {
  makeMessageFail = 'makeMessageFail',
  fileConvert = 'fileConvert',
  fileUploadFail = 'fileUploadFail',
  fileUploadToS3Fail = 'fileUploadToS3Fail',
  makeThumbnailError = 'makeThumbnailError',
  annotationSaveError = 'annotationSaveError',
}

export const serverMessage = (function() {
  type MessageMap = {
    [key: string]: any
  }

  const messageMap: MessageMap = {}

  messageMap[Fails.notExistFileWithFileId] = (fileId: string) => fileId + ' is not exist'
  messageMap[Fails.fileConvert] = 'There was a problem converting file'
  messageMap[Fails.invalidToken] = 'Your login is expired'
  messageMap[Fails.noUser] = 'Not found user'
  messageMap[Fails.abnormalAccess] = 'It is a invalid request'
  messageMap[Fails.failConfirmPassword] = 'It is error to confirm password currently'
  messageMap[Fails.wrongPassword] = 'Password is incorrect'
  messageMap[Fails.alreadyUsedAccountId] = 'Already used AccountId'
  messageMap[Fails.encryptPassword] = 'Fail to encrypt password for security'
  messageMap[Fails.notExistFile] = 'This is not exist file'
  messageMap[Fails.canNotAccess] = 'You can not access to this conversation.'
  messageMap[Fails.fileUploadFail] = 'File uploading is failed'
  messageMap[Fails.fileUploadToS3Fail] = 'File uploading to s3 is failed'
  messageMap[Fails.makeThumbnailError] = 'Making file thumbnail is failed'
  messageMap[Fails.saveDataError] = 'Save data is failed'

  const serverMessage = (f: Fails): any => {
    return messageMap[f]
  }
  return serverMessage
})()
