import {
  constructorReducer,
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredient,
  resetConstructor
} from './constructorSlice';
import { TIngredient } from '@utils-types';

// Моковые данные
const mockBun: TIngredient = {
  _id: 'bun1',
  name: 'Краторная булка N-200i',
  type: 'bun',
  proteins: 80,
  fat: 24,
  carbohydrates: 53,
  calories: 420,
  price: 1255,
  image: 'image.png',
  image_mobile: 'image_mobile.png',
  image_large: 'image_large.png'
};

const mockIngredient: TIngredient = {
  _id: 'ing1',
  name: 'Соус Spicy-X',
  type: 'sauce',
  proteins: 30,
  fat: 20,
  carbohydrates: 40,
  calories: 30,
  price: 90,
  image: 'image.png',
  image_mobile: 'image_mobile.png',
  image_large: 'image_large.png'
};

const mockIngredient2: TIngredient = {
  _id: 'ing2',
  name: 'Филе Люминесцентного тетраодонтимформа',
  type: 'main',
  proteins: 44,
  fat: 26,
  carbohydrates: 85,
  calories: 643,
  price: 988,
  image: 'image.png',
  image_mobile: 'image_mobile.png',
  image_large: 'image_large.png'
};

describe('constructorSlice', () => {
  // Начальное состояние как в слайсе
  const initialState = {
    bun: null,
    ingredients: [] as Array<{ id: string } & TIngredient>
  };

  describe('setBun', () => {
    it('должен добавлять булку в конструктор', () => {
      const action = setBun(mockBun);
      const state = constructorReducer(initialState, action);

      expect(state.bun).toBeTruthy();
      expect(state.bun?._id).toBe('bun1');
      expect(state.bun?.id).toBeDefined();
      expect(state.bun?.name).toBe('Краторная булка N-200i');
    });

    it('должен заменять существующую булку на новую', () => {
      const firstAction = setBun(mockBun);
      const stateWithBun = constructorReducer(initialState, firstAction);

      const newBun: TIngredient = {
        ...mockBun,
        _id: 'bun2',
        name: 'Другая булка'
      };
      const secondAction = setBun(newBun);
      const updatedState = constructorReducer(stateWithBun, secondAction);

      expect(updatedState.bun?._id).toBe('bun2');
      expect(updatedState.bun?.name).toBe('Другая булка');
    });
  });

  describe('addIngredient', () => {
    it('должен добавлять ингредиент в конструктор', () => {
      const action = addIngredient(mockIngredient);
      const state = constructorReducer(initialState, action);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('ing1');
      expect(state.ingredients[0].id).toBeDefined();
      expect(state.ingredients[0].name).toBe('Соус Spicy-X');
    });

    it('должен добавлять несколько ингредиентов', () => {
      const firstAction = addIngredient(mockIngredient);
      const stateWithOne = constructorReducer(initialState, firstAction);

      const secondAction = addIngredient(mockIngredient2);
      const stateWithTwo = constructorReducer(stateWithOne, secondAction);

      expect(stateWithTwo.ingredients).toHaveLength(2);
      expect(stateWithTwo.ingredients[0]._id).toBe('ing1');
      expect(stateWithTwo.ingredients[1]._id).toBe('ing2');
    });
  });

  describe('removeIngredient', () => {
    it('должен удалять ингредиент из конструктора', () => {
      // Добавляем ингредиент
      const addAction = addIngredient(mockIngredient);
      const stateWithIngredient = constructorReducer(initialState, addAction);
      const ingredientId = stateWithIngredient.ingredients[0].id;

      // Удаляем по уникальному id
      const removeAction = removeIngredient(ingredientId);
      const stateAfterRemoval = constructorReducer(
        stateWithIngredient,
        removeAction
      );

      expect(stateAfterRemoval.ingredients).toHaveLength(0);
    });

    it('должен удалять правильный ингредиент из нескольких', () => {
      // Добавляем два ингредиента
      const addAction1 = addIngredient(mockIngredient);
      const addAction2 = addIngredient(mockIngredient2);
      let state = constructorReducer(initialState, addAction1);
      state = constructorReducer(state, addAction2);

      const firstIngredientId = state.ingredients[0].id;

      // Удаляем первый
      const removeAction = removeIngredient(firstIngredientId);
      state = constructorReducer(state, removeAction);

      expect(state.ingredients).toHaveLength(1);
      expect(state.ingredients[0]._id).toBe('ing2');
    });
  });

  describe('moveIngredient', () => {
    it('должен менять порядок ингредиентов (вниз)', () => {
      // Используем конструктор по-другому, без явного литерала
      const action1 = addIngredient(mockIngredient);
      const action2 = addIngredient(mockIngredient2);
      let state = constructorReducer(initialState, action1);
      state = constructorReducer(state, action2);

      // Перемещаем первый (индекс 0) на место второго (индекс 1)
      const moveAction = moveIngredient({ fromIndex: 0, toIndex: 1 });
      state = constructorReducer(state, moveAction);

      expect(state.ingredients[0]._id).toBe('ing2');
      expect(state.ingredients[1]._id).toBe('ing1');
    });

    it('должен корректно перемещать ингредиент вверх', () => {
      const action1 = addIngredient(mockIngredient);
      const action2 = addIngredient(mockIngredient2);
      let state = constructorReducer(initialState, action1);
      state = constructorReducer(state, action2);

      // Перемещаем второй (индекс 1) на место первого (индекс 0)
      const moveAction = moveIngredient({ fromIndex: 1, toIndex: 0 });
      state = constructorReducer(state, moveAction);

      expect(state.ingredients[0]._id).toBe('ing2');
      expect(state.ingredients[1]._id).toBe('ing1');
    });
  });

  describe('resetConstructor', () => {
    it('должен очищать конструктор', () => {
      // Добавляем булку и ингредиент
      let state = constructorReducer(initialState, setBun(mockBun));
      state = constructorReducer(state, addIngredient(mockIngredient));

      // Очищаем
      state = constructorReducer(state, resetConstructor());

      expect(state.bun).toBeNull();
      expect(state.ingredients).toHaveLength(0);
    });
  });
});
