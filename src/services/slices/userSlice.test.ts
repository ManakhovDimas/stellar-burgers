import {
  userReducer,
  login,
  register,
  logout,
  checkAuth,
  updateUser
} from './userSlice';
import { TUser } from '@utils-types';

const mockUser: TUser = {
  email: 'test@test.com',
  name: 'Test User'
};

describe('userSlice', () => {
  const initialState = {
    user: null as TUser | null,
    isAuthChecking: true,
    status: 'idle' as 'idle' | 'loading' | 'succeeded' | 'failed',
    error: null as string | null
  };

  describe('login', () => {
    it('должен устанавливать status в loading при login.pending', () => {
      const action = { type: login.pending.type };
      const state = userReducer(initialState, action);
      expect(state.status).toBe('loading');
      expect(state.error).toBeNull();
    });

    it('должен сохранять пользователя при login.fulfilled', () => {
      const action = {
        type: login.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
    });

    it('должен сохранять ошибку при login.rejected', () => {
      const action = {
        type: login.rejected.type,
        error: { message: 'Ошибка входа' }
      };
      const state = userReducer(initialState, action);
      expect(state.status).toBe('failed');
      expect(state.error).toBe('Ошибка входа');
    });
  });

  describe('register', () => {
    it('должен устанавливать status в loading при register.pending', () => {
      const action = { type: register.pending.type };
      const state = userReducer(initialState, action);
      expect(state.status).toBe('loading');
    });

    it('должен сохранять пользователя при register.fulfilled', () => {
      const action = {
        type: register.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.status).toBe('succeeded');
    });
  });

  describe('logout', () => {
    it('должен очищать пользователя при logout.fulfilled', () => {
      const loggedInState = {
        ...initialState,
        user: mockUser,
        status: 'succeeded' as const
      };
      const action = { type: logout.fulfilled.type };
      const state = userReducer(loggedInState, action);
      expect(state.user).toBeNull();
      expect(state.status).toBe('idle');
    });
  });

  describe('checkAuth', () => {
    it('должен устанавливать isAuthChecking при checkAuth.pending', () => {
      const action = { type: checkAuth.pending.type };
      const state = userReducer(initialState, action);
      expect(state.isAuthChecking).toBe(true);
    });

    it('должен сохранять пользователя и сбрасывать isAuthChecking при checkAuth.fulfilled', () => {
      const action = {
        type: checkAuth.fulfilled.type,
        payload: mockUser
      };
      const state = userReducer(initialState, action);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthChecking).toBe(false);
    });

    it('должен сбрасывать пользователя при checkAuth.rejected', () => {
      const action = { type: checkAuth.rejected.type };
      const state = userReducer(initialState, action);
      expect(state.user).toBeNull();
      expect(state.isAuthChecking).toBe(false);
    });
  });
});
