import { test, expect } from '@playwright/test';
import { HomePage } from '../../src/pages/HomePage';
import { LoginPage } from '../../src/pages/LoginPage';

test.describe('Login functionality', () => {
  test('should show error for invalid login credentials', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.open();
    await homePage.goToLogin();

    await loginPage.login('invalid_user@example.com', 'wrongpassword123');

    await expect(loginPage.loginErrorMessage).toBeVisible();
  });

  test('should navigate to login page successfully', async ({ page }) => {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    await homePage.open();
    await homePage.goToLogin();

    await expect(page).toHaveURL(/.*login/);
    await expect(loginPage.loginEmailInput).toBeVisible();
  });
}); 