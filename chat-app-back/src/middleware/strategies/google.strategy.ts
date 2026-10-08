import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

export interface GoogleProfile {
  googleId: string;
  email: string;
  name: string;
}

@Injectable()
export class GoogleStrategy {
  private client = new OAuth2Client();

  // valida o ID token emitido pelo Google Identity Services no front
  async validateIdToken(idToken: string): Promise<GoogleProfile> {
    if (!idToken || typeof idToken !== 'string') {
      throw new UnauthorizedException('No token was provided');
    }

    // sem audience o verifyIdToken aceitaria tokens emitidos para qualquer app
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      throw new InternalServerErrorException('Google login is not configured');
    }

    let payload;
    try {
      const ticket = await this.client.verifyIdToken({ idToken, audience: clientId });
      payload = ticket.getPayload();
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired Google token');
    }

    // sem e-mail verificado não dá para confiar no e-mail para vincular contas
    if (!payload?.sub || !payload.email || !payload.email_verified) {
      throw new UnauthorizedException('Google account email is not verified');
    }

    return {
      googleId: payload.sub,
      email: payload.email.toLowerCase(),
      name: payload.name ?? payload.email.split('@')[0],
    };
  }
}
