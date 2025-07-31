import { SpotifyArtistDto } from '../artists/spotify.artist.dto';
import { SpotifyExternalIdsDto } from '../spotify.externalIds.dto';
import { SpotifyExternalUrlsDto } from '../spotify.externalUrls.dto';
import { SpotifyImageDto } from '../spotify.image.dto';

export class SpotifyAlbumDto {
  albumType: string;
  totalTracks: number;
  availableMarkets: string[];
  externalUrls: SpotifyExternalUrlsDto;
  href: string;
  id: string;
  images: SpotifyImageDto[];
  name: string;
  releaseDate: string;
  releaseDatePrecision: string;
  restrictions: {
    reason: string;
  } | null;
  type: string;
  uri: string;
  artists: SpotifyArtistDto[];
  tracks: Record<string, any>[];
  copyrights: {
    text: string;
    type: string;
  }[];
  externalIds: SpotifyExternalIdsDto | null;
  label: string | null;
  popularity: number | null;

  constructor(data: Record<string, any>) {
    this.albumType = data.album_type;
    this.totalTracks = data.total_tracks;
    this.availableMarkets = data.available_markets || [];
    this.externalUrls = data.external_urls;
    this.href = data.href;
    this.id = data.id;
    this.images = data.images
      ? data.images.map(
          (image: Record<string, any>) => new SpotifyImageDto(image),
        )
      : [];
    this.name = data.name;
    this.releaseDate = data.release_date;
    this.releaseDatePrecision = data.release_date_precision;
    this.restrictions = data.restrictions || null;
    this.type = data.type;
    this.uri = data.uri;
    this.artists = (data.artists || []).map(
      (artist: Record<string, any>) => new SpotifyArtistDto(artist ?? {}),
    );
    this.tracks = data.tracks?.items || [];
    this.copyrights = data.copyrights || [];
    this.externalIds = data.external_ids
      ? new SpotifyExternalIdsDto(data.external_ids ?? {})
      : null;
    this.label = data.label || null;
    this.popularity = data.popularity || null;
  }
}
