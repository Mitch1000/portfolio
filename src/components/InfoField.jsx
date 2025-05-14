const React = window.React;
import MainText from './MainText.jsx';
import InfoTextBox from './InfoTextBox.jsx';

export default function InfoField({ label = "Label", value = "Value", fontWeight = "light" , isItalic = false, labelWeight = 'bold' }) {
  return (
    <InfoTextBox>
      <MainText fontWeight={labelWeight} marginRight={14}> {label}: </MainText>
      <MainText fontWeight={fontWeight} isItalic={isItalic} > {value} </MainText>
    </InfoTextBox>
  );
}

