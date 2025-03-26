import './lynx-main.ts';
import './mobile.css';
import components from './components';
import React from 'react';

// Extract components from the components object
const { 
  LynxHelloWorld,  // Common component
  ActionButton,    // Platform-adaptive component
  AndroidActionButton, // Will be available only on Android
  iOSActionButton,     // Will be available only on iOS
  WebActionButton      // Will be available only on Web
} = components;

// Define a simple action handler
const handleButtonPress = () => {
  console.log('Button pressed!');
};

export default function MobileApp() {
  return (
    <view className="lynx-app">
      <view className="lynx-view">
        <LynxHelloWorld msg="Welcome to Vue Lynx on Mobile!" />
        
        {/* Common ActionButton that adapts to each platform */}
        <view className="button-section">
          <text className="section-title">Common Adaptive Button:</text>
          <ActionButton label="Platform Adaptive Button" onPress={handleButtonPress} />
        </view>
        
        {/* 
          Platform-specific components demonstration
          Only the button for the current platform will actually render
        */}
        <view className="button-section">
          <text className="section-title">Platform-Specific Buttons:</text>
          <AndroidActionButton label="Android Button" onPress={handleButtonPress} />
          <iOSActionButton label="iOS Button" onPress={handleButtonPress} />
          <WebActionButton label="Web Button" onPress={handleButtonPress} />
        </view>
      </view>
    </view>
  );
}
