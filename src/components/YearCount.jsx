import React from 'react';
import { Container, Text, FontFamilyProvider } from '@react-three/uikit';

export default function YearCount(props) {
  return (
    <Container
      marginLeft={10}
      marginBottom={10}
      width={200}
      position="absolute"

      alignItems="flex-end"
      justifyContent="flex-start"
    >
      <FontFamilyProvider
        robot={{
          medium: "assets/robot.json",
          bold: "assets/robot.json",
        }}
      >
        <Text
          position='absolute'
          color="#fffab8"
          fontFamily="robot"
          fontSize="30"
        >
          YEAR: {props.count}
        </Text>
      </FontFamilyProvider>
    </Container>
  )
}
