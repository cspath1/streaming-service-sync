import { Injectable, Logger } from '@nestjs/common';
import { SpotifyAuthService } from './spotify.auth.service';
import { SpotifyAlbumDto } from '../models/albums/spotify.album.dto';
import { SpotifySavedAlbumsResponse } from '../models/albums/spotify.savedAlbums.response';
import { ErrorResult, Result, SuccessResult } from '@repo/core';

@Injectable()
export class SpotifyAlbumsService {
  private readonly logger = new Logger(SpotifyAlbumsService.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  public async getSavedAlbums(
    nextUrl: string | null = null,
  ): Promise<Result<SpotifySavedAlbumsResponse>> {
    if (!nextUrl) {
      nextUrl = 'https://api.spotify.com/v1/me/albums';
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
        this.logger.error('Failed to fetch saved albums', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error('Failed to fetch saved albums');
      }

      const responseData = await response.json();
      this.logger.log(`Fetching saved albums from: ${nextUrl}`);
      return new SuccessResult(new SpotifySavedAlbumsResponse(responseData));
    } catch (error) {
      this.logger.error('Error fetching saved albums', error);
      return new ErrorResult('Failed to fetch saved albums', [error]);
    }
  }

  // TODO: Implement saveAlbum
}
