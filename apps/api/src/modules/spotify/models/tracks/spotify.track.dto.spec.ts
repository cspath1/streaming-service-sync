import { describe, expect, it } from 'vitest';
import { SpotifyTrackDto } from './spotify.track.dto';

describe('SpotifyTrackDto', () => {
  it('should create an instance of SpotifyTrackDto', () => {
    const data = {
      album: {},
      artists: [{}],
      available_markets: [],
      disc_number: 1,
      duration_ms: 200000,
      explicit: true,
      external_ids: {},
      external_urls: {},
      href: 'some_href',
      id: 'some_id',
      is_playable: true,
      linked_from: null,
      restrictions: { reason: 'some_reason' },
      name: 'some_name',
      popularity: 100,
      track_number: 1,
      type: 'some_type',
      uri: 'some_uri',
      is_local: false,
    };
    const trackDto = new SpotifyTrackDto(data);
    expect(trackDto).toBeInstanceOf(SpotifyTrackDto);
    expect(trackDto.album).toBeDefined();
    expect(trackDto.artists.length).toBe(1);
    expect(trackDto.availableMarkets).toEqual([]);
    expect(trackDto.discNumber).toBe(1);
    expect(trackDto.durationMs).toBe(200000);
    expect(trackDto.explicit).toBe(true);
    expect(trackDto.externalIds).toBeDefined();
    expect(trackDto.externalUrls).toBeDefined();
    expect(trackDto.href).toBe('some_href');
    expect(trackDto.id).toBe('some_id');
    expect(trackDto.isPlayable).toBe(true);
    expect(trackDto.linkedFrom).toBeNull();
    expect(trackDto.restrictions.reason).toBe('some_reason');
    expect(trackDto.name).toBe('some_name');
    expect(trackDto.popularity).toBe(100);
    expect(trackDto.trackNumber).toBe(1);
    expect(trackDto.type).toBe('some_type');
    expect(trackDto.uri).toBe('some_uri');
    expect(trackDto.isLocal).toBe(false);
  });
});
