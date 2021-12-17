import React, { useEffect, useState } from 'react';
import { ClipLoader } from 'react-spinners';

import { useProducts } from '../../services/hooks/useProducts';

import { Container } from './styles';

const Home: React.FC = () => {
  // const [products, setProducts] = useState<Product[]>([]);
  const { data, isLoading, error } = useProducts();

  return (
    <Container>
      {isLoading ? (
        <ClipLoader size={10} color="#fff" />
      ) : error ? (
        <p>Falha ao obter lista de produtos</p>
      ) : (
        <p>Produtos</p>
      )}
    </Container>
  );
};

export default Home;
