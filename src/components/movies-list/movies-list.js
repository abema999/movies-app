import React from 'react';

import './movies-list.css';
import MovieCard from '../movie-card/movie-card';

export default class MoviesList extends React.Component {
  render() {
    const { movies } = this.props;
    return (
      <ul className="movies-list">
        <MovieCard movies={movies}></MovieCard>
      </ul>
    );
  }
}
