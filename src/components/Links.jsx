import React, {useEffect} from 'react';
import { useRef, useState } from 'react'

import { Container, Svg } from '@react-three/uikit';
import { setLink } from '../helpers/uiHelpers';

let isHoverGit = false;
let isHoverLinkedIn = false;

const checkIfHovering = (event, startX, startY, endX, endY) => {
  let overX = false
  let overY = false
  if (event.clientX > window.innerWidth - startX && event.clientX < window.innerWidth - endX) {
    overX = true
  }

  if (event.clientY > window.innerHeight - startY && event.clientY < window.innerHeight - endY) {
    overY = true
  }
  return overX && overY 
};

export default function InfoLinks({ camera, mainScene }) {
  const link = useRef();
  const [color, setColor] = useState('#fffab8');
  window.setColor = setColor;


  //TODO: Find a better way to handle ui events.
  const goToGithub = () => {
    window.open('https://github.com/mitch1000', '_blank').focus();
  };

  const goToLinkedIn = () => {
    window.open('https://www.linkedin.com/in/mitchelldrohan', '_blank').focus();
  };

  const marginRight = 40;
  const marginBottom = 28;

  const size = 45;

  useEffect(() => {
    setLink(link.current.interactionPanel);
    document.addEventListener('mousemove', (event) => {

      let fishEyeEffect = 12 
      const linkedInStart = { x: size * 2 + fishEyeEffect, y: size * 2 + fishEyeEffect };
      isHoverLinkedIn = checkIfHovering(event, linkedInStart.x, linkedInStart.y, marginRight, marginBottom)

      const gitStart = { x: size * 4 + fishEyeEffect, y: size * 1.8 };
      isHoverGit = checkIfHovering(event, gitStart.x, gitStart.y, marginRight + size * 2, marginBottom)


      if(isHoverGit || isHoverLinkedIn) {
        document.body.style.cursor = 'pointer';
        return;
      }
      document.body.style.cursor = 'default';
    });

    document.addEventListener('mouseup', () => {
      if(isHoverGit) {
        goToGithub()
      }

      if(isHoverLinkedIn) {
        goToLinkedIn()
      }
    });
  }, [link]);

  return (
    <Container
      name="links"
      width="100%"
      minHeight="100%"
      position="absolute"
      positionLeft={0}
      positionTop={0}
      alignItems="flex-end"
      justifyContent="flex-end"
      backgroundColor="red"
      backgroundOpacity="red"
    >
      <Container >
        <Svg
          ref={link}
          marginRight={marginRight}
          marginBottom={marginBottom}
          position="absolute"
          width={size}
          height={size}
          color={color}
          src="/assets/GitHub.svg">
        </Svg>
      </Container>
      <Container >
        <Svg
          ref={link}
          marginRight={marginRight}
          marginBottom={marginBottom}
          position="absolute"
          width={size}
          height={size}
          color={color}
          src="/assets/linkedin.svg">
        </Svg>
      </Container>
    </Container>
  )
}
