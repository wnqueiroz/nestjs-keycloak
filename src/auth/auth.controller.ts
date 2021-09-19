import {
  Body,
  Request,
  Controller,
  Get,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';

type LoginRequestBody = {
  username: string;
  password: string;
};

type RefreshTokenRequestBody = {
  refresh_token: string;
};

@Controller('/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  login(@Body() body: LoginRequestBody) {
    const { username, password } = body;

    return this.authService.login(username, password);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/me')
  getProfile(@Request() req: Request) {
    const { authorization } = req.headers as any;

    const [, accessToken] = authorization.split(' ');

    return this.authService.getProfile(accessToken);
  }

  @Post('/refresh')
  refreshToken(@Body() body: RefreshTokenRequestBody) {
    const { refresh_token: refreshToken } = body;

    return this.authService.refreshToken(refreshToken);
  }
}
