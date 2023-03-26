import { IsUrl, IsNotEmpty } from "class-validator"

export class CrawlDto {
    @IsNotEmpty()
    @IsUrl()
    public url: string
}