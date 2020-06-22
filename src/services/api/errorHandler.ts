import { fallbackError, getStatusMessage } from './errors';

function parseErrorMessage(body: { code: number; message?: string }) {
  // TODO:
  // Do not do this when the server starts to send
  // readable error messages.
  let [message] = (body.message || '').split(';');
  return message || fallbackError.message;
}

export interface NormalizedError {
  code?: number | string;
  status?: number;
  message: string;
}

function assignTruthyValues<T>(obj1: T, obj2: object) {
  for (let key in obj2) {
    if (obj2[key] != null) {
      obj1[key] = obj2[key];
    }
  }
  return obj1;
}

function normalizeError(requestError: any): NormalizedError {
  /**
   * Possible errors that the server can send are:
   *
   * { errorCode: number, message: string } |
   * { error: string, error_description: string }
   *
   * These objects are found in `requestError.response.body`.
   *
   * If the server fails to send a message (e.g. 5xx errors),
   * then we expect the `requestError` to be at least
   * { status: number, message?: string }
   *
   * Another possibility is going offline. In that case `status` is undefined,
   * and we only have a `message` set by the browser:
   * { message: string }
   */

  const { code: fallbackCode, message: fallbackMessage } = fallbackError;
  const error: NormalizedError = {
    code: fallbackCode,
    status: null,
    message: requestError.status
      ? getStatusMessage(requestError.status)
      : fallbackMessage,
  };

  const collectedData: any = {};

  if (requestError.response && requestError.response.body) {
    // Error description is provided by the server
    const { error_description, error, errorCode } = requestError.response.body;
    collectedData.message =
      parseErrorMessage(requestError.response.body) || error_description;
    collectedData.code = errorCode || error;
  } else if (requestError.status != null) {
    collectedData.status = requestError.status;
  } else if (requestError.message) {
    // offline errors
    collectedData.message = requestError.message;
  }

  return assignTruthyValues(error, collectedData);
}

export function errorHandler<T>(error: any): T {
  throw normalizeError(error);
}
