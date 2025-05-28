const React = window.React;
const { Canvas } = window.ReactFiber;
import { Container } from '../test/container.js';
import { Fullscreen } from '../test/fullscreen.js';

export default function UIComponent() {
  return (
    <Canvas id="canvas-container" gl={{ localClippingEnabled: true }}>
      <Fullscreen flexDirection="row" padding={0} gap={2}>
        <Container
          flexGrow={1} 
          backgroundOpacity={0.5} 
          hover={{ backgroundOpacity: 1 }} 
          backgroundColor="blue"
        />
        <Container flexGrow={1} margin={32} backgroundColor="green" />
      </Fullscreen>
    </Canvas>
  );
}

