import React from 'react';
import ReactDOM from 'react-dom/client';
import { Offline, Online } from 'react-detect-offline';
import { Alert } from 'antd';

import 'normalize.css';
import './index.css';
import App from './components/app/app';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <>
    <Online>
      <App></App>
    </Online>
    <Offline>
      <div className="alert-wrapper">
        <Alert
          className="alert"
          type="warning"
          message="Внимание!"
          description="Ваш интернет устал"
          showIcon
        ></Alert>
      </div>
    </Offline>
  </>,
);
