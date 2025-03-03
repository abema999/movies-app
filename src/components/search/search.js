import React from 'react';
import { Input } from 'antd';
import debounce from 'lodash/debounce';

import './search.css';

export default class Search extends React.Component {
  onSearch = (e) => {
    const { onSearch } = this.props;
    const value = e.target.value.trim();
    onSearch(value);
  };

  render() {
    return (
      <Input
        className="search"
        placeholder="Type to search..."
        onChange={debounce(this.onSearch, 1000)}
      ></Input>
    );
  }
}
