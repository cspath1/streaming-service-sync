import { Injectable } from '@nestjs/common';
import { ErrorResult, Result } from '@repo/core';

@Injectable()
export class SpotifyAuthService {
  private readonly clientId: string;
  private readonly clientSecret: string;

  constructor() {
    this.clientId = process.env.SPOTIFY_CLIENT_ID || '';
    this.clientSecret = process.env.SPOTIFY_CLIENT_SECRET || '';
  }

  public async getAccessToken(): Promise<Result<string>> {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        Authorization:
          'Basic ' +
          Buffer.from(this.clientId + ':' + this.clientSecret).toString(
            'base64',
          ),
      },
      form: {
        grant_type: 'client_credentials',
      },
      json: true,
    };

    try {
      const response = await fetch(authOptions.url, {
        method: 'POST',
        headers: authOptions.headers,
        body: new URLSearchParams(authOptions.form),
      });

      if (!response.ok) {
        return new ErrorResult('Failed to retrieve access token from Spotify', [
          response.statusText,
        ]);
      }

      const data = await response.json();
      return data.access_token;
    } catch (error: any) {
      return new ErrorResult('Failed to retrieve access token from Spotify', [
        error.message,
      ]);
    }
  }
}
