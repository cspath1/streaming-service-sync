import { Injectable, Logger } from '@nestjs/common';
import { SpotifyAuthService } from './spotify.auth.service';
import { SpotifyAlbumDto } from '../models/albums/spotify.album.dto';
import { SpotifySavedAlbumsResponse } from '../models/albums/spotify.savedAlbums.response';
import { ErrorResult, Result, SuccessResult } from '@repo/core';

@Injectable()
export class SpotifyAlbumsService {
  private readonly logger = new Logger(SpotifyAlbumsService.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  public async getSavedAlbums(): Promise<Result<SpotifyAlbumDto[]>> {
    let data: SpotifyAlbumDto[] = [];
    let nextUrl: string | null = 'https://api.spotify.com/v1/me/albums';
    const accessTokenResult = await this.spotifyAuthService.getAccessToken();

    if (!accessTokenResult.success) {
      this.logger.error('Failed to get access token', accessTokenResult.errors);
      throw new Error('Failed to get access token');
    }

    const accessToken = accessTokenResult.data;
    while (nextUrl != null) {
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

        const responseData: SpotifySavedAlbumsResponse = await response.json();
        data = data.concat(responseData.items);
        nextUrl = responseData.next;
      } catch (error) {
        this.logger.error('Error fetching saved albums', error);
        return new ErrorResult('Failed to fetch saved albums', [error]);
      }
    }

    return new SuccessResult(data);
  }
}
