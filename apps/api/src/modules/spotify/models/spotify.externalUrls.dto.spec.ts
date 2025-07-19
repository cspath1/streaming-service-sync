import { describe, expect, it } from 'vitest';
import { SpotifyExternalUrlsDto } from './spotify.externalUrls.dto';

describe('SpotifyExternalUrlsDto', () => {
  it('should create an instance with default values', () => {
    const data = {};
    const externalUrlsDto = new SpotifyExternalUrlsDto(data);
    expect(externalUrlsDto.spotify).toBe('');
  });

  it('should create an instance with provided values', () => {
    const data = { spotify: 'https://open.spotify.com/artist/12345' };
    const externalUrlsDto = new SpotifyExternalUrlsDto(data);
    expect(externalUrlsDto.spotify).toBe(
      'https://open.spotify.com/artist/12345',
    );
  });
});
