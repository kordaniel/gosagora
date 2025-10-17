export type ParseResult<T> =
  | { parsed: T; hasError: false; error?: undefined }
  | { parsed?: undefined; hasError: true; error: string };

export const parseJSON = <T>(typeGuard: (param: unknown) => param is T) =>
  (jsonData: string): ParseResult<T> => {
    try {
      const parsed = JSON.parse(jsonData) as unknown;
      return typeGuard(parsed)
        ? { parsed, hasError: false }
        : {
            hasError: true,
            error: `Type validation failed after parsing JSON input: "${jsonData}"`
          };
    } catch (error: unknown) {
      return {
        hasError: true,
        error: `Failed to parse JSON input: ${error instanceof Error ? error.message : JSON.stringify(error)}`
      };
    }
  };
