import { Injectable, Logger } from '@nestjs/common';
import { SpotifyAuthService } from './spotify.auth.service';
import { ErrorResult, Result, SuccessResult } from '@repo/core';
import { SpotifyPlaylistDto } from '../models/playlists/spotify.playlist.dto';
import { SpotifyCreatePlaylistRequest } from '../models/playlists/spotify.createPlaylist.request';

@Injectable()
export class SpotifyPlaylistsService {
  private readonly logger = new Logger(SpotifyPlaylistsService.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  public async getPlaylists(): Promise<Result<SpotifyPlaylistDto[]>> {
    let data: SpotifyPlaylistDto[] = [];
    let nextUrl: string | null = 'https://api.spotify.com/v1/me/playlists';
    const accessTokenResult = await this.spotifyAuthService.getAccessToken();

    if (!accessTokenResult.success) {
      this.logger.error('Failed to get access token', accessTokenResult.errors);
      return new ErrorResult(
        'Failed to get access token',
        accessTokenResult.errors,
      );
    }

    const accessToken = accessTokenResult.data;
    while (nextUrl != null) {
      try {
        const response: Response = await fetch(nextUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          this.logger.error('Failed to fetch playlists', {
            status: response.status,
            statusText: response.statusText,
          });
          throw new Error('Failed to fetch playlists');
        }

        const responseData = await response.json();
        data = data.concat(responseData.items);
        nextUrl = responseData.next;
      } catch (error) {
        this.logger.error('Error fetching playlists', error);
        return new ErrorResult('Failed to fetch playlists', [error]);
      }
    }

    return new SuccessResult(data);
  }

  public async createPlaylist(
    userId: string,
    request: SpotifyCreatePlaylistRequest,
  ): Promise<Result<SpotifyPlaylistDto>> {
    const accessTokenResult = await this.spotifyAuthService.getAccessToken();

    if (!accessTokenResult.success) {
      this.logger.error('Failed to get access token', accessTokenResult.errors);
      return new ErrorResult(
        'Failed to get access token',
        accessTokenResult.errors,
      );
    }

    const accessToken = accessTokenResult.data;
    const url = `https://api.spotify.com/v1/users/${userId}/playlists`;

    try {
      const response: Response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        this.logger.error('Failed to create playlist', {
          status: response.status,
          statusText: response.statusText,
        });
        throw new Error('Failed to create playlist');
      }

      const data = await response.json();
      return new SuccessResult(new SpotifyPlaylistDto(data));
    } catch (error) {
      this.logger.error('Error creating playlist', error);
      return new ErrorResult('Failed to create playlist', [error]);
    }
  }
}
