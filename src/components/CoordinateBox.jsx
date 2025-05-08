import React from 'react';
import { Container } from '@react-three/uikit';
import MainText from './MainText.jsx';
import InfoTextBox from './InfoTextBox.jsx';

export default function CoordinateBox(props) {
  return (
   <Container flexDirection="column" marginBottom={10}>
     <Container marginTop={10} marginBottom={14}>
       <MainText> {props.label} </MainText>
     </Container>
     <Container flexWrap="no-wrap" >
        <Container flexGrow={1} overflow="hidden" flexDirection="row" flexWrap="no-wrap" >
          <MainText marginRight={10}>X:</MainText>
          <MainText fontWeight="light">{Math.round(props.x)} </MainText>  
        </Container>
        <Container flexGrow={1} overflow="hidden" flexWrap="no-wrap" paddingTop={10} paddingBottom={10}>
          <MainText marginRight={10} marginLeft={10}>Y:</MainText>   
          <MainText fontWeight="light" minHeight={400}>{Math.round(props.y)}</MainText>  
        </Container>
     </Container>
   </Container>
  );
}

