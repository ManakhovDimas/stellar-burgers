
import { userOrdersReducer, fetchUserOrders } from './userOrdersSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    number: 123,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ingredients: ['ing1', 'ing2'],
  },
];

describe('userOrdersSlice', () => {
  const initialState = {
    orders: [] as TOrder[],
    isLoading: false,
    error: null as string | null,
  };

  it('должен устанавливать isLoading при fetchUserOrders.pending', () => {
    const action = { type: fetchUserOrders.pending.type };
    const state = userOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять заказы при fetchUserOrders.fulfilled', () => {
    const action = {
      type: fetchUserOrders.fulfilled.type,
      payload: mockOrders,
    };
    const state = userOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
  });

  it('должен сохранять ошибку при fetchUserOrders.rejected', () => {
    const action = {
      type: fetchUserOrders.rejected.type,
      error: { message: 'Ошибка загрузки заказов' },
    };
    const state = userOrdersReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
  });
});
