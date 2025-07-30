import { describe, expect, it } from 'vitest';
import { SpotifyAlbumExternalIdsDto } from './spotify.album.externalIds.dto';

describe('SpotifyAlbumExternalIdsDto', () => {
  it('should create an instance with null values when no data is provided', () => {
    const dto = new SpotifyAlbumExternalIdsDto({});
    expect(dto.isrc).toBeNull();
    expect(dto.ean).toBeNull();
    expect(dto.upc).toBeNull();
  });

  it('should create an instance with provided values', () => {
    const data = {
      isrc: 'US123456789',
      ean: '1234567890123',
      upc: '123456789012',
    };
    const dto = new SpotifyAlbumExternalIdsDto(data);
    expect(dto.isrc).toBe('US123456789');
    expect(dto.ean).toBe('1234567890123');
    expect(dto.upc).toBe('123456789012');
  });
});
