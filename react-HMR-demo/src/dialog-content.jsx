import React from 'react';

export default function DialogContent(props) {
  return <h2>Hello, 11</h2>;
}

if (module.hot) {
  module.hot.dispose((data) => {
    console.log('[DialogContent] dispose');
  });
}
