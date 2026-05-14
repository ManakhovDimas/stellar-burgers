import type { Config } from 'jest';

const config: Config = {
  // Используем jsdom для тестирования React-компонентов
  testEnvironment: 'jsdom',

  // Обрабатываем TypeScript файлы
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },

  // Настройка путей (алиасов)
  moduleNameMapper: {
    '\\.module\\.css$': 'identity-obj-proxy',
    '\\.css$': 'identity-obj-proxy',
    '^@pages/(.*)$': '<rootDir>/src/pages/$1',
    '^@components/(.*)$': '<rootDir>/src/components/$1',
    '^@ui/(.*)$': '<rootDir>/src/components/ui/$1',
    '^@ui-pages/(.*)$': '<rootDir>/src/components/ui/pages/$1',
    '^@utils-types/(.*)$': '<rootDir>/src/utils/types/$1',
    '^@api$': '<rootDir>/src/utils/burger-api.ts',
    '^@slices/(.*)$': '<rootDir>/src/services/slices/$1',
    '^@selectors/(.*)$': '<rootDir>/src/services/selectors/$1'
  },

  // Указываем, где искать тесты
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx|js)',
    '**/?(*.)+(spec|test).+(ts|tsx|js)'
  ],

  // Корневая директория
  rootDir: '.'
};

export default config;
