describe('Конструктор бургера', () => {
  beforeEach(() => {
    // ПЕРЕХВАТ ЗАПРОСОВ — используем точный URL реального API
    cy.intercept('GET', 'https://norma.education-services.ru/api/ingredients', {
      statusCode: 200,
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', 'https://norma.education-services.ru/api/auth/user', {
      statusCode: 200,
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', 'https://norma.education-services.ru/api/orders', {
      statusCode: 200,
      fixture: 'order.json'
    }).as('postOrder');

    // Устанавливаем токены
    cy.setCookie('accessToken', 'mockAccessToken');
    window.localStorage.setItem('refreshToken', 'mockRefreshToken');

    // Посещаем страницу
    cy.visit('http://localhost:4000');
    
    // Ждём загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('должен добавлять ингредиент из списка в конструктор', () => {
    // Добавляем булку
    cy.contains('Краторная булка N-200i').parent().find('button').click();
    // Добавляем соус
    cy.contains('Соус Spicy-X').parent().find('button').click();

    // Проверяем, что булка появилась в верхней части конструктора
    cy.get('[data-testid="constructor-bun-top"]').should('contain.text', 'Краторная булка N-200i');
    // Проверяем, что соус появился в списке начинок
    cy.get('[data-testid="constructor-ingredients"]').should('contain.text', 'Соус Spicy-X');
  });

  it('должен открывать и закрывать модальное окно ингредиента', () => {
    // Кликаем на название булки
    cy.contains('Краторная булка N-200i').click();
    
    // Ждём появления модального окна
    cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible');
    
    // Проверяем название ингредиента
    cy.get('[data-testid="ingredient-name"]').should('have.text', 'Краторная булка N-200i');

    // Закрываем по крестику
    cy.get('[data-testid="modal-close"]').click();
    
    // Модальное окно должно исчезнуть
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен закрывать модальное окно по клику на оверлей', () => {
    // Открываем модальное окно
    cy.contains('Краторная булка N-200i').click();
    
    // Ждём появления
    cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible');
    
    // Кликаем по оверлею (тёмному фону)
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    
    // Модальное окно должно исчезнуть
    cy.get('[data-testid="modal"]').should('not.exist');
  });

 it('должен создать заказ и очистить конструктор', () => {
    // 1. Добавляем булку
    cy.contains('Краторная булка N-200i').parent().find('button').click();
    
    // 2. Добавляем начинку
    cy.contains('Филе Люминесцентного тетраодонтимформа').parent().find('button').click();

    // 3. Проверяем, что булка отображается (значит добавлена)
    cy.get('[data-testid="constructor-bun-top"]').should('contain.text', 'Краторная булка N-200i');

    // 4. Нажимаем «Оформить заказ»
    cy.contains('Оформить заказ').click();

    // 5. Проверяем запрос
    cy.wait('@postOrder').its('request.body.ingredients').should('deep.equal', [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093c'
    ]);

    // 6. Проверяем номер заказа
    cy.get('[data-testid="order-number"]', { timeout: 10000 }).should('have.text', '12345');

    // 7. Закрываем модальное окно
    cy.get('[data-testid="modal-close"]', { timeout: 10000 }).click();

    // 8. Проверяем, что конструктор очищен
    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});