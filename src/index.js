import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import memoryUtil from './utils/memoryUtil'
import storageUtil from './utils/storageUtil'

const user = storageUtil.getUser()
if (user && user._id) {
  memoryUtil.user = user
}


ReactDOM.render(<App />, document.getElementById('root'));
