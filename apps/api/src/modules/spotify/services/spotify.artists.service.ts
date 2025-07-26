import { Injectable, Logger } from '@nestjs/common';
import { SpotifyAuthService } from './spotify.auth.service';

@Injectable()
export class SpotifyArtistsService {
  private readonly logger = new Logger(SpotifyArtistsService.name);

  constructor(private readonly spotifyAuthService: SpotifyAuthService) {}

  public async getFollowedArtists(): Promise<any> {
    try {
      const accessToken = await this.spotifyAuthService.getAccessToken();
      const response = await fetch(
        'https://api.spotify.com/v1/me/following?type=artist',
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `Failed to fetch followed artists: ${response.statusText}`,
        );
      }

      return await response.json();
    } catch (error) {
      this.logger.error('Error fetching followed artists', error);
      throw error;
    }
  }
}
