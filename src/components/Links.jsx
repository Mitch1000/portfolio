const React = window.React;
const { useRef, useState, useEffect } = window.React;

import { Container } from '../test/container.js';
import { Svg } from '../test/svg.js';

let isHoverGit = false;
let isHoverLinkedIn = false;

export default function InfoLinks() {
  const link = useRef();
  const [color, setColor] = useState('#fffab8');
  window.setColor = setColor;


  //TODO: Find a better way to handle ui events.
  const goToGithub = () => {
    window.open('https://github.com/mitch1000', '_blank');
  };

  const goToLinkedIn = () => {
    window.open('https://www.linkedin.com/in/mitchelldrohan', '_blank');
  };

  const marginRight = 65;
  const marginBottom = 34;

  const size = 80;

  useEffect(() => {

    const ctrl = new AbortController();
    const { signal } = ctrl;

    const checkIfHovering = (event, startX, startY, endX, endY) => {
      let overX = false;
      let overY = false;
      if (event.clientX > window.innerWidth - startX && event.clientX < window.innerWidth - endX) {
        overX = true;
      }
    
      if (event.clientY > window.innerHeight - startY && event.clientY < window.innerHeight - endY) {
        overY = true;
      }
      return overX && overY;
    };

    const getIsPointerOverLink = (event) => {
      let fishEyeEffect = 12;
      const linkedInStart = { x: size * 2 + fishEyeEffect, y: size * 2 + fishEyeEffect };
      isHoverLinkedIn = checkIfHovering(event, linkedInStart.x, linkedInStart.y, marginRight, marginBottom);

      const gitStart = { x: size * 4 + fishEyeEffect, y: size * 1.8 };
      isHoverGit = checkIfHovering(event, gitStart.x, gitStart.y, marginRight + size * 2, marginBottom);


      if(isHoverGit || isHoverLinkedIn) {
        document.body.style.cursor = 'pointer';
        return;
      }
      document.body.style.cursor = 'default';
    };


    const handleLinkPress = () => {
      if(isHoverGit) {
        goToGithub();
      }

      if(isHoverLinkedIn) {
        goToLinkedIn();
      }
    };

    const handlePointerUp = (event) => {
      getIsPointerOverLink(event);
      handleLinkPress();
    };

    const handleMouseUp = () => {
      handleLinkPress();
    };

    document.addEventListener('mousemove', getIsPointerOverLink, { signal });
    document.addEventListener('pointerup', handlePointerUp, { signal });
    document.addEventListener('mouseup', handleMouseUp, { signal });

    return () => {
      ctrl.abort();
    };
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
  );
}
