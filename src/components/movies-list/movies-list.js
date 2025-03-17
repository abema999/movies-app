import React from 'react';

import './movies-list.css';
import { GenresConsumer } from '../genres-context/genres-context';
import MovieCard from '../movie-card/movie-card';

export default class MoviesList extends React.Component {
  render() {
    const { movies, guestId, addRateMovie, removeRateMovie } = this.props;
    return (
      <ul className="movies-list">
        <GenresConsumer>
          {({ genres }) => {
            return (
              <MovieCard
                movies={movies}
                guestId={guestId}
                addRateMovie={addRateMovie}
                removeRateMovie={removeRateMovie}
                genres={genres}
              ></MovieCard>
            );
          }}
        </GenresConsumer>
      </ul>
    );
  }
}
