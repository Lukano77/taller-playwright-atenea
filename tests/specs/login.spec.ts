import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import pages from '../utils/pages';
import { Register } from '../utils/user';

test.describe('Login Page', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto(pages.login);
    });

    test('should display all elements on the login page', async ({ page }) => {
        await loginPage.getAllLoginPage();
    });

    test('should login with valid credentials', async ({ page }) => {
        await loginPage.completeLogin(Register.email, Register.password);
        await expect(page).toHaveURL(pages.dashboard);
    });

    test('should show error with invalid credentials', async () => {
        await loginPage.completeLogin(Register.invalidEmail, Register.invalidPassword);
        await loginPage.getInvlidCredentialsMessage();
    });
});