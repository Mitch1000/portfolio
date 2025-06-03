import React from 'react';
import MainText from './MainText.jsx';
import Label from './Label.jsx';
import InfoTextBox from './InfoTextBox.jsx';

export default function InfoField({
  label = "Label",
  value = "Value",
  fontWeight = "light",
  isItalic = false,
  labelWeight = 'bold',
  labelSplit = undefined ,
  supText = '',
}) {
  return (
    <InfoTextBox>
      <Label
        fontWeight={labelWeight}
        marginRight={14}
        label={`${label}:`}
        labelSplit={labelSplit}
        supText={supText}
      >
      </Label>

      <MainText fontWeight={fontWeight} isItalic={isItalic} > {value} </MainText>
    </InfoTextBox>
  );
}

