/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Ref } from 'vue';

export interface FirstlineVueClient {
  /**
   * The loading state of the SDK, `true` if the SDK is still processing the PKCE flow, `false` if the SDK has finished processing the PKCE flow.
   */
  isLoading: Ref<boolean>;

  /**
   * The authentication state, `true` if the user is authenticated, `false` if not.
   */
  isAuthenticated: Ref<boolean>;

  /**
   * Contains the information of the user if available.
   */
  user: Ref<any>;

  /**
   * Contains an error that occured in the SDK
   */
  error: Ref<any>;

  /**
   * ```js
   * await loginRedirect();
   * ```
   *
   * Performs a redirect to `/authorize` using the parameters
   * provided as arguments. Random and secure `state` and `nonce`
   * parameters will be auto-generated.
   *
   * @param options
   */
  loginRedirect(): Promise<void>;

  /**
   * Fetches a new access token and returns the response from the /oauth/token endpoint, omitting the refresh token.
   */
  getAccessTokenSilently(): Promise<string>;

  /**
   * ```js
   * logout();
   * ```
   *
   * Clears the application session and performs a redirect to `/v2/logout`, using
   * the parameters provided as arguments, to clear the Firstline session.
   *
   * **Note:** If you are using a custom cache, and specifying `localOnly: true`, and you want to perform actions or read state from the SDK immediately after logout, you should `await` the result of calling `logout`.
   *
   * If the `federated` option is specified it also clears the Identity Provider session.
   * If the `localOnly` option is specified, it only clears the application session.
   * It is invalid to set both the `federated` and `localOnly` options to `true`,
   * and an error will be thrown if you do.
   *
   * @param options
   */
  logout(): Promise<void>;
}
