import { useQuery } from 'react-query';

import { api } from '../api';

import { Product, Stock } from '../../types';
import { formatPrice } from '../../util/format';

interface ProductFormatted extends Product {
  priceFormatted: string;
}

export async function getProducts(): Promise<ProductFormatted[]> {
  const { data } = await api.get<Product[]>('product');

  const products = data.map((product) => ({
    ...product,
    priceFormatted: formatPrice(product.price),
  }));

  return products;
}

export function useProducts() {
  return useQuery('products', getProducts, {
    staleTime: 60 * 1000, // 60 segundos
  });
}
