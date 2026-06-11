import { IsEmail, IsString, Matches, MinLength } from "class-validator";

export class RegisterUserDto {

    @IsString()
    @MinLength(3)
    @Matches(/@/)
    public username: string;

    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(8)
    public password: string;

    constructor(
        username: string,
        email: string,
        password: string,
    ) {
        this.username = username;
        this.email = email;
        this.password = password;
    }
}
