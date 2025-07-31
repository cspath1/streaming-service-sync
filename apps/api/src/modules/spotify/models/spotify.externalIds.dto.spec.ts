import { describe, expect, it } from 'vitest';
import { SpotifyExternalIdsDto } from './spotify.externalIds.dto';

describe('SpotifyExternalIdsDto', () => {
  it('should create an instance with null values when no data is provided', () => {
    const dto = new SpotifyExternalIdsDto({});
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
    const dto = new SpotifyExternalIdsDto(data);
    expect(dto.isrc).toBe('US123456789');
    expect(dto.ean).toBe('1234567890123');
    expect(dto.upc).toBe('123456789012');
  });
});
