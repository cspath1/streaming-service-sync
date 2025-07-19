import { Injectable, Logger } from '@nestjs/common';
import { SpotifyAuthService } from './spotify.auth.service';
import { ErrorResult, Result, SuccessResult } from '@repo/core';
import { SpotifyFollowingArtistsResponse } from '../models/artists/spotify.followingArtists.response';

@Injectable()
export class SpotifyArtistsService {
  private readonly logger = new Logger(SpotifyArtistsService.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  public async getFollowedArtists(
    nextUrl: string | null = null,
  ): Promise<Result<SpotifyFollowingArtistsResponse>> {
    if (!nextUrl) {
      nextUrl = 'https://api.spotify.com/v1/me/following?type=artist';
    }
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
      const response = await fetch(nextUrl, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        return new ErrorResult(
          `Failed to fetch followed artists: ${response.statusText}`,
          [`Failed to fetch followed artists: ${response.statusText}`],
        );
      }
      this.logger.log(`Fetching followed artists from: ${nextUrl}`);
      const json = await response.json();
      const data = new SpotifyFollowingArtistsResponse(json);
      return new SuccessResult(data);
    } catch (error) {
      this.logger.error('Error fetching followed artists', error);
      return new ErrorResult('Failed to fetch followed artists', [error]);
    }
  }

  // TODO: Implement followArtist method
}
