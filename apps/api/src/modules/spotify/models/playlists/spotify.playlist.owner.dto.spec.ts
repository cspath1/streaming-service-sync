import { describe, expect, it } from 'vitest';
import { SpotifyPlaylistOwnerDto } from './spotify.playlist.owner.dto';

describe('SpotifyPlaylistOwnerDto', () => {
  it('should create an instance from data', () => {
    const data = {
      external_urls: { spotify: 'https://spotify.com/user/123' },
      href: 'https://api.spotify.com/v1/users/123',
      id: '123',
      type: 'user',
      uri: 'spotify:user:123',
      display_name: 'Test User',
    };

    const ownerDto = new SpotifyPlaylistOwnerDto(data);
    expect(ownerDto).toBeDefined();
    expect(ownerDto.displayName).toBe('Test User');
  });
});
