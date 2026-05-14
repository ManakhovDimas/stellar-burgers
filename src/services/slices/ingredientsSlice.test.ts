import {
  ingredientsReducer,
  fetchIngredients,
  selectBuns,
  selectMains,
  selectSauces
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';
import { combineReducers } from '@reduxjs/toolkit';
import { rootReducer } from '../store';

const reducer = combineReducers(rootReducer);

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 4,
    price: 5,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '2',
    name: 'Соус',
    type: 'sauce',
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 4,
    price: 5,
    image: '',
    image_mobile: '',
    image_large: ''
  },
  {
    _id: '3',
    name: 'Начинка',
    type: 'main',
    proteins: 1,
    fat: 2,
    carbohydrates: 3,
    calories: 4,
    price: 5,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice', () => {
  const initialState = {
    items: [] as TIngredient[],
    isLoading: false,
    error: null as string | null
  };

  it('должен устанавливать isLoading при fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('должен сохранять ингредиенты при fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.items).toEqual(mockIngredients);
  });

  it('должен сохранять ошибку при fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: 'Ошибка загрузки' }
    };
    const state = ingredientsReducer(initialState, action);
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Ошибка загрузки');
  });

  describe('селекторы', () => {
    // Создаём состояние с ингредиентами через диспатч fulfilled экшена
    const stateWithIngredients = reducer(undefined, { type: '@@INIT' });
    const ingredientsState = ingredientsReducer(initialState, {
      type: fetchIngredients.fulfilled.type,
      payload: mockIngredients
    });

    const fullState = {
      ...stateWithIngredients,
      ingredients: ingredientsState
    };

    it('selectBuns должен возвращать только булки', () => {
      const buns = selectBuns(fullState);
      expect(buns).toHaveLength(1);
      expect(buns[0].type).toBe('bun');
      expect(buns[0].name).toBe('Булка');
    });

    it('selectSauces должен возвращать только соусы', () => {
      const sauces = selectSauces(fullState);
      expect(sauces).toHaveLength(1);
      expect(sauces[0].type).toBe('sauce');
      expect(sauces[0].name).toBe('Соус');
    });

    it('selectMains должен возвращать только начинки', () => {
      const mains = selectMains(fullState);
      expect(mains).toHaveLength(1);
      expect(mains[0].type).toBe('main');
      expect(mains[0].name).toBe('Начинка');
    });
  });
});
