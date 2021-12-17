import React, { createContext, ReactNode, useContext, useState } from 'react';

import { toast } from 'react-toastify';
import { api } from '../services/api';
import { setItemCart } from '../util/localStorage';

import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: string;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: string) => Promise<void>;
  removeProduct: (productId: string) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps) {
  const [cart, setCart] = useState<Product[]>(() => {
    const storagedCart = localStorage.getItem('@LivenShoes:cart');
    if (storagedCart) {
      return JSON.parse(storagedCart);
    }

    return [];
  });

  const addProduct = async (productId: string) => {
    try {
      const updatedCart = [...cart];
      const productExist = updatedCart.find(
        (product) => product.id === productId
      );

      if (productExist) {
        const amount = productExist.amount + 1;

        if (amount > productExist.stock) {
          toast.error('Quantidade solicitada fora de estoque');
          return;
        }

        productExist.amount = amount;
      } else {
        const product = await api.get(`product/${productId}`);

        const newProduct = {
          ...product.data,
          amount: 1,
        };

        updatedCart.push(newProduct);
      }

      setCart(updatedCart);
      setItemCart(updatedCart);
    } catch {
      toast.error('Erro na adição do produto');
    }
  };

  const removeProduct = (productId: string) => {
    try {
      const updatedCart = [...cart];
      const productIndex = updatedCart.findIndex(
        (product) => product.id === productId
      );

      if (productIndex >= 0) {
        updatedCart.splice(productIndex, 1);
        setCart(updatedCart);
        setItemCart(updatedCart);
      } else {
        throw Error();
      }
    } catch {
      toast.error('Erro na remoção do produto');
    }
  };

  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {
      if (amount <= 0) return;

      const stockProduct = await api.get<Product>(`product/${productId}`);

      if (amount > stockProduct.data.stock) {
        toast.error('Quantidade solicitada fora de estoque');
        return;
      }

      const updatedCart = [...cart];
      const productExist = updatedCart.find(
        (product) => product.id === productId
      );

      if (productExist) {
        productExist.amount = amount;
        setCart(updatedCart);
        setItemCart(updatedCart);
      } else {
        throw Error();
      }
    } catch {
      toast.error('Erro na alteração da quantidade do produto');
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
