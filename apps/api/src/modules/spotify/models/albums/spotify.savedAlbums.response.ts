import { SpotifyAlbumDto } from './spotify.album.dto';

export class SpotifySavedAlbumsResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyAlbumDto[];

  constructor(data: Record<string, any>) {
    this.href = data.href;
    this.limit = data.limit;
    this.next = data.next;
    this.offset = data.offset;
    this.previous = data.previous;
    this.total = data.total;
    this.items = (data.items || []).map(
      (item: Record<string, any>) => new SpotifyAlbumDto(item),
    );
  }
}
