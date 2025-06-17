import { Page, Locator,expect } from '@playwright/test';
export class LoginPage{
    readonly page:Page;
    readonly emailInput:Locator;
    readonly passwordInput:Locator;
    readonly loginButton:Locator;
    readonly loginHeaderButton:Locator;
    constructor(page: Page) {
      this.page = page;
      this.emailInput = page.locator('input[name="email"]');
      this.passwordInput = page.locator('input[name="password"]');
      this.loginButton = page.getByTestId('boton-login');
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
}