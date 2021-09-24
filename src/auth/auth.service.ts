import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';

import { KeycloakService } from './keycloak.service';

type LoginResponse = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  refresh_expires_in: number;
};

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(private readonly keycloakService: KeycloakService) {}

  async login(username: string, password: string): Promise<LoginResponse> {
    const { access_token, expires_in, refresh_token, refresh_expires_in } =
      await this.keycloakService.login(username, password).catch(() => {
        throw new UnauthorizedException();
      });

    return {
      access_token,
      refresh_token,
      expires_in,
      refresh_expires_in,
    };
  }

  async getProfile(accessToken: string) {
    this.logger.log('Getting user profile...');

    return this.keycloakService.getUserInfo(accessToken).catch(() => {
      throw new UnauthorizedException();
    });
  }

  async refreshToken(refreshToken: string): Promise<LoginResponse> {
    const { access_token, expires_in, refresh_token, refresh_expires_in } =
      await this.keycloakService.refreshToken(refreshToken).catch(() => {
        throw new UnauthorizedException();
      });

    return {
      access_token,
      refresh_token,
      expires_in,
      refresh_expires_in,
    };
  }

  async logout(refreshToken: string) {
    await this.keycloakService.logout(refreshToken).catch(() => {
      throw new UnauthorizedException();
    });
  }
}
