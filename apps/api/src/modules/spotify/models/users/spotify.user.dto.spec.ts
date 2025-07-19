import { describe, expect, it } from 'vitest';
import { SpotifyUserDto } from './spotify.user.dto';

describe('SpotifyUserDto', () => {
  it('should create a SpotifyUserDto with default values', () => {
    const data = {};
    const userDto = new SpotifyUserDto(data);
    expect(userDto.displayName).toBe('');
    expect(userDto.email).toBe('');
    expect(userDto.id).toBe('');
    expect(userDto.type).toBe('user');
    expect(userDto.uri).toBe('');
  });

  it('should create a SpotifyUserDto with provided values', () => {
    const data = {
      display_name: 'John Doe',
      email: 'john.doe@example.com',
      id: '123',
      type: 'user',
      uri: 'spotify:user:123',
    };
    const userDto = new SpotifyUserDto(data);
    expect(userDto.displayName).toBe('John Doe');
    expect(userDto.email).toBe('john.doe@example.com');
    expect(userDto.id).toBe('123');
    expect(userDto.type).toBe('user');
    expect(userDto.uri).toBe('spotify:user:123');
  });
});
