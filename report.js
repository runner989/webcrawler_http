function sortPages(pages) {
    const pagesArray = Object.entries(pages);
    pagesArray.sort((a,b) => b[1] - a[1]);
    return pagesArray;
}

function printReport(pages) {
    console.log("Starting report...");
    const sortedPages = sortPages(pages);
    sortedPages.forEach(([url, count]) => {
        console.log(`Found ${count} internal links to ${url}`);
    });
}

export { printReport, sortPages };