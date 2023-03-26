import { Injectable } from '@nestjs/common';
import { CrawlDto } from './dto/CrawlDto';
const { JSDOM } = require('jsdom')

type PageElem = {
    url: string,
    iterations: number
}
@Injectable()
export class CrawlerService {

    async crawl(dto: CrawlDto) {
        let pages: PageElem[][] = []
        console.log(`Crawling ${dto.url}`)
        pages = await this.crawlPage(dto.url, dto.url, pages)
        console.log("Logging found pages: ")
        for (const page of Object.entries(pages)){
            console.log(page)
        }
        return pages
    }

    /**
     * 
     * @param {*} htmlBody : Page Content
     * @param {*} baseURL : URL of the page crawled
    */
    getURLsFromHTML(htmlBody: any, baseURL: string) {
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

        return urls
    }

    async crawlPage(baseURL: string, currentURL: string, pages: any) {
        const baseURLObj = new URL(baseURL)
        const currentURLObj = new URL(currentURL)
        
        if(baseURLObj.hostname !== currentURLObj.hostname) {
            return pages
        }

        if (pages[currentURL] > 0) {
            pages[currentURL]++
            return pages
        }

        pages[currentURL] = 1
        console.log(`Crawling page ${currentURL}`)

        try {
            const res = await fetch(currentURL)

            if (res.status > 399) {
                console.log(`error fetching status code: ${res.status} crawling page ${currentURL}`)
                return pages
            }

            const contentType: null | string = res.headers.get('Content-Type')
            if (!contentType?.includes('text/html')) {
                console.log(`non html response, content type: ${contentType} crawling page ${currentURL}`)
            }

            const htmlBody = await res.text()

            const nextURLs = this.getURLsFromHTML(htmlBody, baseURL)

            for(const nextURL of nextURLs) {
                pages = await this.crawlPage(baseURL, nextURL, pages)
            }
        } catch (err) {
            console.log(`error : ${err.message} crawling page: ${currentURL}`)
        }
        
        return pages
    }
}
