import { SpotifyTrackDto } from './spotify.track.dto';

export class SpotifySavedTracksResponse {
  href: string;
  items: SpotifyTrackDto[];
  limit: number;
  next: string | null;
  offset: number;
  previous: string | null;
  total: number;

  constructor(data: Record<string, any>) {
    this.href = data.href || '';
    this.items = (data.items || []).map(
      (item: Record<string, any>) => new SpotifyTrackDto(item),
    );
    this.limit = data.limit || 0;
    this.next = data.next || null;
    this.offset = data.offset || 0;
    this.previous = data.previous || null;
    this.total = data.total || 0;
  }
}
