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
      height: '-webkit-fill-available'
    },
    html: {
      height: '-webkit-fill-available'
    }
  })
};

const theme = extendTheme({ config, styles });
export default theme;
