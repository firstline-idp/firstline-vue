import type { RouteLocation } from 'vue-router';
import { watchEffectOnceAsync } from './utils';
import { client as firstlineClient } from './plugin';
import { FIRSTLINE_TOKEN } from './token';
import type { FirstlineVueClient } from './interfaces';
import type { App } from 'vue';
import { unref } from 'vue';

async function createGuardHandler(
  client: FirstlineVueClient,
  to: RouteLocation
) {
  const fn = async () => {
    if (unref(client.isAuthenticated)) {
      return true;
    }

    await client.loginRedirect();

    return false;
  };

  if (!unref(client.isLoading)) {
    return fn();
  }

  await watchEffectOnceAsync(() => !unref(client.isLoading));

  return fn();
}

/**
 * The options used when creating an AuthGuard.
 */
export interface AuthGuardOptions {
  /**
   * The vue application
   */
  app?: App;
}

/**
 *
 * @param [app] The vue application
 */
export function createAuthGuard(
  app?: App
): (to: RouteLocation) => Promise<boolean>;

/**
 *
 * @param [options] The options used when creating an AuthGuard.
 */
export function createAuthGuard(
  options?: AuthGuardOptions
): (to: RouteLocation) => Promise<boolean>;

export function createAuthGuard(
  appOrOptions?: App | AuthGuardOptions
): (to: RouteLocation) => Promise<boolean> {
  const { app } =
    !appOrOptions || 'config' in appOrOptions
      ? { app: appOrOptions as App }
      : (appOrOptions as AuthGuardOptions);

  return async (to: RouteLocation) => {
    // eslint-disable-next-line security/detect-object-injection
    const firstline = app
      ? (app.config.globalProperties[FIRSTLINE_TOKEN] as FirstlineVueClient)
      : unref(firstlineClient);

    return createGuardHandler(firstline, to);
  };
}

export async function authGuard(to: RouteLocation) {
  const firstline = unref(firstlineClient);

  return createGuardHandler(firstline, to);
}
