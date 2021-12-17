import { useQuery } from 'react-query';

import { api } from '../api';

import { Product } from '../../util/interfaces';
import { formatPrice } from '../../util/format';

export async function getProducts(): Promise<Product[]> {
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
