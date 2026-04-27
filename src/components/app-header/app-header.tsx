// src/components/app-header/app-header.tsx
import { FC } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector } from '../../services/store';
import styles from './app-header.module.css'; // если есть

export const AppHeader: FC = () => {
  const userName = useSelector((state) => state.user.user?.name || '');
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <NavLink to='/' end>
          Конструктор
        </NavLink>
        <NavLink to='/feed'>Лента заказов</NavLink>
        {userName ? (
          <NavLink to='/profile'>{userName}</NavLink>
        ) : (
          <NavLink to='/login'>Войти</NavLink>
        )}
      </nav>
    </header>
  );
};
