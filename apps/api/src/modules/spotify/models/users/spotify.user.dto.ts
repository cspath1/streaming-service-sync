import { SpotifyExternalUrlsDto } from '../spotify.externalUrls.dto';
import { SpotifyImageDto } from '../spotify.image.dto';

export class SpotifyUserDto {
  country: string;
  displayName: string;
  email: string;
  explicitContent: {
    filterEnabled: boolean;
    filterLocked: boolean;
  };
  externalUrls: SpotifyExternalUrlsDto;
  followers: {
    href: string | null;
    total: number;
  };
  href: string;
  id: string;
  images: SpotifyImageDto[];
  product: string;
  type: string;
  uri: string;

  constructor(data: Record<string, any>) {
    this.country = data.country || '';
    this.displayName = data.display_name || '';
    this.email = data.email || '';
    this.explicitContent = data.explicit_content || {
      filterEnabled: false,
      filterLocked: false,
    };
    this.externalUrls = new SpotifyExternalUrlsDto(data.external_urls || {});
    this.followers = data.followers || { href: null, total: 0 };
    this.href = data.href || '';
    this.id = data.id || '';
    this.images = (data.images || []).map(
      (image: Record<string, any>) => new SpotifyImageDto(image),
    );
    this.product = data.product || '';
    this.type = data.type || 'user';
    this.uri = data.uri || '';
  }
}
