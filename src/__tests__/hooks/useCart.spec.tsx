import AxiosMock from 'axios-mock-adapter';
import { act } from '@testing-library/react';
import { renderHook } from '@testing-library/react-hooks';

import { toast } from 'react-toastify';
import { api } from '../../services/api';
import { useCart, CartProvider } from '../../hooks/useCart';

const apiMock = new AxiosMock(api);

jest.mock('react-toastify');

const mockedToastError = toast.error as jest.Mock;
const mockedSetItemLocalStorage = jest.spyOn(Storage.prototype, 'setItem');

const initialStorageData = [
  {
    id: '1',
    amount: 2,
    stock: 10,
    image:
      'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
    price: 179.9,
    title: 'Tênis de Caminhada Leve Confortável',
  },
  {
    id: '2',
    amount: 1,
    stock: 2,
    image:
      'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
    price: 139.9,
    title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
  },
];

describe('useCart Hook', () => {
  beforeEach(() => {
    apiMock.reset();

    jest
      .spyOn(Storage.prototype, 'getItem')
      .mockReturnValueOnce(JSON.stringify(initialStorageData));
  });

  it('should be able to initialize cart with localStorage value', () => {
    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: '1',
          amount: 2,
          stock: 10,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
        {
          id: '2',
          amount: 1,
          stock: 2,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
          price: 139.9,
          title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
        },
      ])
    );
  });

  it('should be able to add a new product', async () => {
    const productId = '3';

    apiMock.onGet(`product/${productId}`).reply(200, {
      id: '3',
      stock: 4,
      price: 219.9,
      image:
        'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis3.jpg',
      title: 'Tênis Adidas Duramo Lite 2.0',
    });

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: '1',
          amount: 2,
          stock: 10,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
        {
          id: '2',
          amount: 1,
          stock: 2,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
          price: 139.9,
          title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
        },
        {
          id: '3',
          amount: 1,
          stock: 4,
          title: 'Tênis Adidas Duramo Lite 2.0',
          price: 219.9,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis3.jpg',
        },
      ])
    );

    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@LivenShoes:cart',
      JSON.stringify(result.current.cart)
    );
  });

  test.todo('should not be able to add a product that not exist');
  test.todo(
    'should be able to increase a product amount when adding a product that already exist on cart'
  );
  test.todo(
    'should not be able to increase a product amount when running out of stock'
  );
  test.todo('should be able to remove a product');

  test.todo('should not be able to remove a product that does not exist');

  test.todo('should be able to update a product amount');

  test.todo('should not be able to update a product that does not exist');

  test.todo(
    'should not be able to update a product amount when running out of stock'
  );

  test.todo(
    'should not be able to update a product amount to a value smaller than 1'
  );
});
