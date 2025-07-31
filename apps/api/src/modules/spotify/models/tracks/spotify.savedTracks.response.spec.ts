import { describe, expect, it } from 'vitest';
import { SpotifySavedTracksResponse } from './spotify.savedTracks.response';
import { SpotifyTrackDto } from './spotify.track.dto';

describe('SpotifySavedTracksResponse', () => {
  it('should map the response correctly', () => {
    const data = {
      href: 'some_href',
      items: [
        {
          id: 'track_id',
          name: 'track_name',
          artists: [{ id: 'artist_id', name: 'artist_name' }],
        },
      ],
      limit: 10,
      next: 'some_next',
      offset: 0,
      previous: 'some_previous',
      total: 100,
    };

    const response = new SpotifySavedTracksResponse(data);

    expect(response.href).toBe(data.href);
    expect(response.items).toHaveLength(1);
    expect(response.items[0]).toBeInstanceOf(SpotifyTrackDto);
    expect(response.limit).toBe(data.limit);
    expect(response.next).toBe(data.next);
    expect(response.offset).toBe(data.offset);
    expect(response.previous).toBe(data.previous);
    expect(response.total).toBe(data.total);
  });
});
