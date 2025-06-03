import React from 'react';
import { Container } from '@react-three/uikit';
import MainText from './MainText.jsx';
import Label from './Label.jsx';

export default function CoordinateBox({ x, y, label = "Label", supText = '', labelSplit = undefined }) {
  const toPrecision = (x) => {
    x = Math.round(x, 2);
    return x.toPrecision(3);
  };

  return (
    <Container flexDirection="column" marginBottom={10}>
      <Container marginTop={10} marginBottom={14}>
        <Label label={label} supText={supText} labelSplit={labelSplit}> </Label>
      </Container>
      <Container flexWrap="no-wrap" >
        <Container flexGrow={1} overflow="hidden" flexDirection="row" flexWrap="no-wrap" >
          <MainText marginRight={6}>X:</MainText>
          <MainText fontWeight="light">{toPrecision(x)} </MainText>  
        </Container>
        <Container flexGrow={1} overflow="hidden" flexWrap="no-wrap" paddingTop={10} paddingBottom={10}>
          <MainText marginRight={8} marginLeft={6}>Y:</MainText>   
          <MainText fontWeight="light" minHeight={400}>{toPrecision(y)}</MainText>  
        </Container>
      </Container>
    </Container>
  );
}

