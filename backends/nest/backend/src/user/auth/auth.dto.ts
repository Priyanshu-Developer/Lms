import { IsString, Matches } from "class-validator";

export class VerifyDto {  
  @IsString()
  @Matches(/^[a-f0-9-]{36}$/, { message: "Invalid ID format" })
  id: string;

  @IsString()
  @Matches(/^[0-9]{6}$/, { message: "Invalid code format" })
  code: string;
}