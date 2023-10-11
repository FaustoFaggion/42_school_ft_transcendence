import { Body, Controller, Post, UseInterceptors } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthLoginDto } from "src/auth/dtos/input.dtos";
import { UserPerfilDto } from "src/users/dtos/output.dtos";
import { OutputLoginDto } from "./dtos/output.dtos";
import { Express } from "express";

@Controller('auth')
export class AuthController {

	constructor(private readonly service: AuthService) {}

	@Post()
	async mainLogin(@Body() code: AuthLoginDto): Promise<OutputLoginDto> {
		return await this.service.mainLogin(code)
	}


}