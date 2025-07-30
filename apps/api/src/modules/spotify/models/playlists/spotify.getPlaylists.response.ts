import { SpotifyPlaylistDto } from './spotify.playlist.dto';

export class SpotifyGetPlaylistsResponse {
  href: string;
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;
  items: SpotifyPlaylistDto[];

  constructor(data: Record<string, any>) {
    this.href = data.href || '';
    this.limit = data.limit || 0;
    this.next = data.next || null;
    this.total = data.total || 0;
    this.offset = data.offset || 0;
    this.previous = data.previous || null;
    this.items = (data.items || []).map(
      (item: Record<string, any>) => new SpotifyPlaylistDto(item),
    );
  }
}
