import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { userReducer } from './slices/userSlice';
import { feedReducer } from './slices/feedSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';
import { orderReducer } from './slices/orderSlice';

// Создаём rootReducer для теста (такой же, как в store.ts)
const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  user: userReducer,
  feed: feedReducer,
  userOrders: userOrdersReducer,
  order: orderReducer
});

describe('rootReducer', () => {
  it('должен возвращать начальное состояние при вызове с undefined и неизвестным экшеном', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем, что initialState содержит все ключи слайсов
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('burgerConstructor');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('userOrders');
    expect(initialState).toHaveProperty('order');
  });

  it('должен возвращать корректное начальное состояние каждого слайса', () => {
    const initialState = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Проверяем начальные состояния каждого слайса
    expect(initialState.ingredients).toEqual({
      items: [],
      isLoading: false,
      error: null
    });

    expect(initialState.burgerConstructor).toEqual({
      bun: null,
      ingredients: []
    });

    expect(initialState.user).toEqual({
      user: null,
      isAuthChecking: true,
      status: 'idle',
      error: null
    });
  });
});
