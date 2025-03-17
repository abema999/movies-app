import React from 'react';
import { format } from 'date-fns';
import { Tag, Typography, Rate } from 'antd';

import './movie-card.css';
import TMDBService from '../../services/tmdb-service';
import { GenresConsumer } from '../genres-context/genres-context';

export default class MovieCard extends React.Component {
  data = new TMDBService();

  getTrimOverview = (overview, length) => {
    if (!overview) {
      return 'Описание отсутствует';
    }
    if (overview.length <= length) {
      return overview;
    }
    return overview.slice(0, overview.indexOf(' ', length)) + '...';
  };

  render() {
    const { guestId, addRateMovie, removeRateMovie } = this.props;
    const { Title, Text } = Typography;
    const movieCard = this.props.movies.map((movie) => {
      const { id, title, release, overview, poster, genreIds, voteAverage, rating } = movie;
      const trimOverview = this.getTrimOverview(overview, 100);

      let voteAverageClass = 'movie__vote-average';
      if (voteAverage < 3) {
        voteAverageClass += ' red';
      } else if (voteAverage < 5) {
        voteAverageClass += ' orange';
      } else if (voteAverage < 7) {
        voteAverageClass += ' yellow';
      } else if (voteAverage >= 7) {
        voteAverageClass += ' green';
      }

      const changeScore = (score) => {
        if (score === 0) {
          this.data.removeMovieRating(id, guestId);
          removeRateMovie(id);
        } else {
          this.data.addMovieRating(id, guestId, score);
          addRateMovie(id, score);
        }
      };
      return (
        <li className="movie" key={id}>
          <img className="movie__img" src={poster}></img>
          <div className="movie__info">
            <div className="movie__header">
              <Title className="movie__title" style={{ margin: 0 }} level={4}>
                {title}
              </Title>
              <div className={voteAverageClass}>{voteAverage}</div>
            </div>
            <Text className="movie__release" type="secondary">
              {release ? format(new Date(release), 'MMMM d, y') : 'Дата неизвестна'}
            </Text>
            <GenresConsumer>
              {({ genres }) => {
                const movieGenres = genres.filter((item) => genreIds.includes(item.id));
                return (
                  <ul className="movie__genres">
                    {movieGenres.map((movieGenre) => {
                      return (
                        <li className="movie__genre" key={movieGenre.id}>
                          <Tag>
                            <span>{movieGenre.name}</span>
                          </Tag>
                        </li>
                      );
                    })}
                  </ul>
                );
              }}
            </GenresConsumer>
            <Text className="movie__overview">{trimOverview}</Text>
            <div className="movie__rating">
              <Rate defaultValue={rating} allowHalf count={10} onChange={changeScore}></Rate>
            </div>
          </div>
        </li>
      );
    });

    return movieCard;
  }
}
