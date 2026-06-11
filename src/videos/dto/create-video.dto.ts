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

    @IsOptional()
    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public likes: number;

    constructor(
        title: string,
        description: string,
        videoUrl: string,
        likes: number,
    ) {
        this.title = title;
        this.description = description;
        this.videoUrl = videoUrl;
        this.likes =  likes;
    }
}
