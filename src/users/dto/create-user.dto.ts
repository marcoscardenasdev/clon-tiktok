import { IsEmail, IsOptional, IsString, Matches, MinLength } from "class-validator";

export class CreateUserDto {

    @IsString()
    @MinLength(3)
    @Matches(/@/)
    public username: string;

    @IsEmail()
    public email: string;

    // TODO: Realizar las validaciones para este campo
    @IsString()
    @MinLength(8)
    public password: string;

    @IsOptional()
    @IsString()
    public bio?: string;

    constructor(username: string, email: string, bio: string, password: string) {
        this.username = username;
        this.email = email;
        this.bio = bio;
        this.password = password;
    }
}
