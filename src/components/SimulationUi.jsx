import { Canvas } from '@react-three/fiber'
import { Fullscreen, Container } from '@react-three/uikit'

export default function GravitySimulation() {
  return (
      <Canvas id="canvas-container">
      <Fullscreen flexDirection="row" padding={10} gap={10}>
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

