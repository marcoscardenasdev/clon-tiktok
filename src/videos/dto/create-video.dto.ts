import { Type } from "class-transformer";
import { IsInt, IsOptional, IsPositive, IsString, IsUrl, Matches, MaxLength, MinLength } from "class-validator";

export class CreateVideoDto {

    @IsString()
    @MaxLength(80)
    public title: string;

    @IsOptional()
    @IsString()
    @MaxLength(280)
    public description: string;

    @IsString()
    @IsUrl()
    public videoUrl: string;

    @IsString()
    @Matches(/@/)
    @MinLength(3)
    public author: string;

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public likes: number;

    constructor(
        title: string,
        description: string,
        videoUrl: string,
        author: string,
        likes: number,
    ) {
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.author = author;
        this.likes =  likes;
    }
}
