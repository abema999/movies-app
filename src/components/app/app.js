import React from 'react';

import './app.css';
import TMDBService from '../../services/tmdb-service';
import MoviesList from '../movies-list/movies-list';
import noAvailable from '../../img/no-available.svg';

export default class App extends React.Component {
  state = {
    movies: [],
    query: 'return',
  };

  constructor() {
    super();
    this.searchMovies();
  }

  createMovieCard = (movie) => {
    const id = movie.id;
    const title = movie.title;
    const release = movie.release_date;
    const overview = movie.overview;
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : noAvailable;

    return {
      id,
      title,
      release,
      overview,
      poster,
    };
  };

  addMovieCard = (movie) => {
    const newMovieCard = this.createMovieCard(movie);
    this.setState(({ movies }) => {
      return {
        movies: [...movies, newMovieCard],
      };
    });
  };

  searchMovies() {
    const movies = new TMDBService();
    const { query } = this.state;

    movies.getMovies(query).then((movies) => {
      movies.results.forEach((movie) => {
        this.addMovieCard(movie);
      });
    });
  }

  render() {
    return (
      <div className="container">
        <MoviesList movies={this.state.movies}></MoviesList>
      </div>
    );
  }
}
