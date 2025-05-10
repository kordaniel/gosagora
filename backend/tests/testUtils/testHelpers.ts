export const generateRandomString = (
  length: number,
  srcChars: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
): string => {
  return Array.from({ length }).map(
    () => srcChars.charAt(Math.floor(Math.random() * srcChars.length))
  ).join('');
};

export const shuffleString = (str: string): string => {
  return str.split('').sort(() => Math.random() - 0.5).join('');
};
