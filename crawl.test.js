import { test, expect } from "@jest/globals";
import { normalizeURL } from "./crawl.js";

describe('normalizeURL module', () => {
  test('normalizes URL to blog.boot.dev/path', () => {
    expect(normalizeURL('https://blog.boot.dev/path/')).toBe('blog.boot.dev/path');
  });
})
