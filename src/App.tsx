import { useEffect } from '@lynx-js/react';

import './App.css';

export function App() {
  useEffect(() => {
    console.info('Hello, The One Thing!');
  }, []);

  return (
    <view className="app">
      <text className="title">The One Thing</text>
    </view>
  );
}
