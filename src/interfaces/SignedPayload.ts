import { MessageDigestAlgorithm, PayloadData } from '../types';

export interface SignedPayload<T extends PayloadData> {
  /**
   * The data payload of the signed webhook.
   * @type {T}
   * @memberof SignedPayload
   */
  data: T;

  /**
   * The signature of the signed webhook.
   * @type {string}
   * @memberof SignedPayload
   */
  sig: string;

  /**
   * The message digest algorithm used to generate the webhook signature.
   * @type {MessageDigestAlgorithm}
   * @memberof SignedPayload
   */
  alg: MessageDigestAlgorithm;

  /**
   * The issued at timestamp of the signed webhook payload.
   * Represented as UNIX epoch time in seconds.
   * @type {number}
   * @memberof SignedPayload
   */
  iat: number;
}
