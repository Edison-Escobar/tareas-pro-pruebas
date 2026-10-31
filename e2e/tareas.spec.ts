import { test, expect } from '@playwright/test';

test('el usuario puede crear una tarea y verla en la lista', async ({ page }) => {
  const titulo = `Prueba E2E ${Date.now()}`;

  await page.goto('/');

  const lista = page.locator('[data-prueba="lista"]');

  await expect(lista).toBeVisible();

  await page.getByLabel('Nueva tarea').fill(titulo);
  await page.getByRole('button', { name: 'Agregar' }).click();

  await expect(lista.getByText(titulo, { exact: true })).toBeVisible();
});
