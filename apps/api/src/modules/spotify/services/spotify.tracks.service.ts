import { Injectable, Logger } from '@nestjs/common';
import { SpotifyAuthService } from './spotify.auth.service';
import { ErrorResult, Result, SuccessResult } from '@repo/core';
import { SpotifySavedTracksResponse } from '../models/tracks/spotify.savedTracks.response';

@Injectable()
export class SpotifyTracksService {
  private readonly logger = new Logger(SpotifyTracksService.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  public async getSavedTracks(
    nextUrl: string | null = null,
  ): Promise<Result<SpotifySavedTracksResponse>> {
    if (!nextUrl) {
      nextUrl = 'https://api.spotify.com/v1/me/tracks';
    }
    const accessTokenResult = await this.spotifyAuthService.getAccessToken();

    if (!accessTokenResult.success) {
      this.logger.error('Failed to get access token', accessTokenResult.errors);
      throw new Error('Failed to get access token');
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
        this.logger.error('Failed to fetch saved tracks', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error('Failed to fetch saved tracks');
      }

      const responseData = await response.json();
      this.logger.log(`Fetching saved tracks from: ${nextUrl}`);
      return new SuccessResult(new SpotifySavedTracksResponse(responseData));
    } catch (error) {
      this.logger.error('Error fetching saved tracks', error);
      return new ErrorResult('Failed to fetch saved tracks', [error]);
    }
  }

  // TODO: Implement saveTrack method
}
