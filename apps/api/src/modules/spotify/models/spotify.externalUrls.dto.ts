export class SpotifyExternalUrlsDto {
  spotify: string;

  constructor(data: Record<string, any>) {
    this.spotify = data.spotify || '';
  }
}
