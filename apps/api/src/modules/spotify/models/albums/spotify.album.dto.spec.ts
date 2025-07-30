import { describe, expect, it } from 'vitest';
import { SpotifyAlbumDto } from './spotify.album.dto';

describe('SpotifyAlbumDto', () => {
  it('should create an instance from data', () => {
    const data = {
      album_type: 'album',
      artists: [
        {
          external_urls: { spotify: 'https://spotify.com/artist/123' },
          followers: { href: null, total: 1000 },
          genres: ['pop', 'rock'],
          href: 'https://api.spotify.com/v1/artists/123',
          id: '123',
          images: [{ height: 640, url: 'https://image.url/123', width: 640 }],
          name: 'Test Artist',
          popularity: 80,
          type: 'artist',
          uri: 'spotify:artist:123',
        },
      ],
      available_markets: ['US', 'GB'],
      external_urls: { spotify: 'https://spotify.com/album/456' },
      href: 'https://api.spotify.com/v1/albums/456',
      id: '456',
      images: [{ height: 640, url: 'https://image.url/456', width: 640 }],
      name: 'Test Album',
      release_date: '2023-01-01',
      release_date_precision: 'day',
      total_tracks: 10,
      tracks: {
        href: '',
        items: [],
        limit: 10,
        next: null,
        offset: 0,
        previous: null,
        total: 10,
      },
    };

    const albumDto = new SpotifyAlbumDto(data);
    expect(albumDto).toBeDefined();
    expect(albumDto.name).toBe('Test Album');
    expect(albumDto.artists.length).toBe(1);
    expect(albumDto.artists[0].name).toBe('Test Artist');
    expect(albumDto.availableMarkets).toContain('US');
    expect(albumDto.externalUrls.spotify).toBe('https://spotify.com/album/456');
  });
});
