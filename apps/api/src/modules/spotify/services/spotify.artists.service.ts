import { Injectable, Logger } from '@nestjs/common';
import { SpotifyAuthService } from './spotify.auth.service';
import { SpotifyArtistDto } from '../models/artists/spotify.artist.dto';
import { ErrorResult, Result, SuccessResult } from '@repo/core';

@Injectable()
export class SpotifyArtistsService {
  private readonly logger = new Logger(SpotifyArtistsService.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  public async getFollowedArtists(): Promise<Result<SpotifyArtistDto[]>> {
    let data: SpotifyArtistDto[] = [];
    let nextUrl = 'https://api.spotify.com/v1/me/following?type=artist';
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
        data.push(...json.items);
        nextUrl = json.next;
      } catch (error) {
        this.logger.error('Error fetching followed artists', error);
        return new ErrorResult('Failed to fetch followed artists', [error]);
      }
    }

    return new SuccessResult(data);
  }
}
