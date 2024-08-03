import { URL } from 'node:url';
import { JSDOM } from 'jsdom';


function normalizeURL(Url) {
    const parsedURL = new URL(Url);
    const hostname = parsedURL.hostname;
    let pathname = parsedURL.pathname;

    if (pathname.endsWith('/')) {
        pathname = pathname.slice(0, -1);
    }

    return `${hostname}${pathname}`;
}

function getURLsFromHTML(htmlBody, baseURL) {
    const dom = new JSDOM(htmlBody);
    const anchorElements = dom.window.document.querySelectorAll('a');
    const urls = [];

    anchorElements.forEach(anchor => {
        let href = anchor.getAttribute('href');
        if (href) {
            try {
                const url = new URL(href, baseURL);
                if(!url.href.includes('invalid-url')){
                    const normalizedUrl = normalizeURL(url.href);
                    if (normalizedUrl) {
                        urls.push(normalizedUrl);
                    }
                }
            } catch (err) {
                console.error(`Invalid URL: $(href)`);
            }
        }
    });
    return urls;
}


export { normalizeURL, getURLsFromHTML };

