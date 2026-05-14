describe('Конструктор бургера', () => {
  beforeEach(() => {
   
    cy.intercept('GET', '**/api/ingredients', {
      statusCode: 200,
      fixture: 'ingredients.json'
    }).as('getIngredients');

    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      fixture: 'user.json'
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      fixture: 'order.json'
    }).as('postOrder');

    // Устанавливаем токены
    cy.setCookie('accessToken', 'mockAccessToken');
    window.localStorage.setItem('refreshToken', 'mockRefreshToken');

    // Используем относительный путь
    cy.visit('/');
    
    // Ждём загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  afterEach(() => {
    cy.clearCookie('accessToken');
    window.localStorage.removeItem('refreshToken');
  });

  it('должен добавлять ингредиент из списка в конструктор', () => {
    cy.contains('Краторная булка N-200i').parent().find('button').click();
    cy.contains('Соус Spicy-X').parent().find('button').click();

    cy.get('[data-testid="constructor-bun-top"]').should('contain.text', 'Краторная булка N-200i');
    cy.get('[data-testid="constructor-ingredients"]').should('contain.text', 'Соус Spicy-X');
  });

  it('должен открывать и закрывать модальное окно ингредиента', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="ingredient-name"]').should('have.text', 'Краторная булка N-200i');

    cy.get('[data-testid="modal-close"]').click();
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен закрывать модальное окно по клику на оверлей', () => {
    cy.contains('Краторная булка N-200i').click();
    cy.get('[data-testid="modal"]', { timeout: 10000 }).should('be.visible');
    cy.get('[data-testid="modal-overlay"]').click({ force: true });
    cy.get('[data-testid="modal"]').should('not.exist');
  });

  it('должен создать заказ и очистить конструктор', () => {
    // Ждём авторизацию перед заказом
    cy.wait('@getUser');
    
    cy.contains('Краторная булка N-200i').parent().find('button').click();
    cy.contains('Филе Люминесцентного тетраодонтимформа').parent().find('button').click();

    cy.contains('Оформить заказ').click();

    cy.wait('@postOrder').its('request.body.ingredients').should('deep.equal', [
      '643d69a5c3f7b9001cfa093c',
      '643d69a5c3f7b9001cfa093e',
      '643d69a5c3f7b9001cfa093c'
    ]);

    cy.get('[data-testid="order-number"]', { timeout: 10000 }).should('have.text', '12345');
    cy.get('[data-testid="modal-close"]', { timeout: 10000 }).click();

    cy.contains('Выберите булки').should('exist');
    cy.contains('Выберите начинку').should('exist');
  });
});