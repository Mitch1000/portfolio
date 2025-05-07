import React from 'react';
import { useState, useEffect, createRef } from 'react';
import { Container } from '@react-three/uikit';
import { Color } from 'three';

function repositionBox(x, y) {
  const initialBoxY = y;
  const initialBoxX = x;

  setTimeout(() => {
    const box = infoEl.getBoundingClientRect();
  
    if (box.right > window.innerWidth) {
      infoEl.parentElement.style.left = `${initialBoxX - box.width}px`;
    }
  
    if (box.left <= 0) {
      infoEl.parentElement.style.left = `${initialBoxX + box.width}px`;
    }
  
    if (box.bottom > window.innerHeight) {
      infoEl.parentElement.style.top = `${initialBoxY - box.height}px`;
    }
  
    if (box.top <= 0) {
      infoEl.parentElement.style.top = `${initialBoxY + box.height}px`;
    }
  }, 0);
}

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
      positionX: 50,
      positionY: 20,
    }

    console.log('start');
    if (typeof clickedPlanet === 'object' && clickedPlanet !== null) {
      console.log(clickedPlanet);
      const color = getColor(clickedPlanet.color);
      this.state =  {
        color,
        positionX: event.pageX - 210,
        positionY: event.pageY,
      }
    }
  }

  render() {
    return (
      <> 
         <Container
           ref={this.infoBox}
           flexGrow={1} 
           maxWidth={240}
           maxHeight={380}
           position='absolute'
           positionLeft={this.state.positionX}
           positionTop={this.state.positionY}
           backgroundOpacity={0.8} 
           hover={{ backgroundOpacity: 1 }} 
           backgroundColor={this.state.color}

           justifyContent="flex-start"
         />
      </>
    );

  }
}
export default InfoBox;
