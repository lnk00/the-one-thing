import { useCallback, useEffect, useState } from '@lynx-js/react';

import './App.css';
import arrow from './assets/arrow.png';
import lynxLogo from './assets/lynx-logo.png';
import reactLynxLogo from './assets/react-logo.png';

export function App(props: {
  onMounted?: () => void;
}) {
  const [alterLogo, setAlterLogo] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    console.info('Hello, ReactLynx');
    props.onMounted?.();
  }, []);

  const onTap = useCallback(() => {
    'background only';
    setAlterLogo(!alterLogo);
  }, [alterLogo]);

  const handleClick = () => {
    console.info('Button clicked');
    setIsVisible(false);
  };

  return (
    <view>
      <view className="Background" />
      <view className="App">
        <view className="Banner">
          <view className="Logo" bindtap={onTap}>
            {alterLogo ? (
              <image src={reactLynxLogo} className="Logo--react" />
            ) : (
              <image src={lynxLogo} className="Logo--lynx" />
            )}
          </view>
          {isVisible && <text className="Title">The One Thingsss</text>}
        </view>
        <view className="Content">
          <view className="Button" bindtap={handleClick}>
            <text>Click me!</text>
          </view>
        </view>
        <view style={{ flex: 1 }} />
      </view>
    </view>
  );
}
