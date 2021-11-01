import { ApolloError } from 'apollo-server-express'
import { ErrorMessage } from '../errors'

export class ServerError extends ApolloError {
  constructor(message: ErrorMessage, err: Error) {
    super(message, 'INTERNAL_SERVER_ERROR')
    this.origin = err
  }
}

export class InternalServerError extends ServerError {
  constructor(err: Error) {
    super(ErrorMessage.internalServerError, err)
    // sendServerErrorMail(err)
  }
}

export class FetchError extends ServerError {
  constructor(err: Error) {
    super(ErrorMessage.networkError, err)
    // sendServerErrorMail(err)
  }
}

export class S3UploadError extends ServerError {
  constructor(err: Error) {
    super(ErrorMessage.s3UploadFailed, err)
    // sendServerErrorMail(err)
  }
}
