export const generateRandomString = (
  length: number,
  srcChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
  return Array.from({ length }).map(
    () => srcChars.charAt(Math.floor(Math.random() * srcChars.length))
  ).join('');
};
