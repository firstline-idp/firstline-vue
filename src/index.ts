import { inject } from 'vue';
import { FIRSTLINE_INJECTION_KEY, FIRSTLINE_TOKEN } from './token';
import { createAuthGuard } from './guard';

export { FIRSTLINE_INJECTION_KEY } from './token';

import { FirstlineClientOptions } from '@first-line/firstline-spa-js/';

import type { FirstlineVueClient } from './interfaces';
import { FirstlinePlugin } from './plugin';

declare module '@vue/runtime-core' {
  export interface ComponentCustomProperties {
    [FIRSTLINE_TOKEN]: FirstlineVueClient;
  }
}

/**
 * Creates the Firstline plugin.
 *
 * @param clientOptions The Auth Vue Client Options
 * @param pluginOptions Additional Plugin Configuration Options
 * @returns An instance of FirstlinePlugin
 */
export function createFirstline(
  clientOptions: FirstlineClientOptions
) {
  return new FirstlinePlugin(clientOptions);
}

/**
 * Returns the registered Firstline instance using Vue's `inject`.
 * @returns An instance of FirstlineVueClient
 */
export function useFirstline(): FirstlineVueClient {
  return inject(FIRSTLINE_INJECTION_KEY);
}

export { createAuthGuard };
