import { SpotifyExternalUrlsDto } from '../spotify.externalUrls.dto';

export class SpotifyPlaylistOwnerDto {
  externalUrls: SpotifyExternalUrlsDto;
  href: string;
  id: string;
  type: string;
  uri: string;
  displayName: string;

  constructor(data: Record<string, any>) {
    this.externalUrls = new SpotifyExternalUrlsDto(data.external_urls ?? {});
    this.href = data.href || '';
    this.id = data.id || '';
    this.type = data.type || '';
    this.uri = data.uri || '';
    this.displayName = data.display_name || '';
  }
}
