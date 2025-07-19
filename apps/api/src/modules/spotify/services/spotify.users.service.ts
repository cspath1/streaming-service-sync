import { Injectable, Logger } from '@nestjs/common';
import { ErrorResult, Result, SuccessResult } from '@repo/core';
import { SpotifyUserDto } from '../models/users/spotify.user.dto';
import { SpotifyAuthService } from './spotify.auth.service';

@Injectable()
export class SpotifyUsersService {
  private readonly logger = new Logger(SpotifyUsersService.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  public async getCurrentUser(): Promise<Result<SpotifyUserDto>> {
    this.logger.log('Getting current user');

    const accessTokenResult = await this.spotifyAuthService.getAccessToken();

    if (!accessTokenResult.success) {
      this.logger.error('Failed to get access token', accessTokenResult.errors);
      return new ErrorResult(
        'Failed to get access token',
        accessTokenResult.errors,
      );
    }

    const accessToken = accessTokenResult.data;

    try {
      const response = await fetch('https://api.spotify.com/v1/me', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        this.logger.error('Failed to fetch current user', {
          status: response.status,
          statusText: response.statusText,
        });
        return new ErrorResult('Failed to fetch current user', [
          `${response.status} ${response.statusText}`,
        ]);
      }
      const userData = await response.json();
      this.logger.log('Successfully fetched current user', userData);
      return new SuccessResult(new SpotifyUserDto(userData));
    } catch (error) {
      this.logger.error('Error fetching current user', error);
      return new ErrorResult('Failed to fetch current user', [error]);
    }
  }
}
