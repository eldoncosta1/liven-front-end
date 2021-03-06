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

const initialStoragedData = [
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
    stock: 1,
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
      .mockReturnValueOnce(JSON.stringify(initialStoragedData));
  });

  afterEach(() => {
    jest.clearAllMocks();
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
          stock: 1,
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
          stock: 1,
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

  it('should not be able to add a product that not exist', async () => {
    const productId = '4';

    apiMock.onGet(`product/${productId}`).reply(404);

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    // console.log(result.current);

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Erro na adição do produto'
        );
      },
      { timeout: 200 }
    );
  });

  it('should be able to increase a product amount when adding a product that already exist on cart', async () => {
    const productId = '1';

    apiMock.onGet(`product/${productId}`).reply(200, {
      id: 1,
      stock: 10,
      image:
        'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
      price: 179.9,
      title: 'Tênis de Caminhada Leve Confortável',
    });

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitFor(() => {
      expect(result.current.cart).toEqual(
        expect.arrayContaining([
          {
            id: '1',
            amount: 3,
            stock: 10,
            image:
              'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
            price: 179.9,
            title: 'Tênis de Caminhada Leve Confortável',
          },
          {
            id: '2',
            amount: 1,
            stock: 1,
            image:
              'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
            price: 139.9,
            title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
          },
        ])
      );
      expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
        '@LivenShoes:cart',
        JSON.stringify(result.current.cart)
      );
    });
  });

  it('should not be able to increase a product amount when running out of stock', async () => {
    const productId = '2';

    apiMock.onGet(`product/${productId}`).reply(200, {
      id: '2',
      amount: 1,
      stock: 1,
      image:
        'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
      price: 139.9,
      title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
    });

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.addProduct(productId);
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Quantidade solicitada fora de estoque'
        );
      },
      { timeout: 500 }
    );

    // console.log(result.current.cart);
    // console.log(initialStoragedData);

    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );

    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  it('should be able to remove a product', () => {
    const productId = '1';

    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.removeProduct(productId);
    });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: '2',
          amount: 1,
          stock: 1,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
          price: 139.9,
          title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
        },
      ])
    );

    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@LivenShoes:cart',
      JSON.stringify(result.current.cart)
    );
  });

  it('should not be able to update a product amount when running out of stock', async () => {
    const productId = '2';

    apiMock.onGet(`product/${productId}`).reply(200, {
      id: '2',
      stock: 1,
      image:
        'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
      price: 139.9,
      title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
    });

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ productId, amount: 3 });
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Quantidade solicitada fora de estoque'
        );
      },
      { timeout: 200 }
    );
  });

  it('should not be able to remove a product that does not exist', () => {
    const productId = '10';

    const { result } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.removeProduct(productId);
    });

    expect(mockedToastError).toHaveBeenCalledWith('Erro na remoção do produto');
    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );
    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  it('should be able to update a product amount', async () => {
    const productId = '1';

    apiMock.onGet(`product/${productId}`).reply(200, {
      id: 1,
      stock: 10,
      image:
        'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
      price: 179.9,
      title: 'Tênis de Caminhada Leve Confortável',
    });

    const { result, waitForNextUpdate } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ productId, amount: 3 });
    });

    await waitForNextUpdate({ timeout: 200 });

    expect(result.current.cart).toEqual(
      expect.arrayContaining([
        {
          id: '1',
          amount: 3,
          stock: 10,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis1.jpg',
          price: 179.9,
          title: 'Tênis de Caminhada Leve Confortável',
        },
        {
          id: '2',
          amount: 1,
          stock: 1,
          image:
            'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
          price: 139.9,
          title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
        },
      ])
    );

    expect(mockedSetItemLocalStorage).toHaveBeenCalledWith(
      '@LivenShoes:cart',
      JSON.stringify(result.current.cart)
    );
  });

  it('should not be able to update a product that does not exist', async () => {
    const productId = '4';

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ amount: 3, productId });
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Erro na alteração de quantidade do produto'
        );
      },
      { timeout: 200 }
    );

    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );

    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  it('should not be able to update a product that does not exist', async () => {
    const productId = '4';

    const { result, waitFor } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      result.current.updateProductAmount({ amount: 3, productId });
    });

    await waitFor(
      () => {
        expect(mockedToastError).toHaveBeenCalledWith(
          'Erro na alteração de quantidade do produto'
        );
      },
      { timeout: 200 }
    );

    expect(result.current.cart).toEqual(
      expect.arrayContaining(initialStoragedData)
    );

    expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
  });

  it('should not be able to update a product amount to a value smaller than 1', async () => {
    const productId = '2';

    // apiMock.onGet(`product/${productId}`).reply(200, {
    //   id: '2',
    //   stock: 1,
    //   image:
    //     'https://rocketseat-cdn.s3-sa-east-1.amazonaws.com/modulo-redux/tenis2.jpg',
    //   price: 139.9,
    //   title: 'Tênis VR Caminhada Confortável Detalhes Couro Masculino',
    // });

    const { result, waitForValueToChange } = renderHook(useCart, {
      wrapper: CartProvider,
    });

    act(() => {
      // console.log(result.current.cart);
      result.current.updateProductAmount({ productId, amount: 0 });
    });

    try {
      await waitForValueToChange(
        () => {
          expect(mockedToastError).toHaveBeenCalledWith(
            'Quantidade solicitada fora de estoque'
          );
        },
        { timeout: 200 }
      );
      expect(result.current.cart).toEqual(
        expect.arrayContaining(initialStoragedData)
      );
      expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
    } catch {
      expect(result.current.cart).toEqual(
        expect.arrayContaining(initialStoragedData)
      );
      expect(mockedSetItemLocalStorage).not.toHaveBeenCalled();
    }
  });
});
