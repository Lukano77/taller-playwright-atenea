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
  await registrationPage.fillRegistrationForm(Register.username, Register.lastname, Register.email, Register.password);
  await registrationPage.verifyConfirmationButtonEnabled();
});

test('TC-4 Verificacion de redireccionamiento al iniciar sesion', async ({ page }) => {
  await registrationPage.fillRegistrationForm(Register.username, Register.lastname, email, Register.password);
  await registrationPage.clickLoginButton();
  await expect(page).toHaveURL(pages.login);
});

test('TC-5 Verificacion de registro exitoso', async ({ page }) => {
  await registrationPage.fillRegistrationForm(Register.username, Register.lastname, email, Register.password);
  await registrationPage.getRegisterButton();
  await registrationPage.waitForRegistrationSuccessMessage();
}); 

test('TC-6 Verificacion de email ya registrado', async ({ page }) => {
  await registrationPage.fillRegistrationForm(Register.username, Register.lastname, Register.email, Register.password);
  await registrationPage.getRegisterButton();
  await registrationPage.waitForAlreadyRegistrationSuccessMessage();
}); 