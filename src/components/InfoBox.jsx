const React = window.React;
const { createRef } = window.React;
import { Container  } from '../test/container.js';
const { Color } = window.THREE;
import InfoField from './InfoField.jsx';
import CoordinateBox  from './CoordinateBox.jsx';

const getColor = (colorArray) => {
  return new Color(`rgb(${colorArray[0]}, ${colorArray[1]}, ${colorArray[2]})`);
};

class InfoBox extends React.Component {
  constructor(props) {
    super(props);
    this.infoBox = createRef();

    const { clickedPlanet, event } = props;
    this.state =  {
      color: getColor([255, 0, 0]),
      positionX: 0,
      positionY: 0,
      currentPlanet: { name: '', density: '', position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 }, acceleration: {x: 0, y: 0 } },
      maxWidth: 390,
      maxHeight: 420,
      minHeight: 360,
    }
    if (typeof (clickedPlanet || {}).name !== 'string') { 
      return;
    }
    const color = getColor(clickedPlanet.color);
    
    this.state.currentPlanet = clickedPlanet;
    this.state.color = color;                                           
    this.state.positionX = event.pageX - 20;
    this.state.positionY = event.pageY + 10;

    const x = this.state.positionX;
    const y = this.state.positionY;
    const width = this.state.maxWidth;
    const height = this.state.maxHeight;
    const right = x + width;
    const bottom = y + height;

    if (right > window.innerWidth) {
      this.state.positionX = x - width;
    }
    
    if (x <= 0) {
      this.state.positionX = x + width;
    }
    
    if (bottom > window.innerHeight) {
      this.state.positionY = y - height;
    }
    
    if (y <= 0) {
      this.state.positionY = y + height;
    }
  }

  render() {
    const velocityX = this.state.currentPlanet.velocity.x / 1000;
    const velocityY = this.state.currentPlanet.velocity.y / 1000;

    return (
    <Container
      name="info-box"
      maxWidth={0}
      position="absolute"
      positionTop={0}
      positionLeft={10}
      alignItems="flex-start"
      justifyContent="flex-start"
      backgroundColor="blue"
    >
       <Container
         ref={this.infoBox}
         flexGrow={1} 
         minWidth={this.state.maxWidth}
         minHeight={this.state.minHeight}
         maxWidth={this.state.maxWidth}
         maxHeight={this.state.maxHeight}
         position='absolute'
         positionLeft={this.state.positionX}
         positionTop={this.state.positionY}
         hover={{ backgroundOpacity: 1 }} 
         backgroundColor={this.state.color}
         backgroundOpacity={0.9}
         flexDirection="column"
         justifyContent="flex-start"
         paddingLeft={24}
         paddingRight={8}
         paddingTop={13}
         paddingBottom={16}
         borderRadius={30}
         castShadow={true}
       >
         <InfoField label="Name" labelWeight="medium" fontWeight="light" value={this.state.currentPlanet.name}/>
         <InfoField label="Mass (kg)" value={this.state.currentPlanet.mass.toPrecision(7)}/>
         <InfoField
           label="Density (kg/m&)"
           value={this.state.currentPlanet.density.toPrecision(5)}
           labelSplit="&"
           supText="3"
         />
         <InfoField label="Visual Scale" value={this.state.currentPlanet.scale}/>

         <CoordinateBox
           x={this.state.currentPlanet.position.x}
           y={this.state.currentPlanet.position.y}
           label="Position (km): "
         >
         </CoordinateBox>
 
         <CoordinateBox
           x={this.state.currentPlanet.velocity.x / 1000}
           y={this.state.currentPlanet.velocity.y / 1000}
           label="Velocity (km/s): "
         >
         </CoordinateBox>
         <CoordinateBox
           x={velocityX}
           y={velocityY}
           label="Acceleration (m/s&): "
           supText="2"
           labelSplit="&"
         >
         </CoordinateBox>
       </Container>
     </Container>
    );
  }
}
export default InfoBox;
