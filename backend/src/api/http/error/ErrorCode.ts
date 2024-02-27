import { UNAUTHORIZED } from '../../../common/validation/v1/models/Error';
export enum ErrorCode {
  EMPTY = '',
  INVALID_AUTH_HEADER = "You didn't send the API Key in the Authorization header to an endpoint that requires authentication.",
  INTERNAL_SERVER_ERROR = 'There was an un-recoverable error, please try again',
  SESSION_NOT_FOUND = 'Session not found',
}
