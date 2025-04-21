import { stripCredentialsFromDBUri } from '../../src/utils/helpers';

describe('Helpers', () => {

  describe('stripCredentialsFromDBUri', () => {

    test('Obfuscates credentials from valid URI', () => {
      const uri = 'postgres://user:pass@localhost:5432/postgres';
      expect(stripCredentialsFromDBUri(uri)).toEqual('postgres://<..>@localhost:5432/postgres');
    });

    test('Obfuscates only the part between the schema separator and the first occurence of character @', () => {
      const uri = 'mysql://user:pass@cloud.db@long.url.here.with.many@:2314/mydb/path';
      expect(stripCredentialsFromDBUri(uri)).toEqual('mysql://<..>@cloud.db@long.url.here.with.many@:2314/mydb/path');
    });

    test('Throws error if URI lacks scheme separator', () => {
      const uri = 'postgres:user:pass@localhost:5432/postgres';
      expect(() => { stripCredentialsFromDBUri(uri); }).toThrow(
        'Unable to parse DB_URI string. The string should contain exactly one occurence of the substring "//"'
      );
    });

    test('Returns identical string if URI lacks the character @', () => {
      const uri = 'postgres://localhost:5432/postgres';
      expect(stripCredentialsFromDBUri(uri)).toEqual(uri);
    });

    test('Does not mutate scheme part of URI if it contains the character @', () => {
      const uri = 'm@ngo://user:pass@cloud.db.long.url.here:2314/postgres';
      expect(stripCredentialsFromDBUri(uri)).toEqual('m@ngo://<..>@cloud.db.long.url.here:2314/postgres');
    });

  }); // stripCredentialsFromDBUri

}); // Helpers
