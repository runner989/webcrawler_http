import { URL } from 'node:url';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

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

async function crawlPage(currentURL) {
    try {
        const response = await fetch(currentURL);

        if (response.status >= 400) {
            console.error(`Error: Received status code ${response.status} for ${currentURL}`);
            return;
        }
        
        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('text/html')) {
            console.error(`Error: Received non-HTML content-type ${contentType} for ${currentURL}`);
            return;
        }

        const htmlBody = await response.text();
        console.log(htmlBody);
    } catch (error) {
        console.error(`Error during fetching ${currentURL}: ${error.message}`);
    }

}


export { normalizeURL, getURLsFromHTML, crawlPage };

