const React = window.React;
import { Text } from '../test/text.js';
import { FontFamilyProvider } from '../test/font.js';

export default function MainText({
  marginLeft = 0,
  marginRight = 0,
  marginTop = 0,
  marginBottom = 0,
  children = null,
  fontWeight = 'medium',
  color = 'black',
  isItalic = false,
  fontSize = 28,
}) {
  const fontFamily = isItalic ? 'robotoItalic' : 'roboto';

  return (
    <FontFamilyProvider
      roboto={{
       bold: `${window.assetsUrl}/Roboto-Black.json`,
       medium: `${window.assetsUrl}/Roboto-ExtraBold.json`,
       light: `${window.assetsUrl}/roboto.json`,
      }}
      robotoItalic={{
       bold: `${window.assetsUrl}/Roboto-BlackItalic.json`,
       medium: `${window.assetsUrl}/Roboto-BoldItalic.json`,
       light: `${window.assetsUrl}/Roboto-Italic.json`,
      }}
    >
      <Text
        fontFamily={fontFamily}
        overflow="hidden"
        flexWrap="no-wrap"
        fontSize={fontSize}
        fontWeight={fontWeight}
        marginLeft={marginLeft}
        marginRight={marginRight}
        marginTop={marginTop}
        marginBottom={marginBottom}
        color={color}
      >
        {children}
      </Text>
    </FontFamilyProvider>
  );
}

