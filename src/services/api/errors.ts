export const fallbackError = {
  code: 'UNKNOWN',
  message: 'Неизвестная ошибка',
};

export const statusMessages = {
  400: 'Ошибка запроса',
  401: 'Запрос запрещён',
  403: 'Ошибка авторизации',
  404: 'Не найдено',
  500: 'Неизвестная ошибка',
  default: fallbackError.message,
};

export function getStatusMessage(status: number) {
  return status in statusMessages
    ? statusMessages[status]
    : statusMessages.default;
}
