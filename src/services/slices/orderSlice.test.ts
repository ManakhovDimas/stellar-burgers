import {
  orderReducer,
  createOrder,
  closeOrderModal,
  fetchOrderByNumber
} from './orderSlice';
import { TOrder } from '@utils-types';

const mockOrder: TOrder = {
  _id: '1',
  status: 'done',
  name: 'Test Order',
  number: 12345,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  ingredients: ['ing1', 'ing2']
};

describe('orderSlice', () => {
  const initialState = {
    currentOrder: null as TOrder | null,
    orderModalData: null as TOrder | null,
    orderRequest: false,
    isLoading: false,
    error: null as string | null
  };

  it('должен очищать модальное окно через closeOrderModal', () => {
    const stateWithOrder = {
      ...initialState,
      orderModalData: mockOrder,
      orderRequest: true
    };
    const state = orderReducer(stateWithOrder, closeOrderModal());
    expect(state.orderModalData).toBeNull();
    expect(state.orderRequest).toBe(false);
  });

  it('должен устанавливать orderRequest при createOrder.pending', () => {
    const action = { type: createOrder.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять заказ при createOrder.fulfilled', () => {
    const action = {
      type: createOrder.fulfilled.type,
      payload: { order: mockOrder, name: 'Test Order' },
      meta: { arg: ['ing1', 'ing2'] }
    };
    const state = orderReducer(initialState, action);
    expect(state.orderModalData).toBeTruthy();
    expect(state.orderRequest).toBe(false);
  });

  it('должен сохранять ошибку при createOrder.rejected', () => {
    const action = {
      type: createOrder.rejected.type,
      error: { message: 'Ошибка оформления заказа' }
    };
    const state = orderReducer(initialState, action);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe('Ошибка оформления заказа');
  });
});
