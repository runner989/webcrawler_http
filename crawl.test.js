import { test, expect } from "@jest/globals";
import { getURLsFromHTML, normalizeURL } from "./crawl.js";

describe('normalizeURL module', () => {
  test('normalizes URL to blog.boot.dev/path', () => {
    expect(normalizeURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
  });

  test('normalizeURL protocol', () => {
    const input = 'https://blog.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })

  test('normalizeURL slash', () => {
    const input = 'https://blog.boot.dev/path/'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })

  test('normalizeURL capitals', () => {
    const input = 'https://BLOG.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })

  test('normalizeURL http', () => {
    const input = 'http://BLOG.boot.dev/path'
    const actual = normalizeURL(input)
    const expected = 'blog.boot.dev/path'
    expect(actual).toEqual(expected)
  })
})

describe('Get URLs from HTML module', () => {
  test('Extract and normalize URLs from HTML', () => {
    const htmlBody = `
      <html>
        <body>
          <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
          <a href="/relative/path"><span>Relative Link</span></a>
          <a href="#fragment"><span>Fragment Link</span></a>
        </body>
      </html>
    `;
    const baseURL = 'https://www.boot.dev';
  
    const urls = getURLsFromHTML(htmlBody, baseURL);
  
    expect(urls).toEqual([
      'blog.boot.dev',
      'www.boot.dev/relative/path',
      'www.boot.dev',
    ]);
  });
  
  test('Ignore invalid URLs', () => {
    const htmlBody = `
      <html>
        <body>
          <a href="https://blog.boot.dev"><span>Go to Boot.dev</span></a>
          <a href="invalid-url"><span>Invalid URL</span></a>
        </body>
      </html>
    `;
    const baseURL = 'https://www.boot.dev';
  
    const urls = getURLsFromHTML(htmlBody, baseURL);
  
    expect(urls).toEqual(['blog.boot.dev']);
  });

  test('getURLsFromHTML absolute', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="https://blog.boot.dev"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'blog.boot.dev' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML relative', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'blog.boot.dev/path/one' ]
    expect(actual).toEqual(expected)
  })
  
  test('getURLsFromHTML both', () => {
    const inputURL = 'https://blog.boot.dev'
    const inputBody = '<html><body><a href="/path/one"><span>Boot.dev></span></a><a href="https://other.com/path/one"><span>Boot.dev></span></a></body></html>'
    const actual = getURLsFromHTML(inputBody, inputURL)
    const expected = [ 'blog.boot.dev/path/one', 'other.com/path/one' ]
    expect(actual).toEqual(expected)
  })
})
