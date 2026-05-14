import {
  ingredientsReducer,
  fetchIngredients,
  selectIngredients,
  selectBuns,
  selectMains,
  selectSauces
} from './ingredientsSlice';
import { TIngredient } from '@utils-types';

// Моковые данные
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

  describe('fetchIngredients.pending', () => {
    it('должен устанавливать isLoading в true при начале запроса', () => {
      const action = { type: fetchIngredients.pending.type };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
      expect(state.items).toEqual([]);
    });
  });

  describe('fetchIngredients.fulfilled', () => {
    it('должен сохранять ингредиенты и сбрасывать isLoading при успешном запросе', () => {
      const action = {
        type: fetchIngredients.fulfilled.type,
        payload: mockIngredients
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.items).toEqual(mockIngredients);
      expect(state.error).toBeNull();
    });
  });

  describe('fetchIngredients.rejected', () => {
    it('должен устанавливать ошибку и сбрасывать isLoading при ошибке запроса', () => {
      const errorMessage = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngredients.rejected.type,
        error: { message: errorMessage }
      };
      const state = ingredientsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.items).toEqual([]);
    });
  });

  describe('селекторы', () => {
    // Создаём минимальное состояние RootState для тестирования селекторов
    const createMockState = (ingredients: TIngredient[]) => ({
      ingredients: {
        items: ingredients,
        isLoading: false,
        error: null as string | null
      },
      burgerConstructor: {
        bun: null,
        ingredients: [] as Array<{ id: string } & TIngredient>
      },
      user: {
        user: null,
        isAuthChecking: false,
        status: 'idle' as const,
        error: null as string | null
      },
      feed: {
        orders: [],
        total: 0,
        totalToday: 0,
        isLoading: false,
        error: null as string | null
      },
      userOrders: {
        orders: [],
        isLoading: false,
        error: null as string | null
      },
      order: {
        currentOrder: null,
        orderModalData: null,
        orderRequest: false,
        isLoading: false,
        error: null as string | null
      }
    });

    it('selectIngredients должен возвращать все ингредиенты', () => {
      const state = createMockState(mockIngredients);
      const result = selectIngredients(state);
      expect(result).toEqual(mockIngredients);
    });

    it('selectBuns должен возвращать только булки', () => {
      const state = createMockState(mockIngredients);
      const buns = selectBuns(state);
      expect(buns).toHaveLength(1);
      expect(buns[0].type).toBe('bun');
    });

    it('selectMains должен возвращать только начинки', () => {
      const state = createMockState(mockIngredients);
      const mains = selectMains(state);
      expect(mains).toHaveLength(1);
      expect(mains[0].type).toBe('main');
    });

    it('selectSauces должен возвращать только соусы', () => {
      const state = createMockState(mockIngredients);
      const sauces = selectSauces(state);
      expect(sauces).toHaveLength(1);
      expect(sauces[0].type).toBe('sauce');
    });
  });
});
