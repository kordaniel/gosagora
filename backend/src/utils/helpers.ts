export const snakeToCamelCase = (str: string): string => {
  if (!(/_[a-z]/).test(str) || (/_[A-Z]|-([a-z]|[A-Z])/).test(str) ) {
    return str;
  }

  return str.replace(/(_[a-z])/g, group =>
    group.toUpperCase().replace('_', '')
  );
};

/**
 * Returns a new string that is identical to the one passed in as the
 * only argument, but with all characters between the only allowed
 * substring "//" and the first following "@" character removed.
 * If the string contains no @ characters the original string is returned.
 *
 * NOTE: that this will not obfuscate the credentials if passed a string
 * where the first @ character preceeds the credentials in the string.
 *
 * @param uri DB_URI to obfuscate.
 * @returns Obfuscated string.
 */
export const stripCredentialsFromDBUri = (uri: string): string => {
  const parts = uri.split('//');

  if (parts.length !== 2) {
    // NOTE: Do not log the actual string as it might contain sensitive data.
    throw new Error(
      'Unable to parse DB_URI string. The string should contain exactly one occurence of the substring "//"'
    );
  }

  if (!parts[1].includes('@')) {
    return uri;
  }

  return `${parts[0]}//<..>@${parts[1].split('@').slice(1).join('@')}`;
};
