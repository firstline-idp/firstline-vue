/**
 * Additional Configuration for the Firstline Vue plugin
 */
export interface FirstlinePluginOptions {
  /**
   * Path in your application to redirect to when the Authorization server
   * returns an error. Defaults to `/`
   */
  errorPath?: string;
}
