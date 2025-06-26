import { Page, Locator,expect } from '@playwright/test';
export class Dashboard{
    readonly page:Page;
    readonly inicioExitoso:Locator;
    readonly inicioFallido:Locator;
    readonly inicioExitosoMensaje:Locator;
    readonly dashbooardtitle:Locator;
    readonly cerrarSesion:Locator;
    readonly sesionCerrada:Locator;
   


    constructor(page: Page) {
      this.page = page;
     this.inicioExitoso = page.getByText('Inicio de sesión exitoso');
     this.dashbooardtitle = page.getByTestId('titulo-dashboard')
     this.cerrarSesion = page.getByTestId('boton-logout');
     this.sesionCerrada = page.getByText('Sesión cerrada correctamente');

    }
   
    async getInicioExitoso(){
        await expect(this.inicioExitoso).toBeVisible();
    }
    async getTitleDashboard(){
        await expect(this.dashbooardtitle).toBeVisible();
    }

    async getCerrarSesion(){
        await expect(this.cerrarSesion).toBeVisible();
        await this.cerrarSesion.click();
        await expect(this.page).toHaveURL('/login');
        await expect(this.sesionCerrada).toBeVisible();
    }
}

export default Dashboard;