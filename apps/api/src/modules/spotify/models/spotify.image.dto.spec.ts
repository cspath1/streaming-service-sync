import { describe, expect, it } from 'vitest';
import { SpotifyImageDto } from './spotify.image.dto';

describe('SpotifyImageDto', () => {
  it('should create an instance with default values', () => {
    const data = {};
    const imageDto = new SpotifyImageDto(data);
    expect(imageDto.url).toBe('');
    expect(imageDto.height).toBeNull();
    expect(imageDto.width).toBeNull();
  });

  it('should create an instance with provided values', () => {
    const data = {
      url: 'http://example.com/image.jpg',
      height: 300,
      width: 600,
    };
    const imageDto = new SpotifyImageDto(data);
    expect(imageDto.url).toBe('http://example.com/image.jpg');
    expect(imageDto.height).toBe(300);
    expect(imageDto.width).toBe(600);
  });
});
