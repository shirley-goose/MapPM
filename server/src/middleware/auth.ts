import { expressjwt as jwt } from 'express-jwt';
import jwksClient from 'jwks-rsa';
import { Request, Response, NextFunction } from 'express';

const client = jwksClient({
  jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
});

const getKey = (header: any, callback: any) => {
  client.getSigningKey(header.kid, (err, key) => {
    if (err) {
      return callback(err);
    }
    const signingKey = key?.getPublicKey();
    callback(null, signingKey);
  });
};

export const checkJwt = jwt({
  secret: getKey,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
});

export const optionalAuth = jwt({
  secret: getKey,
  audience: process.env.AUTH0_AUDIENCE,
  issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  algorithms: ['RS256'],
  credentialsRequired: false,
});

export interface AuthenticatedRequest extends Request {
  auth?: {
    sub: string;
    [key: string]: any;
  };
}

export const extractUserId = (req: AuthenticatedRequest): string | null => {
  return req.auth?.sub || null;
};