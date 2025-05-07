import React from 'react';
import { Canvas } from '@react-three/fiber'
import { Fullscreen, Container } from '@react-three/uikit'

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
  )
}

