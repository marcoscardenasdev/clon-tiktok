import { Type } from "class-transformer";
import { IsInt, IsPositive, IsString, MaxLength } from "class-validator";

export class CreateCommentDto {

    @IsString()
    @MaxLength(200)
    public text: string;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    public userId: number;

    constructor(text: string, userId: number) {
        this.text = text;
        this.userId = userId;
    }
}
