import React, { useEffect, useState } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';

import { useProducts } from '../../services/hooks/useProducts';
import { useCart } from '../../hooks/useCart';

import { Container, ProductList } from './styles';

interface CartItemsAmount {
  [key: string]: number;
}

const Home: React.FC = () => {
  const { data, isLoading, error } = useProducts();
  const { addProduct, cart } = useCart();

  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    return Object.assign(sumAmount, { [product.id]: product.amount });
  }, {} as CartItemsAmount);

  function handleAddProduct(id: string) {
    addProduct(id);
  }

  return (
    <Container>
      {isLoading ? (
        <ClipLoader size={10} color="#fff" />
      ) : error ? (
        <p>Falha ao obter lista de produtos</p>
      ) : (
        <ProductList>
          {data?.map((product) => (
            <li key={product.id}>
              <img src={product.image} alt={product.name} />
              <strong>{product.name}</strong>
              <span>{product.priceFormatted}</span>
              <button
                type="button"
                data-testid="add-product-button"
                onClick={() => handleAddProduct(product.id)}
              >
                <div data-testid="cart-product-quantity">
                  <MdAddShoppingCart size={16} />
                  {cartItemsAmount[product.id] || 0}
                </div>
                <span>ADICIONAR AO CARRINHO</span>
              </button>
            </li>
          ))}
        </ProductList>
      )}
    </Container>
  );
};

export default Home;
