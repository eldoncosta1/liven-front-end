import { Product } from '../types';

export const setItemCart = (products: Product[]) => {
  localStorage.setItem('@LivenShoes:cart', JSON.stringify(products));
};
