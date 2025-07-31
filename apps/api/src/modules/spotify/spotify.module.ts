import { Module } from '@nestjs/common';
import { SpotifyAuthService } from './services/spotify.auth.service';
import { SpotifyAlbumsService } from './services/spotify.albums.service';
import { SpotifyArtistsService } from './services/spotify.artists.service';
import { SpotifyUsersService } from './services/spotify.users.service';
import { SpotifyPlaylistsService } from './services/spotify.playlists.service';

@Module({
  providers: [
    SpotifyAuthService,
    SpotifyArtistsService,
    SpotifyAlbumsService,
    SpotifyPlaylistsService,
    SpotifyUsersService,
  ],
  exports: [
    SpotifyAuthService,
    SpotifyArtistsService,
    SpotifyAlbumsService,
    SpotifyPlaylistsService,
    SpotifyUsersService,
  ],
})
export class SpotifyModule {}
