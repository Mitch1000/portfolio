import React from 'react';
import MainText from './MainText.jsx';
import { Container  } from '@react-three/uikit';

export default function Label({
  label = "Label",
  supText = '',
  labelSplit = undefined,
  weight = 'medium',
  marginRight = 0,
}) {
  const labelSections = label.split(labelSplit);

  return (
    <Container marginRight={marginRight}>
      <MainText fontWeight={weight}> {labelSections[0]} </MainText>
      <MainText fontWeight={weight} fontSize={20} marginTop={-10}> {supText} </MainText>
      {typeof labelSections[1] === 'string' &&
        <MainText fontWeight={weight}> {labelSections[1]} </MainText>
      }
    </Container>
  );
}
