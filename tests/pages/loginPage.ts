import { Page, Locator,expect } from '@playwright/test';
export class LoginPage{
    readonly page:Page;
    readonly emailInput:Locator;
    readonly passwordInput:Locator;
    readonly loginButton:Locator;
    readonly loginHeaderButton:Locator;
    readonly registerButton:Locator;


    constructor(page: Page) {
      this.page = page;
      this.emailInput = page.locator('input[name="email"]');
      this.passwordInput = page.locator('input[name="password"]');
      this.loginButton = page.getByTestId('boton-login');
      this.registerButton = page.getByTestId('boton-signup-header');
    }
    async getAllLoginPage(){
        await expect(this.emailInput).toBeVisible();
        await expect(this.passwordInput).toBeVisible();
        await expect(this.loginButton).toBeVisible();
    }       

    async completeLogin(email: string, password: string){
      await this.emailInput.fill(email);
      await this.passwordInput.fill(password);
      await this.loginButton.click();
    }
    async getInvlidCredentialsMessage() {
      const invalidCredentialsMessage = this.page.getByRole('alert').filter({ hasText: 'Invalid credentials' });
      await expect(invalidCredentialsMessage).toBeVisible();
    } 
    async getEmailValidationMessage() {
        const emailInput = await this.page.$('input[type="email"]');
        if (!emailInput) throw new Error('Email input not found');
        return await emailInput.evaluate(input => (input as HTMLInputElement).validationMessage);
    }
    async getPasswordValidationMessage() {
        const passwordInput = await this.page.$('input[type="password"]');
        if (!passwordInput) throw new Error('Password input not found');
        return await passwordInput.evaluate(input => (input as HTMLInputElement).validationMessage);
    }
    async getEmailAtSignValidationMessage() {
        const emailInput = await this.page.$('input[type="email"]');
        if (!emailInput) throw new Error('Email input not found');
        return await emailInput.evaluate(input => (input as HTMLInputElement).validationMessage);
    }
    async getRegisterButton() {
      await expect(this.registerButton).toBeVisible();
      await this.registerButton.click();
    }
  }

export default LoginPage;