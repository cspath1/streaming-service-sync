import { describe, expect, it } from 'vitest';
import { SpotifyArtistDto } from './spotify.artist.dto';

describe('SpotifyArtistDto', () => {
  it('should create an instance from data', () => {
    const data = {
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
    };

    const artistDto = new SpotifyArtistDto(data);
    expect(artistDto).toBeDefined();
    expect(artistDto.name).toBe('Test Artist');
  });
});
