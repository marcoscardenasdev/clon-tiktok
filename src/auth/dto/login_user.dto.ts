import { IsEmail, IsString, MinLength } from "class-validator";

export class LoginUserDto {

    @IsEmail()
    public email: string;

    @IsString()
    @MinLength(8)
    public password: string;

    constructor(
        email: string,
        password: string,
    ) {
        this.email = email;
        this.password = password;
    }
    
}
