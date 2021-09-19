import { Injectable, UnauthorizedException } from '@nestjs/common';

import { KeycloakService } from './keycloak.service';

@Injectable()
export class AuthService {
  constructor(private readonly keycloakService: KeycloakService) {}

  async login(username: string, password: string) {
    const { access_token, expires_in } = await this.keycloakService
      .login(username, password)
      .catch(() => {
        throw new UnauthorizedException();
      });

    return {
      access_token,
      expires_in,
    };
  }

  async getProfile(accessToken: string) {
    return this.keycloakService.getUserInfo(accessToken);
  }
}
