const { JSDOM } = require('jsdom')

function normalizeURL(urlString) {
    const url = new URL(urlString)
    
    const hostPath = `${url.hostname}${url.pathname}`
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1)
    }
    else {
        return hostPath
    }
}

/**
 * 
 * @param {*} htmlBody : Page Content
 * @param {*} baseURL : URL of the page crawled
 */
function getURLsFromHTML(htmlBody, baseURL) {
    const urls = []

    // Creating a dom represeting the html body
    const dom = new JSDOM(htmlBody)

    // Retrieve list of all the a tags in the dom
    const linkElements = dom.window.document.querySelectorAll('a')
    
    for (const linkElement of linkElements) {
        // Verify if the first caracter is a / => relative URL
        if (linkElement.href.slice(0, 1) === '/') {
            try {
                const url = new URL(`${baseURL}${linkElement.href}`)
                urls.push(url.href)
            } catch (err) {
                console.log(`error invalid url : ${err.message}`)
            }
        } else {
            try {
                const url = new URL(linkElement.href)
                urls.push(url.href)
            } catch (err) {
                console.log(`error invalid url : ${err.message}`)
            }
        }
    }

    //linkElements.map(link => console.log(link.href))
    return urls
}

/**
 * 
 */
async function crawlPage(baseURL, currentURL, pages) {
    const baseURLObj = new URL(baseURL) 
    const currentURLObj = new URL(currentURL) 
    if (baseURLObj.hostname !== currentURLObj.hostname) {
        return pages
    }

    const normalizedCurrentURL = normalizeURL(currentURL)
    if (pages[normalizedCurrentURL] > 0) {
        pages[normalizedCurrentURL]++
        return pages
    }

    pages[normalizedCurrentURL] = 1

    console.log(`crawling on ${currentURL}`)

    try {
        const res = await fetch(currentURL)

        if (res.status > 399) {
            console.log(`error fetching status code: ${res.status} crawling page ${currentURL}`)
            return pages
        }

        const contentType = res.headers.get('Content-Type')
        if (!contentType.includes('text/html')) {
            console.log(`non html response, content type: ${contentType} crawling page ${currentURL}`)
        }

        const htmlBody = await res.text()

        nextURLs = getURLsFromHTML(htmlBody, baseURL)

        for(const nextURL of nextURLs) {
            pages = await crawlPage(baseURL, nextURL, pages)
        }

    } catch (err) {
        console.log(`error : ${err.message} crawling page: ${currentURL}`)
    }
    
    return pages
}

module.exports = {
    normalizeURL,
    getURLsFromHTML,
    crawlPage,
}