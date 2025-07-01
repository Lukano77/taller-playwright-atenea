import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import crypto from 'node:crypto';
import pages from '../utils/pages';
import { Register } from '../utils/user';

let registrationPage: RegistrationPage;
const email = `test-${crypto.randomUUID()}@example.com`;

test.beforeEach(async ({ page }) => {
  await page.goto(pages.signup);
  registrationPage = new RegistrationPage(page);
})

test('TC-1 Verificacion de los elementos del form', async ({ page }) => {
  await registrationPage.getAllRegistrationPage()
});

test('TC-2 Verificacion del boton submit este deshabilitado por defecto', async ({ page }) => {
  await registrationPage.verifyConfirmationButtonDisabled();
});

test('TC-3 Verificacion del boton submit este habilitado cuando se ingresa informacion', async ({ page }) => {
  await registrationPage.fillRegistrationForm(Register.firstName, Register.lastname, Register.email, Register.password);
  await registrationPage.verifyConfirmationButtonEnabled();
});

test('TC-4 Verificacion de redireccionamiento al iniciar sesion', async ({ page }) => {
  await registrationPage.fillRegistrationForm(Register.firstName, Register.lastname, email, Register.password);
  await registrationPage.clickLoginButton();
  await expect(page).toHaveURL(pages.login);
});

test('TC-5 Verificacion de registro exitoso', async ({ page }) => {
  await registrationPage.fillRegistrationForm(Register.firstName, Register.lastname,email, Register.password);
  await registrationPage.getRegisterButton();
  await registrationPage.waitForRegistrationSuccessMessage();
});

test('TC-6 Verificacion de email ya registrado', async ({ page }) => {
  await registrationPage.fillRegistrationForm(Register.firstName, Register.lastname, Register.email, Register.password);
  await registrationPage.getRegisterButton();
  await registrationPage.waitForAlreadyRegistrationSuccessMessage();
});

test('TC-7 Crear usuario y verificar API responde 201', async ({ page, request }) => {
  await registrationPage.fillRegistrationForm(Register.firstName, Register.lastname, email, Register.password);
  const responsePromise = page.waitForResponse('http://localhost:4000/api/auth/signup');
  await registrationPage.getRegisterButton();
  const response = await responsePromise;
  const responseBody = await response.json();
  expect(response.status()).toBe(201);
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: Register.firstName,
    lastName: Register.lastname,
    email: email
  }));
  await registrationPage.waitForRegistrationSuccessMessage();
});

test('TC-8 Signup API responde 201 y retorna usuario', async ({ request }) => {
  const response = await request.post('http://localhost:4000/api/auth/signup', {
    data: {
      firstName: Register.firstName,
      lastName: Register.lastname,
      password: Register.password,
      email: email
    }
  });

  expect(response.status()).toBe(201);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('token');
  expect(typeof responseBody.token).toBe('string');
  expect(responseBody).toHaveProperty('user');
  expect(responseBody.user).toEqual(expect.objectContaining({
    id: expect.any(String),
    firstName: Register.firstName,
    lastName: Register.lastname,
    email: email
  }));
});


//API Test Scenarios
test('TC-9 Interceptar la solicitud de Registro ante un error 500 y mostrar un mensaje de error', async ({ page }) => {
  await page.route('http://localhost:4000/api/auth/signup', route => {
    route.fulfill({
      status: 500,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Internal Server Error' })
    });
  });

  await registrationPage.fillRegistrationForm(Register.firstName, Register.lastname, email, Register.password);
  const responsePromise = page.waitForResponse('http://localhost:4000/api/auth/signup');
  await registrationPage.getRegisterButton();
  const response = await responsePromise;
  expect(response.status()).toBe(500);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('message', 'Internal Server Error');
});

test('TC-10 Interceptar la respuesta cuando hay un email ya registrado  y mostrar un mensaje de error', async ({ page }) => {
  await page.route('http://localhost:4000/api/auth/signup', route => {
    route.fulfill({
      status: 409,
      contentType: 'application/json',  
      body: JSON.stringify({ message: 'Email already in use' })
    });
  });

  await registrationPage.fillRegistrationForm(Register.firstName, Register.lastname, Register.email, Register.password);
  const responsePromise = page.waitForResponse('http://localhost:4000/api/auth/signup');
  await registrationPage.getRegisterButton();
  const response = await responsePromise;
  expect(response.status()).toBe(409);
  const responseBody = await response.json();
  expect(responseBody).toHaveProperty('message', 'Email already in use');
  await registrationPage.waitForAlreadyRegistrationSuccessMessage();
});

