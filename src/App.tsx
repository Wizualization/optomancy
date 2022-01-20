//We know this demo from https://codesandbox.io/s/react-xr-hands-demo-gczkp?file=/src/index.tsx works;
import { OrbitControls } from '@react-three/drei/core/OrbitControls'
import { Sky } from '@react-three/drei/core/Sky'
import ReactDOM from 'react-dom'
import React, { Component } from 'react'
import { VRCanvas, Hands, DefaultXRControllers } from '@react-three/xr'
import Dictaphone from './Components/Verbal/SpeechToText.js'
import './App.css';
import Pinchable from './Components/Somatic/MageHand';
import client from './utils/socketConfig';

// Hololens user agent is going to be a version of edge above the latest release
let ua = navigator.userAgent.toLowerCase();
console.log(ua)
let isHL = ua.replace('edg', '').length < ua.length;


  

// Not sure why other joint pos demo breaks, but https://codesandbox.io/s/47vqp?file=/src/App.tsx works.
class App extends Component {

  componentWillMount() {
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      console.log(message);
    };
  }
  
  render() {

    return (
      <div>
      {isHL ? 
          <VRCanvas>
          <Pinchable />
          <Hands />
          <OrbitControls />
          <ambientLight />
          <pointLight position={[1, 1, 1]} />
          <color args={['black']} attach="background" />
          {/* <Sky sunPosition={[500, 500, 500]} /> */}
        </VRCanvas>
        : <Dictaphone />
      }
      </div>
    );
  }
}

export default App;
