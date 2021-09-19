import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';

type LoginRequestBody = {
  username: string;
  password: string;
};

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() body: LoginRequestBody) {
    const { username, password } = body;

    return this.authService.login(username, password);
  }
}
