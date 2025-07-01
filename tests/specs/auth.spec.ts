import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/loginPage';
import pages from '../utils/pages';
import { Register } from '../utils/user';
import { Dashboard } from '../pages/dashBoard';


test.describe('Grupo 1: Casos Positivos (El "Happy Path")', () => {
    let loginPage: LoginPage;
    let dashboardPage: Dashboard;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto(pages.login);
    });

    test('Test 1.1: Login Exitoso y Redirección al Dashboard', async ({ page }) => {
        await loginPage.getAllLoginPage();
        await loginPage.completeLogin(Register.email, Register.password);
        await expect(page).toHaveURL(pages.dashboard);
        dashboardPage = new Dashboard(page);
        await dashboardPage.getInicioExitoso();
        await dashboardPage.getTitleDashboard();
    });
});


test.describe('Grupo 2: Casos Negativos (Validaciones y Errores)', () => {
    let loginPage: LoginPage;

    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto(pages.login);
    });

    test('Test 2.1: Intento de Login con Credenciales Inválidas', async ({ page }) => {
        await loginPage.completeLogin(Register.email, Register.invalidPassword);
        await expect(page).toHaveURL(pages.login);
        await loginPage.getInvlidCredentialsMessage();
    });

    test('Test 2.2: Intento de Login con Campos Vacíos', async ({ page }) => {
        await loginPage.completeLogin('', '');
        await expect(page).toHaveURL(pages.login);
        const validationMessage = await loginPage.getEmailValidationMessage();
        expect(validationMessage).toContain('Please fill out this field.');
    });

    test('Test 2.3: Intento de Login con Email sin Contraseña', async ({ page }) => {
        await loginPage.completeLogin(Register.email, '');
        await expect(page).toHaveURL(pages.login);
        const validationMessage = await loginPage.getPasswordValidationMessage();
        expect(validationMessage).toContain('Please fill out this field.');
    });

    test('Test 2.4: Intento de Login con Formato de Email Incorrecto', async ({ page }) => {
        await loginPage.completeLogin(Register.invalidEmail, '');
        await expect(page).toHaveURL(pages.login);
        const validationMessage = await loginPage.getEmailAtSignValidationMessage();
        expect(validationMessage).toContain("Please include an '@' in the email address. 'invalid-email' is missing an '@'.");
    });

});

test.describe('Grupo 3: Flujo de Sesión y Navegación', () => {
    let loginPage: LoginPage;
    test.beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);
        await page.goto(pages.login);
    });
    test('Test 3.1: Verificación del Enlace de Registro', async ({ page }) => {
        await loginPage.getRegisterButton();
        await expect(page).toHaveURL(pages.signup);
    });
    test('Test 3.2: Cierre de Sesión y Protección de Rutas', async ({ page }) => {
        await loginPage.completeLogin(Register.email, Register.password);
        await expect(page).toHaveURL(pages.dashboard);
        const dashboardPage = new Dashboard(page);
        await dashboardPage.getCerrarSesion();
        await page.goto(pages.dashboard);
        await expect(page).toHaveURL(pages.login);
    });
});

test.describe('Grupo 4: Pruebas de API', () => {
    test('Test 4.1: Verificación de Respuesta Exitosa de la API de Login', async ({ page, request }) => {
        const response = await request.post('http://localhost:4000/api/auth/login', {
            data: {
                email: Register.email,
                password: Register.password
            }
        });
        expect(response.status()).toBe(200);
        const responseBody = await response.json();
        expect(responseBody).toHaveProperty('token');
        expect(typeof responseBody.token).toBe('string');
        expect(responseBody).toHaveProperty('user');
        expect(responseBody.user).toEqual(expect.objectContaining({
            id: expect.any(String),
            firstName: Register.firstName,
            lastName: Register.lastname,
            email: Register.email
        }));
    });
});