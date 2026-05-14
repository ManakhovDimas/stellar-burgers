import { rootReducer } from './store';
import { combineReducers } from '@reduxjs/toolkit';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { userReducer } from './slices/userSlice';
import { feedReducer } from './slices/feedSlice';
import { userOrdersReducer } from './slices/userOrdersSlice';
import { orderReducer } from './slices/orderSlice';

// Создаём настоящий редьюсер из конфигурации store
const reducer = combineReducers(rootReducer);

describe('rootReducer', () => {
  const initAction = { type: '@@INIT' };
  const unknownAction = { type: 'UNKNOWN_ACTION' };

  it('должен правильно инициализировать состояние всех слайсов', () => {
    const state = reducer(undefined, initAction);

    // Сравниваем полное состояние с эталонным
    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      burgerConstructor: constructorReducer(undefined, initAction),
      user: userReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction),
      userOrders: userOrdersReducer(undefined, initAction),
      order: orderReducer(undefined, initAction)
    });
  });

  it('должен возвращать корректное состояние при неизвестном экшене', () => {
    const state = reducer(undefined, unknownAction);

    // Сравниваем полное состояние с эталонным
    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, unknownAction),
      burgerConstructor: constructorReducer(undefined, unknownAction),
      user: userReducer(undefined, unknownAction),
      feed: feedReducer(undefined, unknownAction),
      userOrders: userOrdersReducer(undefined, unknownAction),
      order: orderReducer(undefined, unknownAction)
    });
  });

  it('должен содержать все необходимые ключи слайсов', () => {
    const state = reducer(undefined, initAction);

    expect(Object.keys(state)).toEqual([
      'ingredients',
      'burgerConstructor',
      'user',
      'feed',
      'userOrders',
      'order'
    ]);
  });

  it('не должен содержать лишних ключей', () => {
    const state = reducer(undefined, initAction);
    const expectedKeys = [
      'ingredients',
      'burgerConstructor',
      'user',
      'feed',
      'userOrders',
      'order'
    ];

    // Проверяем, что нет лишних ключей
    Object.keys(state).forEach((key) => {
      expect(expectedKeys).toContain(key);
    });
  });
});
