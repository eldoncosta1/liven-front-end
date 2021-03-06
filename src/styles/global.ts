import { createGlobalStyle } from 'styled-components';

import background from '../assets/images/background.svg';
import 'react-toastify/dist/ReactToastify.css';

export default createGlobalStyle`
  :root {
    --white: #fff;
    --white-50: #eee;
    --gray: #999;
    --gray-100: #666;
    --gray-500: #333;
    --blue: rgb(8, 1, 42);
    --green: rgb(120, 217, 138);
  }

  * {
    margin: 0;
    padding: 0;
    outline: 0;
    box-sizing: border-box;
  }

  body {
    background: var(--blue) url(${background}) no-repeat center top;
    -webkit-font-smoothing: antialiased;
  }

  body, input, button: {
    font: 14px Roboto, sans-serif;
  }

  #root {
    max-width: 1020px;
    margin: 0 auto;
    padding: 0 20px 50px;
  }

  button {
    cursor: pointer;
  }
`;
