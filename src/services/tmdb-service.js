export default class TMDBService {
  _baseURL = 'https://api.themoviedb.org/3';
  _token =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTliNjQ5ODI0MThkYjhiY2E4MzE2YzcyNjhlNzk5OCIsIm5iZiI6MTc0MDQwOTQ1NC41Mywic3ViIjoiNjdiYzhhNmVhNGJmMWMxOTI4YmYxMjY2Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.vnEDAQuoBDiiTqfTJgcg85Qg7jfLjn44gPfssVhQbw8';
  _key = 'ce9b64982418db8bca8316c7268e7998';

  async getResource(url) {
    try {
      const res = await fetch(`${this._baseURL}${url}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          'Content-Type': 'application/json;charset=utf-8',
          Authorization: this._token,
        },
      });

      if (!res.ok) {
        throw new Error('Что-то пошло не так');
      }

      return await res.json();
    } catch (err) {
      console.error('Проблема с сетевым запросом: ', err.message);
      return err.message;
    }
  }

  async getMovies(query, pageNumber = 1) {
    const movies = await this.getResource(
      `/search/movie?query=${query}&page=${pageNumber}&api_key=${this._key}`,
    );
    if (!movies || !movies.results || movies.results.length === 0) {
      return { results: [] };
    }
    return movies;
  }

  async getRatedMovies(guestId, pageNumber = 1) {
    const movies = await this.getResource(
      `/guest_session/${guestId}/rated/movies?page=${pageNumber}&api_key=${this._key}`,
    );
    if (!movies || !movies.results || movies.results.length === 0) {
      return { results: [] };
    }
    return movies;
  }

  async getGenres() {
    const res = await this.getResource(`/genre/movie/list?api_key=${this._key}`);
    return res.genres;
  }

  async createGuestSession() {
    const res = await this.getResource(`/authentication/guest_session/new`);
    return res.guest_session_id;
  }

  async addMovieRating(movieId, guestId, score) {
    try {
      const res = await fetch(
        `${this._baseURL}/movie/${movieId}/rating?guest_session_id=${guestId}&api_key=${this._key}`,
        {
          method: 'POST',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: this._token,
          },
          body: `{"value": ${score}}`,
        },
      );

      if (!res.ok) {
        throw new Error('Что-то пошло не так');
      }

      return await res.json();
    } catch (err) {
      console.error('Проблема с сетевым запросом: ', err.message);
      return err.message;
    }
  }

  async removeMovieRating(movieId, guestId) {
    try {
      const res = await fetch(
        `${this._baseURL}/movie/${movieId}/rating?guest_session_id=${guestId}&api_key=${this._key}`,
        {
          method: 'DELETE',
          headers: {
            accept: 'application/json',
            'Content-Type': 'application/json;charset=utf-8',
            Authorization: this._token,
          },
        },
      );
      if (!res.ok) {
        throw new Error('Что-то пошло не так');
      }

      return await res.json();
    } catch (err) {
      console.error('Проблема с сетевым запросом: ', err.message);
      return err.message;
    }
  }
}
