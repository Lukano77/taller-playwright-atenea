import { Page, Locator, expect } from '@playwright/test';

export class RegistrationPage {
  readonly page: Page;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly registerButton: Locator;
  readonly loginHeaderButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.locator('input[name="firstName"]');
    this.lastNameInput = page.locator('input[name="lastName"]');
    this.emailInput = page.locator('input[name="email"]');
    this.passwordInput = page.locator('input[name="password"]');
    this.registerButton = page.getByTestId('boton-registrarse');
    this.loginHeaderButton = page.getByTestId('boton-login-header-signup');
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

  async getRegisterButton(): Promise<void> {
    await expect(this.registerButton).toBeEnabled();
    await this.registerButton.click();
  }
  async waitForRegistrationSuccessMessage(): Promise<void> {
    await this.page.locator('text=Registro exitoso!').waitFor();
  }
}