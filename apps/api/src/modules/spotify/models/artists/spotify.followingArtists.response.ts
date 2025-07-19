import { SpotifyArtistDto } from './spotify.artist.dto';

export class SpotifyFollowingArtistsResponse {
  href: string;
  limit: number;
  next: string | null;
  cursor: {
    before: string | null;
    after: string | null;
  };
  total: number;
  items: SpotifyArtistDto[];

  constructor(data: Record<string, any>) {
    this.href = data.href || '';
    this.limit = data.limit || 0;
    this.next = data.next || null;
    this.cursor = {
      before: data.cursors?.before || null,
      after: data.cursors?.after || null,
    };
    this.total = data.total || 0;
    this.items = (data.items || []).map(
      (item: Record<string, any>) => new SpotifyArtistDto(item),
    );
  }
}
