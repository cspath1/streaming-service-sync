export class SpotifyArtistDto {
  externalUrls: {
    spotify: string;
  };
  followers: {
    href: string | null;
    total: number;
  };
  genres: string[];
  href: string;
  id: string;
  images: {
    height: number;
    url: string;
    width: number;
  }[];
  name: string;
  popularity: number;
  type: string;
  uri: string;

  constructor(data: Record<string, any>) {
    this.externalUrls = data.external_urls;
    this.followers = data.followers;
    this.genres = data.genres;
    this.href = data.href;
    this.id = data.id;
    this.images = data.images;
    this.name = data.name;
    this.popularity = data.popularity;
    this.type = data.type;
    this.uri = data.uri;
  }
}
