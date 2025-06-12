import { test, expect } from '@playwright/test';
import { RegistrationPage } from '../pages/RegistrationPage';
import crypto from 'node:crypto';
import baseEnvUrl  from '../utils/environmentBaseURL';
import pages from '../utils/pages';

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
  await registrationPage.fillRegistrationForm('John', 'Doe', email, '123456');
  await registrationPage.verifyConfirmationButtonEnabled();
});

test('TC-4 Verificacion de redireccionamiento al iniciar sesion', async ({ page }) => {
  await registrationPage.fillRegistrationForm('John', 'Doe', email, '123456');
  await registrationPage.getRegisterButton();
  await expect(page).toHaveURL(pages.login);
});

test('TC-4 Verificacion de registro exitoso', async ({ page }) => {
  await registrationPage.fillRegistrationForm('John', 'Doe', email, '123456');
  await registrationPage.getRegisterButton();
  await page.waitForURL(pages.login,{waitUntil:'load'});
  await registrationPage.waitForRegistrationSuccessMessage();
});