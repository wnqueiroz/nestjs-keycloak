import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('KEYCLOAK_REALM_RSA_PUBLIC_KEY'),
    });
  }

  async validate(payload: any) {
    /**
     * This can be obtained via req.user in the Controllers
     * This is where we validate that the user is valid and delimit the payload returned to req.user
     */
    return { userId: payload.sub };
  }
}
