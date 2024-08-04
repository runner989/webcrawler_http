import { getURLsFromHTML, crawlPage } from "./crawl.js";
// import { argv } from 'node:process';
// import fetch from 'node-fetch';

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
    const pages = await crawlPage(baseURL);
    console.log("Crawling result:");
    console.log(pages);
}    

main();
