import React from 'react';
import { Spin, Alert, Pagination } from 'antd';

import './app.css';
import TMDBService from '../../services/tmdb-service';
import Search from '../search/search';
import MoviesList from '../movies-list/movies-list';
import noAvailable from '../../img/no-available.svg';

export default class App extends React.Component {
  state = {
    movies: [],
    query: '',
    loading: true,
    error: false,
    noData: false,
    pageNumber: 1,
    totalPages: null,
    isSearch: false,
  };

  componentDidMount() {
    if (this.state.query) {
      this.searchMovies();
    } else {
      this.setState({ loading: false });
    }
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
    const data = new TMDBService();
    const { query, pageNumber } = this.state;
    this.setState({
      movies: [],
      loading: true,
      error: false,
      noData: false,
      totalPages: null,
    });

    data
      .getMovies(query, pageNumber)
      .then((movies) => {
        this.setState({
          loading: false,
          pageNumber: pageNumber,
          totalPages: movies.total_pages * 10,
        });
        if (movies.results.length === 0) {
          this.setState({ noData: true });
        }
        movies.results.forEach((movie) => {
          this.addMovieCard(movie);
        });
      })
      .catch(this.onError);
  }

  onSearch = (query) => {
    this.setState({ query: query, pageNumber: 1, isSearch: true }, () => {
      this.searchMovies();
    });
  };

  onChange = (number) => {
    this.setState({ pageNumber: number }, () => {
      this.searchMovies();
    });
  };

  onError = () => {
    this.setState({ error: true, loading: false, noData: false });
  };

  render() {
    const { movies, query, loading, error, noData, pageNumber, totalPages, isSearch } = this.state;
    const successResponse = !(loading || error || noData);
    const errorAlert = (
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
    const noDataAlert = (
      <div className="alert-wrapper">
        <Alert
          className="alert"
          type="info"
          message="Нет данных!"
          description="Поиск не дал результатов"
          showIcon
        ></Alert>
      </div>
    );
    const errorMessage = error ? errorAlert : null;
    const spinner = loading ? <Spin className="spinner"></Spin> : null;
    const content = isSearch && noData && query ? noDataAlert : <MoviesList movies={movies} />;
    const pagination =
      successResponse && totalPages > 0 ? (
        <Pagination
          className="pagination"
          current={pageNumber}
          total={totalPages}
          onChange={this.onChange}
          showSizeChanger={false}
        ></Pagination>
      ) : null;

    return (
      <div className="container">
        <Search onSearch={this.onSearch}></Search>
        {errorMessage}
        {spinner}
        {content}
        {pagination}
      </div>
    );
  }
}
