import { describe, expect, it } from 'vitest';
import { SpotifyCreatePlaylistRequest } from './spotify.createPlaylist.request';

describe('SpotifyCreatePlaylistRequest', () => {
  it('should create a playlist request with default values', () => {
    const request = new SpotifyCreatePlaylistRequest({});
    expect(request.name).toBe('');
    expect(request.description).toBe('');
    expect(request.public).toBe(true);
    expect(request.collaborative).toBe(false);
  });

  it('should create a playlist request with provided values', () => {
    const data = {
      name: 'My Playlist',
      description: 'A great playlist',
      public: false,
      collaborative: true,
    };
    const request = new SpotifyCreatePlaylistRequest(data);
    expect(request.name).toBe('My Playlist');
    expect(request.description).toBe('A great playlist');
    expect(request.public).toBe(false);
    expect(request.collaborative).toBe(true);
  });
});
