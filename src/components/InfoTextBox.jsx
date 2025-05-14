const React = window.React;
import { Container } from '../test/container.js';

export default function InfoTextBox(props) {
  return (
   <Container
     name="name"
     flexGrow="1"
     alignContent="flex-start"
     justifyContent="flex-start"
     marginTop={10}
     marginBottom={10}
   >
    {props.children}
   </Container>
  );
}

