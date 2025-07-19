export class SpotifyImageDto {
  url: string;
  height: number | null;
  width: number | null;

  constructor(data: Record<string, any>) {
    this.url = data.url || '';
    this.height = data.height || null;
    this.width = data.width || null;
  }
}
