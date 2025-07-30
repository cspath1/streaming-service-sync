import { SpotifyExternalUrlsDto } from '../spotify.externalUrls.dto';
import { SpotifyImageDto } from '../spotify.image.dto';

export class SpotifyArtistDto {
  externalUrls: SpotifyExternalUrlsDto;
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: SpotifyImageDto[];
  name: string;
  popularity: number;
  type: string;
  uri: string;

  constructor(data: Record<string, any>) {
    this.externalUrls = new SpotifyExternalUrlsDto(data.external_urls || {});
    this.followers = data.followers || { href: null, total: 0 };
    this.genres = data.genres || [];
    this.href = data.href || '';
    this.id = data.id || '';
    this.images = data.images
      ? data.images.map(
          (image: Record<string, any>) => new SpotifyImageDto(image),
        )
      : [];
    this.name = data.name || '';
    this.popularity = data.popularity || 0;
    this.type = data.type || '';
    this.uri = data.uri || '';
  }
}
