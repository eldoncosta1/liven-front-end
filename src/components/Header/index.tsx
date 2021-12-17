import React from 'react';
import { Link } from 'react-router-dom';
import { MdShoppingBasket } from 'react-icons/md';

import { useCart } from '../../hooks/useCart';

import { Container, Cart } from './styles';

const Header: React.FC = () => {
  const { cart } = useCart();
  const cartSize = cart.length;

  return (
    <Container>
      <Link to="/">LivenShoes</Link>

      <Cart to="/cart">
        <div>
          <strong>Meu carrinho</strong>
          <span data-testid="cart-size">
            {cartSize === 1 ? `${cartSize} item` : `${cartSize} items`}
          </span>
        </div>
        <MdShoppingBasket size={36} color="#FFF" />
      </Cart>
    </Container>
  );
};

export default Header;
