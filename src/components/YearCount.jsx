const React = window.React;
import { Container } from '../test/container.js';
import { FontFamilyProvider } from '../test/font.js';
import { Text } from '../test/text.js';

export default function YearCount(props) {
  return (
    <Container
      name="year-count"
      maxWidth={0}
      position="absolute"
      positionTop={0}
      positionLeft={10}
      alignItems="flex-end"
      justifyContent="flex-start"
    >
      <FontFamilyProvider
        roboto={{
          medium: `${window.assetsUrl}/roboto.json`,
        }}
      >
        <Text
          marginLeft="16"
          minWidth="220"
          marginBottom="18"
          color="#fffab8"
          fontFamily="roboto"
          fontSize="34"
        >
          YEAR: {props.count}
        </Text>
      </FontFamilyProvider>
    </Container>
  );
}
