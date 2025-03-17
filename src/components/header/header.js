import React from 'react';
import { Tabs } from 'antd';

import './header.css';

export default class Header extends React.Component {
  tabs = [
    {
      key: 'search',
      label: 'Search',
    },
    {
      key: 'rated',
      label: 'Rated',
    },
  ];

  render() {
    return (
      <div>
        <Tabs
          defaultActiveKey="search"
          items={this.tabs}
          centered={true}
          tabBarGutter={16}
          tabBarStyle={{ margin: '0 auto 20px' }}
          onChange={this.props.onChangeTab}
        />
      </div>
    );
  }
}
