import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
import { KeycloakService } from './keycloak.service';

@Module({
  imports: [HttpModule],
  controllers: [AuthController],
  providers: [AuthService, KeycloakService, JwtStrategy],
})
export class AuthModule {}
