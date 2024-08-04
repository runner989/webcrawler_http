import { URL } from 'node:url';
import { JSDOM } from 'jsdom';
import fetch from 'node-fetch';

function normalizeURL(url, baseURL) {
    try {
        const parsedURL = new URL(url, baseURL);
        let { hostname, pathname } = parsedURL;
        if (pathname.endsWith('/')) {
            pathname = pathname.slice(0, -1);
        }
        return `${hostname}${pathname}`;
    } catch (err) {
        console.log(`Error normalizing URL: ${url} - ${err.message}`);
        return null;
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const anchorElements = dom.window.document.querySelectorAll('a');

    anchorElements.forEach(anchor => {
        let href = anchor.getAttribute('href');
        if (href) {
            try {
                href = new URL(href, baseURL).href;
                if (!shouldFilterURL(href)) {
                    urls.push(href);
                }
            } catch (err) {
                console.log(`${err.message}: ${href}`);
            }; 
        };
    });
    return urls;

}

function shouldFilterURL(url) {
    const disallowedExtensions = ['.xml', '.jpg', '.jpeg', '.png', '.gif', '.pdf', '.doc', '.docx', '.ppt', '.pptx', '.xls', '.xlsx'];
    return disallowedExtensions.some(ext => url.endsWith(ext));
}

async function fetchHTML(url) {
    console.log(`Fetching ${url}`);
    let response;
    try {
        response = await fetch(url);
    } catch (err) {
        throw new Error(`Got Network error: ${err.message}`);
    }   
    if (response.status >= 400) {
      throw new Error(`Error: Received status code ${response.status} for ${url}`);
    }
  
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('text/html')) {
      throw new Error(`Error: Received non-HTML content-type ${contentType} for ${url}`);
    }
    return response.text();
  }

async function crawlPage(baseURL, currentURL = baseURL, pages = {}, visited = new Set()) {
    const baseDomain = new URL(baseURL).hostname;
    const currentDomain = new URL(currentURL).hostname;

    // Step 1: Check if currentURL is on the same domain as baseURL
    if (baseDomain !== currentDomain) {
        console.log(`Skipping ${currentURL} - not on the same domain as ${baseURL}`);
        return pages;
    }

    // Step 2: Get normalized version of currentURL
    const normalizedURL = normalizeURL(currentURL, baseURL);
    if (!normalizedURL) {
        console.error(`Skipping invalid normalized URL: ${currentURL}`);
        return pages;
    }

    // Step 3: Check if the URL has already been visited
    if (visited.has(normalizedURL)) {
        console.log(`Already visited ${normalizedURL}`);
    }
    visited.add(normalizedURL);
    
    // Step 4: Handle page count in the pages object    
    if (pages[normalizedURL]) {
        pages[normalizedURL]++;
        return pages;
    }
    pages[normalizedURL] = 1;

    let htmlBody = '';
    try {
        // Step 5: Fetch and parse HTML
        htmlBody = await fetchHTML(currentURL);
    } catch (err) {
        console.log(`${err.message}`);
        return pages;
    }
    
    // Step 6: get all URLs from the html body
    const urls = getURLsFromHTML(htmlBody, baseURL);        
    // Step 7: Recursively crawl each URL
    for (const url of urls) {
        await crawlPage(baseURL, url, pages, visited);
    }

    return pages;
}


export { normalizeURL, getURLsFromHTML, crawlPage };

