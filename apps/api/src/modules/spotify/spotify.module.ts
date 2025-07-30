import { Module } from '@nestjs/common';
import { SpotifyAuthService } from './services/spotify.auth.service';
import { SpotifyAlbumsService } from './services/spotify.albums.service';
import { SpotifyArtistsService } from './services/spotify.artists.service';

@Module({
  providers: [SpotifyAuthService, SpotifyArtistsService, SpotifyAlbumsService],
  exports: [SpotifyAuthService, SpotifyArtistsService, SpotifyAlbumsService],
})
export class SpotifyModule {}
