import { SetMetadata } from '@nestjs/common';
import { AUTH_META, AUTH_TOKEN_META } from '../interfaces/auth.enum';

export const Public = () =>
  SetMetadata(AUTH_META.TOKEN_META, AUTH_TOKEN_META.PUBLIC);

export const WithoutTokenOnly = () =>
  SetMetadata(AUTH_META.TOKEN_META, AUTH_TOKEN_META.WITHOUT_TOKEN_ONLY);

export const WithActiveTokenOnly = () =>
  SetMetadata(AUTH_META.TOKEN_META, AUTH_TOKEN_META.WITH_ACTIVE_TOKEN_ONLY);

export const WithExpiredTokenOnly = () =>
  SetMetadata(AUTH_META.TOKEN_META, AUTH_TOKEN_META.WITH_EXPIRED_TOKEN_ONLY);
