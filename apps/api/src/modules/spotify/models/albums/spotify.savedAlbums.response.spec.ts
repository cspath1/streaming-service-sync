import { describe, expect, it } from 'vitest';
import { SpotifySavedAlbumsResponse } from './spotify.savedAlbums.response';

describe('SpotifySavedAlbumsResponse', () => {
  it('should map the response correctly', () => {
    const mockData = {
      href: 'some_href',
      limit: 20,
      next: 'some_next',
      offset: 0,
      previous: null,
      total: 100,
      items: [
        {
          album: {
            id: '1',
            name: 'Album 1',
            artists: [{ id: '1', name: 'Artist 1' }],
            external_urls: { spotify: 'https://spotify.com/album/1' },
          },
        },
        {
          album: {
            id: '2',
            name: 'Album 2',
            artists: [{ id: '2', name: 'Artist 2' }],
            external_urls: { spotify: 'https://spotify.com/album/2' },
          },
        },
      ],
    };
    const response = new SpotifySavedAlbumsResponse(mockData);
    expect(response.href).toBe(mockData.href);
    expect(response.limit).toBe(mockData.limit);
    expect(response.next).toBe(mockData.next);
    expect(response.offset).toBe(mockData.offset);
    expect(response.previous).toBe(mockData.previous);
    expect(response.total).toBe(mockData.total);
    expect(response.items).toHaveLength(mockData.items.length);
  });
});
