import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { ReactQueryDevtools } from 'react-query/devtools';
import { QueryClientProvider } from 'react-query';

import Routes from './routes';

import { queryClient } from './services/queryClient';

import GlobalStyle from './styles/global';
import Header from './components/Header';

import { CartProvider } from './hooks/useCart';

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <GlobalStyle />
        <QueryClientProvider client={queryClient}>
          <Header />
          <Routes />
          <ReactQueryDevtools />
        </QueryClientProvider>
        <ToastContainer autoClose={3000} />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
