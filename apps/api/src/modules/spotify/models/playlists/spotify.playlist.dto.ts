import { SpotifyExternalUrlsDto } from '../spotify.externalUrls.dto';
import { SpotifyPlaylistOwnerDto } from './spotify.playlist.owner.dto';

export class SpotifyPlaylistDto {
  collaborative: boolean;
  description: string;
  externalUrls: SpotifyExternalUrlsDto;
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  owner: SpotifyPlaylistOwnerDto;

  constructor(data: Record<string, any>) {
    this.collaborative = data.collaborative || false;
    this.description = data.description || '';
    this.externalUrls = new SpotifyExternalUrlsDto(data.external_urls ?? {});
    this.href = data.href || '';
    this.id = data.id || '';
    this.images = (data.images || []).map((image: Record<string, any>) => ({
      height: image.height || 0,
      url: image.url || '',
      width: image.width || 0,
    }));
    this.name = data.name || '';
    this.owner = new SpotifyPlaylistOwnerDto(data.owner ?? {});
  }
}
