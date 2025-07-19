import { SpotifyAlbumDto } from '../albums/spotify.album.dto';
import { SpotifyExternalIdsDto } from '../spotify.externalIds.dto';
import { SpotifyArtistDto } from '../artists/spotify.artist.dto';
import { SpotifyExternalUrlsDto } from '../spotify.externalUrls.dto';

export class SpotifyTrackDto {
  album: SpotifyAlbumDto;
  artists: SpotifyArtistDto[];
  availableMarkets: string[];
  discNumber: number;
  durationMs: number;
  explicit: boolean;
  externalIds: SpotifyExternalIdsDto;
  externalUrls: SpotifyExternalUrlsDto;
  href: string;
  id: string;
  isPlayable: boolean;
  linkedFrom: Record<string, any> | null;
  restrictions: {
    reason: string;
  };
  name: string;
  popularity: number;
  trackNumber: number;
  type: string;
  uri: string;
  isLocal: boolean;

  constructor(data: Record<string, any>) {
    this.album = new SpotifyAlbumDto(data.album || {});
    this.artists = (data.artists || []).map(
      (artist: Record<string, any>) => new SpotifyArtistDto(artist),
    );
    this.availableMarkets = data.available_markets || [];
    this.discNumber = data.disc_number || 0;
    this.durationMs = data.duration_ms || 0;
    this.explicit = data.explicit || false;
    this.externalIds = new SpotifyExternalIdsDto(data.external_ids || {});
    this.externalUrls = new SpotifyExternalUrlsDto(data.external_urls || {});
    this.href = data.href || '';
    this.id = data.id || '';
    this.isPlayable = data.is_playable || false;
    this.linkedFrom = data.linked_from || null;
    this.restrictions = data.restrictions || { reason: '' };
    this.name = data.name || '';
    this.popularity = data.popularity || 0;
    this.trackNumber = data.track_number || 0;
    this.type = data.type || '';
    this.uri = data.uri || '';
    this.isLocal = !!data.is_local;
  }
}
