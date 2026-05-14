import { feedReducer, fetchFeeds } from './feedSlice';
import { TOrder } from '@utils-types';

const mockOrders: TOrder[] = [
  {
    _id: '1',
    status: 'done',
    name: 'Order 1',
    number: 123,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    ingredients: ['ing1', 'ing2']
  }
];

describe('feedSlice', () => {
  const initialState = {
    orders: [] as TOrder[],
    total: 0,
    totalToday: 0,
    isLoading: false,
    error: null as string | null
  };

  it('устанавливает isLoading при pending', () => {
    const action = { type: fetchFeeds.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(true);
  });

  it('сохраняет данные при fulfilled', () => {
    const action = {
      type: fetchFeeds.fulfilled.type,
      payload: { orders: mockOrders, total: 100, totalToday: 10 }
    };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.total).toBe(100);
  });

  it('сохраняет ошибку при rejected', () => {
    const action = {
      type: fetchFeeds.rejected.type,
      error: { message: 'Ошибка' }
    };
    const state = feedReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка');
  });
});
