import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { KeycloakService } from './keycloak.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, KeycloakService],
})
export class AuthModule {}
