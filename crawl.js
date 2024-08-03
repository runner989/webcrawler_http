import { URL } from 'node:url';

function normalizeURL(Url) {
    const parsedURL = new URL(Url);
    const hostname = parsedURL.hostname;
    let pathname = parsedURL.pathname;

    if (pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
    }

    return `${hostname}${pathname}`;
}



export { normalizeURL };

