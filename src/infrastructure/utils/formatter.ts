export const formatErrorCode = (message: string) =>
  message.toUpperCase().split(' ').join('_');
