import { Controller, Post, Body } from '@nestjs/common';
import { CrawlerService } from './crawler.service';
import { CrawlDto } from './dto/CrawlDto';

@Controller('crawler')
export class CrawlerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('crawl')
  crawl(@Body() dto: CrawlDto) {
    console.log("dto = ", dto)
    console.log("crawler post")
    return this.crawlerService.crawl(dto)
  }
}
