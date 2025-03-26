import React from 'react';
import HomePage from './pages/HomePage.lynx';
import HelloWorld from './components/HelloWorld.lynx';

export default function MainApp() {
  return (
    <view style="flex: 1; flex-direction: column; background-color: #ffffff;">
      <HomePage />
      <HelloWorld />
    </view>
  );
} 
