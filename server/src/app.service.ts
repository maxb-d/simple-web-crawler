import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return '🕸 The Crawling Machine Backend 🕸';
  }

  crawl(url: string): string {
    console.log(`crawling ${url} ...`)
    return `Crawling ${url} ...`
  }
}
