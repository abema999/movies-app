export default class TMDBService {
  _baseURL = 'https://api.themoviedb.org/3';
  _token =
    'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjZTliNjQ5ODI0MThkYjhiY2E4MzE2YzcyNjhlNzk5OCIsIm5iZiI6MTc0MDQwOTQ1NC41Mywic3ViIjoiNjdiYzhhNmVhNGJmMWMxOTI4YmYxMjY2Iiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.vnEDAQuoBDiiTqfTJgcg85Qg7jfLjn44gPfssVhQbw8';

  async getResource(url) {
    try {
      const res = await fetch(`${this._baseURL}${url}`, {
        method: 'GET',
        headers: {
          accept: 'application/json',
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

  async getMovies(query, pageNumber) {
    return await this.getResource(`/search/movie?query=${query}&page=${pageNumber}`);
  }
}
