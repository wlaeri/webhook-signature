import { MessageDigestAlgorithm } from '../types';

/**
 * Configuration options for the WebhookAuth class.
 */
export interface WebhookAuthOptions {
  /**
   * The shared secret used by the server to sign the webhook payload
   * and by the client to verify the request.
   * @type {string}
   * @memberof WebhookAuthOptions
   */
  secret: string;

  /**
   * The message digest algorithm to generate the webhook signature.
   * @default DEFAULT_ALGO
   * @type {MessageDigestAlgorithm}
   * @memberof WebhookAuthOptions
   */
  algorithm?: MessageDigestAlgorithm;

  /**
   * The time-to-live (TTL) of the signed payload in seconds.
   * @type {number}
   * @memberof WebhookAuthOptions
   */
  ttl?: number;
}
