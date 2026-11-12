// Preferencia de tema (§4.8). Único uso permitido de localStorage: la clave "csi-theme".
export const THEME_STORAGE_KEY = "csi-theme";
export type Theme = "light" | "dark";

export function readStoredTheme(): Theme | null {
  try {
    const value = localStorage.getItem(THEME_STORAGE_KEY);
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function storeTheme(theme: Theme): void {
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // Sin almacenamiento disponible: el tema aplica solo a esta visita.
  }
}

export function systemTheme(): Theme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function currentTheme(): Theme {
  return document.documentElement.getAttribute("data-theme") === "dark" ? "dark" : "light";
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute("data-theme", theme);
}
