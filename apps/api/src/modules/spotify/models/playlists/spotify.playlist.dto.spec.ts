import { describe, expect, it } from 'vitest';
import { SpotifyPlaylistDto } from './spotify.playlist.dto';

describe('SpotifyPlaylistDto', () => {
  it('should create an instance with default values', () => {
    const data = {};
    const playlistDto = new SpotifyPlaylistDto(data);
    expect(playlistDto).toBeDefined();
    expect(playlistDto.name).toBe('');
    expect(playlistDto.description).toBe('');
    expect(playlistDto.externalUrls).toBeDefined();
  });

  it('should create an instance with provided values', () => {
    const data = {
      name: 'Test Playlist',
      description: 'A playlist for testing',
      external_urls: { spotify: 'https://spotify.com/playlist/123' },
    };
    const playlistDto = new SpotifyPlaylistDto(data);
    expect(playlistDto.name).toBe('Test Playlist');
    expect(playlistDto.description).toBe('A playlist for testing');
    expect(playlistDto.externalUrls.spotify).toBe(
      'https://spotify.com/playlist/123',
    );
  });
});
