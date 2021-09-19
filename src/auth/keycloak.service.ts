import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

type LoginResponse = {
  access_token: string;
  scope: string;
  refresh_token: string;
  token_type: string;
  session_state: string;
  'not-before-policy': number;
  refresh_expires_in: number;
  expires_in: number;
};

@Injectable()
export class KeycloakService {
  private baseURL: string;
  private realm: string;
  private clientId: string;
  private clientSecret: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    this.baseURL = this.configService.get('KEYCLOAK_BASE_URL');
    this.realm = this.configService.get('KEYCLOAK_REALM');
    this.clientId = this.configService.get('KEYCLOAK_CLIENT_ID');
    this.clientSecret = this.configService.get('KEYCLOAK_CLIENT_SECRET');
  }

  async login(username: string, password: string): Promise<LoginResponse> {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.baseURL}/auth/realms/${this.realm}/protocol/openid-connect/token`,
        new URLSearchParams({
          client_id: this.clientId,
          client_secret: this.clientSecret,
          grant_type: 'password',
          username,
          password,
        }),
      ),
    );

    return data;
  }
}
