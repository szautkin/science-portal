// Defaults
export const DEFAULT_CORES_NUMBER = 2;
export const DEFAULT_RAM_NUMBER = 8;
export const DEFAULT_NOTEBOOK_SKAHA_IMAGE = 'astroml-notebook:latest';
export const DEFAULT_DESKTOP_SKAHA_IMAGE = 'desktop:latest';
export const DEFAULT_CARTA_SKAHA_IMAGE = 'carta:latest';
export const DEFAULT_CONTRIBUTED_SKAHA_IMAGE = 'astroml-vscode:latest';
export const NOTEBOOK_TYPE = 'notebook';
export const CARTA_TYPE = 'carta';
export const CONTRIBUTED_TYPE = 'contributed';
export const DESKTOP_TYPE = 'desktop';
export const SKAHA_PROJECT = 'skaha';

export const DEFAULT_IMAGE_NAMES = {
  [CARTA_TYPE]: DEFAULT_CARTA_SKAHA_IMAGE,
  [CONTRIBUTED_TYPE]: DEFAULT_CONTRIBUTED_SKAHA_IMAGE,
  [DESKTOP_TYPE]: DEFAULT_DESKTOP_SKAHA_IMAGE,
  [NOTEBOOK_TYPE]: DEFAULT_NOTEBOOK_SKAHA_IMAGE,
};
