export type GraphLabTheme = 'light' | 'dark';
export type ThemeStorage = Pick<Storage, 'getItem' | 'setItem'>;

export const GRAPH_LAB_THEME_STORAGE_KEY = 'da-graph-lab-theme-v1';

export const readGraphLabTheme = (storage: Pick<Storage, 'getItem'> | null | undefined): GraphLabTheme => {
  if (!storage) return 'light';
  try {
    return storage.getItem(GRAPH_LAB_THEME_STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
};

export const writeGraphLabTheme = (
  storage: Pick<Storage, 'setItem'> | null | undefined,
  theme: GraphLabTheme,
) => {
  if (!storage) return;
  try {
    storage.setItem(GRAPH_LAB_THEME_STORAGE_KEY, theme);
  } catch {
    // Theme persistence is optional; Graph Lab remains usable without storage.
  }
};
