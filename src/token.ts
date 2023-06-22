import type { InjectionKey } from 'vue';
import type { FirstlineVueClient } from './interfaces';

/**
 * @ignore
 */
export const FIRSTLINE_TOKEN = '$firstline';

/**
 * Injection token used to `provide` the `FirstlineVueClient` instance. Can be used to pass to `inject()`
 *
 * ```js
 * inject(FIRSTLINE_INJECTION_KEY)
 * ```
 */
export const FIRSTLINE_INJECTION_KEY: InjectionKey<FirstlineVueClient> =
  Symbol(FIRSTLINE_TOKEN);
