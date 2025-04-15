/**
 * This regex is by no means a valid url format tester, it only checks whether the
 * string has a valid shape to be considered a bakend url.
 */
export const isBackendUrlRegex = /^(?:https?:\/\/)((?:(www.)?(?:[a-zA-Z]+.?)+)|(?:(\d{1,3}\.){3}\d{1,3})):\d{4}$/;
