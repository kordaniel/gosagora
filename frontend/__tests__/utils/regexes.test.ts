import { isBackendUrlRegex } from '../../src/utils/regexes';

describe('Regexes', () => {

  describe('isBackendUrlRegex', () => {

    it('Matches urls that are of correct format', () => {
      const acceptedUrls = [
        'http://localhost:1234',
        'https://localhost:3000',
        'https://www.some.long.url.with.port:9000',
        'http://192.168.0.23:9000',
      ];
      acceptedUrls.forEach(url => {
        expect(url).toMatch(isBackendUrlRegex);
      });
    });

    it('Does not match urls that are not of correct format', () => {
      const invalidUrls = [
        '',                                 // Empty string
        'http://localhost',                 // Missing port
        'http://localhost:1000:2000',       // Double port
        'localhost:1234',                   // Missing scheme
        'htp://example.com:1000',           // Misspelled scheme
        'http//example.com:1000',           // Missing colon
        '://example.com:1000',              // Missing scheme
        'http:/example.com:1000',           // Single slash
        'http://:1000',                     // No host
        'http://?query:1000',               // No host, only query
        'http://#fragment:1000',            // No host, only fragment
        'http://example..com:1000',         // Double dot in domain
        'http://.com:1000',                 // No domain name
        'http://example.com:-80:1000',      // Invalid port
        'http://example.com:port',          // Non-numeric port
        'http://example .com:1000',         // Space in domain
        'http://exa mple.com:1000',         // Space in domain
        'http://example.com/foo bar:1000',  // Space in path
        'ftp:/example.com:1000',            // Invalid FTP scheme
        'http://exa\nmple.com:1000',        // Newline in domain
        'http://<script>.com:1000',         // Potentially dangerous characters
        'http://example.com/<>:1000',       // Illegal characters in path
      ];
      invalidUrls.forEach(url => {
        expect(url).not.toMatch(isBackendUrlRegex);
      });
    });

  }); // isBackendUrlRegex

}); // Regexes
