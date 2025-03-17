import React from 'react';
import { Spin, Alert, Pagination } from 'antd';

import './app.css';
import TMDBService from '../../services/tmdb-service';
import { GenresProvider } from '../genres-context/genres-context';
import Header from '../header/header';
import Search from '../search/search';
import MoviesList from '../movies-list/movies-list';
import noAvailable from '../../img/no-available.svg';

export default class App extends React.Component {
  state = {
    movies: [],
    genres: [],
    rating: [],
    query: '',
    loading: true,
    error: false,
    noData: false,
    pageNumber: 1,
    totalPages: null,
    isSearch: false,
    tab: 'search',
    guestId: '',
  };

  data = new TMDBService();

  componentDidMount() {
    this.getGenres();
    this.getGuestId();

    if (this.state.query) {
      this.searchMovies();
    } else {
      this.setState({ loading: false });
    }

    if (localStorage.getItem('rating')) {
      this.setState({ rating: JSON.parse(localStorage.getItem('rating')) });
    }
  }

  getGenres = () => {
    this.data
      .getGenres()
      .then((res) => {
        this.setState({
          genres: res,
        });
      })
      .catch(this.onError);
  };

  getGuestId = () => {
    if (localStorage.getItem('guestId') === 'undefined') {
      localStorage.removeItem('guestId');
    }
    if (!localStorage.getItem('guestId')) {
      this.data
        .createGuestSession()
        .then((res) => {
          localStorage.setItem('guestId', res);
          this.setState({ guestId: res });
        })
        .catch(this.onError);
    } else {
      this.setState({ guestId: localStorage.getItem('guestId') });
    }
  };

  createMovieCard = (movie) => {
    const id = movie.id;
    const title = movie.title;
    const release = movie.release_date;
    const overview = movie.overview;
    const poster = movie.poster_path
      ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
      : noAvailable;
    const genreIds = movie.genre_ids;
    const voteAverage = movie.vote_average.toFixed(1) || 0;
    let rating = 0;
    this.state.rating.map((item) => {
      if (item.id === movie.id) {
        rating = item.score;
      }
    });

    return {
      id,
      title,
      release,
      overview,
      poster,
      genreIds,
      voteAverage,
      rating,
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
    const { query, pageNumber } = this.state;
    this.setState({
      movies: [],
      loading: true,
      error: false,
      noData: false,
      totalPages: null,
    });

    this.data
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

  getRatedMovies() {
    const { guestId, pageNumber } = this.state;
    this.setState({
      movies: [],
      loading: true,
      error: false,
      noData: false,
      totalPages: null,
    });

    this.data
      .getRatedMovies(guestId, pageNumber)
      .then((movies) => {
        this.setState({
          loading: false,
          pageNumber: pageNumber,
          totalPages: movies.total_pages * 10,
        });
        movies.results.forEach((movie) => {
          this.addMovieCard(movie);
        });
      })
      .catch(this.onError);
  }

  addRateMovie = (id, score) => {
    const newRateMovie = { id, score };
    this.setState(({ rating }) => {
      let newRating = rating.filter((item) => item.id !== id);
      newRating.push(newRateMovie);
      localStorage.setItem('rating', JSON.stringify(newRating));
      return { rating: newRating };
    });
  };

  removeRateMovie = (id) => {
    this.setState(({ rating }) => {
      const newRating = rating.filter((item) => item.id !== id);
      localStorage.setItem('rating', JSON.stringify(newRating));
      return { rating: newRating };
    });
  };

  changePage = (page) => {
    const { tab } = this.state;
    this.setState({ pageNumber: page }, () => {
      if (tab === 'search') {
        this.searchMovies();
      } else if (tab === 'rated') {
        this.getRatedMovies();
      }
    });
  };

  onChangeTab = (tab) => {
    if (tab === 'search') {
      this.setState({ tab: tab, pageNumber: 1, noData: false, movies: [] });
    } else if (tab === 'rated') {
      this.setState({ tab: tab, pageNumber: 1, noData: false }, () => this.getRatedMovies());
    }
  };

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
    const {
      movies,
      query,
      loading,
      error,
      noData,
      pageNumber,
      totalPages,
      isSearch,
      tab,
      guestId,
    } = this.state;
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
    const noRatedMoviesAlert = (
      <div className="alert-wrapper">
        <Alert
          className="alert"
          type="info"
          message="Нет данных!"
          description="Вы пока не ставили оценки"
          showIcon
        ></Alert>
      </div>
    );
    const noVPNAlert = (
      <div className="alert-wrapper">
        <Alert
          className="alert"
          type="warning"
          message="Внимание!"
          description="Для создания гостевой сессии требуется VPN"
          showIcon
        ></Alert>
      </div>
    );
    const search = tab === 'search' ? <Search onSearch={this.onSearch}></Search> : null;
    const errorMessage = error ? errorAlert : null;
    const spinner = loading ? <Spin className="spinner"></Spin> : null;
    const content =
      guestId === undefined ? (
        noVPNAlert
      ) : tab === 'search' && isSearch && noData && query ? (
        noDataAlert
      ) : tab === 'rated' && movies.length === 0 ? (
        noRatedMoviesAlert
      ) : (
        <MoviesList
          movies={movies}
          guestId={guestId}
          addRateMovie={this.addRateMovie}
          removeRateMovie={this.removeRateMovie}
        />
      );
    const pagination =
      successResponse && totalPages > 0 && movies.length > 0 ? (
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
        <GenresProvider value={{ genres: this.state.genres }}>
          <Header onChangeTab={this.onChangeTab}></Header>
          {search}
          {errorMessage}
          {spinner}
          {content}
          {pagination}
        </GenresProvider>
      </div>
    );
  }
}
