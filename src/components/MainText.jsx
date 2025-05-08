import React from 'react';
import { FontFamilyProvider, Text } from '@react-three/uikit';

export default function MainText({ marginLeft = 0, marginRight = 0, children = null, fontWeight = 'medium', color = 'black', isItalic = false }) {
  const fontFamily = isItalic ? 'robotoItalic' : 'roboto';

  return (
    <FontFamilyProvider
      roboto={{
       bold: "assets/Roboto-Black.json",
       medium: "assets/Roboto-ExtraBold.json",
       light: "assets/roboto.json",
      }}
      robotoItalic={{
       bold: "assets/Roboto-BlackItalic.json",
       medium: "assets/Roboto-BoldItalic.json",
       light: "assets/Roboto-Italic.json",
      }}
    >
      <Text
        fontFamily={fontFamily}
        overflow="hidden"
        flexWrap="no-wrap"
        fontSize="28"
        fontWeight={fontWeight}
        marginLeft={marginLeft}
        marginRight={marginRight}
        color={color}
      >
        {children}
      </Text>
    </FontFamilyProvider>
  );
}

