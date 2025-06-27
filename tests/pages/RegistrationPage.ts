import { Page, Locator, expect } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginHeaderButton: Locator;
  readonly successRegistrationMessage: Locator;
  readonly alreadyRegisteredMessage: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registerButton = page.getByTestId('boton-registrarse');
    this.loginHeaderButton = page.getByTestId('boton-login-header-signup');
    this.successRegistrationMessage = page.getByRole('alert').filter({ hasText: 'Registro exitoso!'});
    this.alreadyRegisteredMessage = page.getByRole('alert').filter({ hasText: 'Email already in use'});
    this.loginButton = page.getByTestId('boton-login-header-signup');

  }

  async getAllRegistrationPage()
  {
    await expect(this.firstNameInput).toBeVisible();
    await expect(this.lastNameInput).toBeVisible();
    await expect(this.emailInput).toBeVisible();
    await expect(this.passwordInput).toBeVisible();
    await expect(this.registerButton).toBeVisible();
  }
  
  async verifyConfirmationButtonDisabled(){
    await expect(this.registerButton).toBeDisabled();
  }
    async verifyConfirmationButtonEnabled(){
    await expect(this.registerButton).toBeEnabled();
  }

  async fillRegistrationForm(firstName: string, lastName: string, email: string, password: string): Promise<void> {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
  }

  async getRegisterButton() {
    await expect(this.registerButton).toBeEnabled();
    await this.registerButton.click();
  }
  async waitForRegistrationSuccessMessage() {
    await expect(this.successRegistrationMessage).toBeVisible();

  }
    async waitForAlreadyRegistrationSuccessMessage(){
    await expect(this.alreadyRegisteredMessage).toBeVisible();
  }

  async clickLoginButton() {
    await expect(this.loginButton).toBeVisible();
    await this.loginButton.click();
  }
}

export default RegistrationPage;