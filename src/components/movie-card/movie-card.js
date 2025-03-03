import React from 'react';
import { format } from 'date-fns';
import { Tag, Typography } from 'antd';

import './movie-card.css';

export default class MovieCard extends React.Component {
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
    const { Title, Text } = Typography;
    const movieCard = this.props.movies.map((movie) => {
      const { id, title, release, overview, poster } = movie;
      const trimOverview = this.getTrimOverview(overview, 100);

      return (
        <li className="movie" key={id}>
          <img className="movie__img" src={poster}></img>
          <div className="movie__info">
            <Title className="movie__title" style={{ margin: 0 }} level={4}>
              {title}
            </Title>
            <Text className="movie__release" type="secondary">
              {release ? format(new Date(release), 'MMMM d, y') : 'Дата неизвестна'}
            </Text>
            <ul className="movie__genres">
              <li className="movie__genre">
                <Tag>#</Tag>
              </li>
              <li className="movie__genre">
                <Tag>#</Tag>
              </li>
            </ul>
            <Text className="movie__overview">{trimOverview}</Text>
          </div>
        </li>
      );
    });

    return movieCard;
  }
}
