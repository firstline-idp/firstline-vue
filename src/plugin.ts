import type { App, Ref } from 'vue';
import { readonly, ref } from 'vue';

import type { FirstlineVueClient, LoginWithRedirectOptions } from './interfaces';
import { FIRSTLINE_INJECTION_KEY, FIRSTLINE_TOKEN } from './token';
import { FirstlineClient, FirstlineClientOptions, ExchangeCodeResponse } from '@first-line/firstline-spa-js';
import { bindPluginMethods } from './utils';

/**
 * @ignore
 */
export const client: Ref<FirstlineVueClient> = ref(null);

/**
 * @ignore
 */
export class FirstlinePlugin implements FirstlineVueClient {
  private _client: FirstlineClient;
  private _tokens: ExchangeCodeResponse | null = null;
  private _isLoading: Ref<boolean> = ref(true);
  private _isAuthenticated: Ref<boolean> = ref(false);
  private _user: Ref<any> = ref({});
  private _error = ref(null);

  isLoading = readonly(this._isLoading);
  isAuthenticated = readonly(this._isAuthenticated);
  user = readonly(this._user);
  error = readonly(this._error);

  constructor(
    private clientOptions: FirstlineClientOptions
  ) {
    // Vue Plugins can have issues when passing around the instance to `provide`
    // Therefor we need to bind all methods correctly to `this`.
    bindPluginMethods(this, ['constructor']);
  }

  install(app: App) {
    this._client = new FirstlineClient(this.clientOptions);

    // eslint-disable-next-line security/detect-object-injection
    app.config.globalProperties[FIRSTLINE_TOKEN] = this;
    app.provide(FIRSTLINE_INJECTION_KEY, this);

    client.value = this;

    this.getTokens().then().catch(e => undefined);
  }

  async loginWithRedirect(options?: LoginWithRedirectOptions) {
    return this._client.loginRedirect(options);
  }

  async logout() {
    return this._client.logout();
  }

  async doExchangeOrRefresh() {
    this._tokens = await this._client.doExchangeOrRefresh();
    return this._tokens;
  }

  async getTokens() {
    if (this._tokens)
      return this._tokens;

    return this.__proxy(() => this.doExchangeOrRefresh());
  }

  async getAccessToken() {
    const tokens = await this.getTokens();
    return tokens ? tokens.access_token : "";
  }

  private async __refreshState() {
    if (this._tokens) {
      this._user.value = this._client.getUser(this._tokens);
      this._isAuthenticated.value = true;
    }
    this._isLoading.value = false;
  }

  private async __proxy<T>(cb: () => T, refreshState = true) {
    let result;
    try {
      result = await cb();
      this._error.value = null;
    } catch (e) {
      this._error.value = e;
      throw e;
    } finally {
      if (refreshState) {
        await this.__refreshState();
      }
    }

    return result;
  }
}
