import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from 'react-query';

import Routes from './routes';

import { queryClient } from './services/queryClient';

import GlobalStyle from './styles/global';
import Header from './components/Header';

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Routes />
        <ReactQueryDevtools />
      </QueryClientProvider>
      <GlobalStyle />
    </BrowserRouter>
  );
}

export default App;
