import React from 'react';
import { Provider } from 'react-redux';
import IdeasIndexPage from '../components/Idea/Page/IdeasIndexPage';
import ReactOnRails from 'react-on-rails';

// See documentation for https://github.com/reactjs/react-redux.
// This is how you get props from the Rails view into the redux store.
// This code here binds your smart component to the redux store.
const mainNode = (props) => {
  const store = ReactOnRails.getStore('appStore');

  return (
   <Provider store={store}>
     <IdeasIndexPage {...props} />
   </Provider>
  );
};

export default mainNode;
