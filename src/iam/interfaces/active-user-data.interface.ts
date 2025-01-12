export interface ActiveUserData {
  /**
   *
   * The *subject* of the token. This will be the user's ID of the user that is currently authenticated.
   */
  sub: number;

  /**
   *
   * The *email* of the user that is currently authenticated.
   */
  email: string;
}
