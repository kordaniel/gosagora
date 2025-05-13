export type AssertEqual<T, U> = (
  <V>() => V extends T ? 1 : 2
) extends <V, >() => V extends U ? 1 : 2
  ? true
  : false;

export type EnvironmentType =
  | 'production'
  | 'development'
  | 'test'
  | 'test-production'; // Simulate production, with test db
