import { describe, expect, it } from 'vitest';
import { SpotifyFollowingArtistsResponse } from './spotify.followingArtists.response';
import { SpotifyArtistDto } from './spotify.artist.dto';

describe('SpotifyFollowingArtistsResponse', () => {
  it('should map the response correctly', () => {
    const mockData = {
      href: 'some_href',
      limit: 10,
      next: 'some_next',
      cursors: {
        before: 'some_before',
        after: 'some_after',
      },
      total: 100,
      items: [
        {
          id: '1',
          name: 'Artist 1',
          uri: 'some_uri_1',
        },
        {
          id: '2',
          name: 'Artist 2',
          uri: 'some_uri_2',
        },
      ],
    };

    const response = new SpotifyFollowingArtistsResponse(mockData);

    expect(response.href).toBe(mockData.href);
    expect(response.limit).toBe(mockData.limit);
    expect(response.next).toBe(mockData.next);
    expect(response.cursor).toEqual({
      before: mockData.cursors.before,
      after: mockData.cursors.after,
    });
    expect(response.total).toBe(mockData.total);
    expect(response.items).toHaveLength(mockData.items.length);
    expect(response.items[0]).toBeInstanceOf(SpotifyArtistDto);
    expect(response.items[1]).toBeInstanceOf(SpotifyArtistDto);
  });
});
