export class SpotifyExternalIdsDto {
  isrc: string | null;
  ean: string | null;
  upc: string | null;

  constructor(data: Record<string, any>) {
    this.isrc = data.isrc || null;
    this.ean = data.ean || null;
    this.upc = data.upc || null;
  }
}
