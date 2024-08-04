import { getURLsFromHTML, crawlPage } from "./crawl.js";
import { argv } from 'node:process';
import fetch from 'node-fetch';

async function main() {
    const args = process.argv.slice(2);

    if (args.length < 1) {
        console.error("Error: Please provide a base URL as the only argument.");
        process.exit(1);
    }
    if (args.length > 1) {
        console.error("Error: Too many arguments provided. Please provide only one base URL.");
        process.exit(1);
    }
    const baseURL = args[0];
    console.log(`Starting crawler at ${baseURL}`);

    await crawlPage(baseURL);
    // try {
    //     const response = await fetch(baseURL);
    //     if (!response.ok) {
    //       throw new Error(`Failed to fetch ${baseURL}: ${response.statusText}`);
    //     }
    
    //     const htmlBody = await response.text();
    //     const urls = getURLsFromHTML(htmlBody, baseURL);
    
    //     console.log('Found URLs:');
    //     urls.forEach(url => console.log(url));
    // } catch (error) {
    //     console.error(`Error during crawling: ${error.message}`);
    // }
}    

main();
