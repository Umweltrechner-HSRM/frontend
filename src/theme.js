import { extendTheme } from '@chakra-ui/react';
import { mode } from '@chakra-ui/theme-tools';

const config = {
  initialColorMode: 'dark',
  useSystemColorMode: true
};

const styles = {
  global: props => ({
    body: {
      bg: mode('#fff', '#202023')(props),
    }
  })
};

const components = {
  Modal: {
    baseStyle: (props) => ({
      dialog: {
        bg: mode('#fff', '#202023')(props),
      }
    })
  },
}

const theme = extendTheme({ config, styles, components });
export default theme;
