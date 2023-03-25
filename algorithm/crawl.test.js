const { normalizeURL, getURLsFromHTML } = require('./crawl')
const { test, expect } = require('@jest/globals')

/**
 * Normalize URLs tests
 */
test('normalizeURL hostname and path retrive', () => {
    const input = 'https://google.com'
    const actual = normalizeURL(input)
    const expected = 'google.com'

    expect(actual).toEqual(expected)
})

test('normalizeURL trailing slash', () => {
    const input = 'https://google.com/'
    const actual = normalizeURL(input)
    const expected = 'google.com'

    expect(actual).toEqual(expected)
})

test('normalizeURL capitals strip', () => {
    const input = 'https://GOOGLE.com/'
    const actual = normalizeURL(input)
    const expected = 'google.com'

    expect(actual).toEqual(expected)
})

test('normalizeURL protocols', () => {
    const input = 'http://google.com/'
    const actual = normalizeURL(input)
    const expected = 'google.com'

    expect(actual).toEqual(expected)
})

/**
 * get URLs from HTML tests
 */
test('getURLsFromHTML absolute', () => {
    const htmlBody = `
        <html>
            <body>
                <a href="https://google.com/">
                    Google splash
                </a>
            </body>
        </html>
    `
    const baseURL = "https://google.com"

    const actual = getURLsFromHTML(htmlBody, baseURL)
    const expected = ["https://google.com/"]

    expect(actual).toEqual(expected)
})

test('getURLsFromHTML relative', () => {
    const htmlBody = `
        <html>
            <body>
                <a href="/path/">
                    Google splash
                </a>
            </body>
        </html>
    `
    const baseURL = "https://google.com"

    const actual = getURLsFromHTML(htmlBody, baseURL)
    const expected = ["https://google.com/path/"]

    expect(actual).toEqual(expected)
})

test('getURLsFromHTML both', () => {
    const htmlBody = `
        <html>
            <body>
                <a href="https://google.com/path1/">
                    Google splash path 1
                </a>
                <a href="/path2/">
                    Google splash path 2
                </a>
            </body>
        </html>
    `
    const baseURL = "https://google.com"

    const actual = getURLsFromHTML(htmlBody, baseURL)
    const expected = ["https://google.com/path1/", "https://google.com/path2/"]

    expect(actual).toEqual(expected)
})

test('getURLsFromHTML bad URL', () => {
    const htmlBody = `
        <html>
            <body>
                <a href="invalid">
                    Google splash path 1
                </a>
            </body>
        </html>
    `
    const baseURL = "https://google.com"

    const actual = getURLsFromHTML(htmlBody, baseURL)
    const expected = []

    expect(actual).toEqual(expected)
})