import { crawlPage } from "./crawl.js";
import { printReport } from "./report.js";

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
    printReport(pages);
}    

main();
