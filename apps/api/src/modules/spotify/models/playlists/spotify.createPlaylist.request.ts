export class SpotifyCreatePlaylistRequest {
  name: string;
  description?: string;
  public?: boolean;
  collaborative?: boolean;

  constructor(data: Record<string, any>) {
    this.name = data.name || '';
    this.description = data.description || '';
    this.public = data.public ?? true; // Default to true if not provided
    this.collaborative = data.collaborative ?? false; // Default to false if not provided
  }
}
