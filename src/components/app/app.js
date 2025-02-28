import React from 'react';
import { Spin, Alert } from 'antd';

import './app.css';
import TMDBService from '../../services/tmdb-service';
import MoviesList from '../movies-list/movies-list';
import noAvailable from '../../img/no-available.svg';

export default class App extends React.Component {
  state = {
    movies: [],
    query: 'return',
    loading: true,
    error: false,
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

    movies
      .getMovies(query)
      .then((movies) => {
        this.setState({
          loading: false,
        });
        movies.results.forEach((movie) => {
          this.addMovieCard(movie);
        });
      })
      .catch(this.onError);
  }

  onError = () => {
    this.setState({ error: true, loading: false });
  };

  render() {
    const { movies, loading, error } = this.state;

    const successResponse = !(loading || error);
    const alert = (
      <div className="alert-wrapper">
        <Alert
          className="alert"
          type="error"
          message="Ошибка!"
          description="Что-то пошло не так"
          showIcon
        ></Alert>
      </div>
    );
    const errorMessage = error ? alert : null;
    const spinner = loading ? <Spin className="spinner"></Spin> : null;
    const content = successResponse ? <MoviesList movies={movies}></MoviesList> : null;

    return (
      <div className="container">
        {errorMessage}
        {spinner}
        {content}
      </div>
    );
  }
}
