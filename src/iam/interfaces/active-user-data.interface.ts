export interface ActiveUserData {
  /**
   * The "subject" of the token. the value of this properity is the user ID
   * that granted this token
   */
  sub: number;

  /**
   * the subject's (user) email
   */
  email: string;
}
