import { MessageDigestAlgorithm } from '../types';

/**
 * Configuration options for the WebhookVerification class.
 */
export interface WebhookVerificationOptions {
  /**
   * The shared secret used by the server to sign the webhook payload
   * and by the client to verify the request.
   * @type {string}
   * @memberof WebhookVerificationOptions
   */
  secret: string;

  /**
   * The message digest algorithm used to generate the webhook signature.
   * @default DEFAULT_ALGO
   * @type {MessageDigestAlgorithm}
   * @memberof WebhookVerificationOptions
   */
  algorithm?: MessageDigestAlgorithm;

  /**
   * The time-to-live (TTL) of the signed payload in seconds.
   * @type {number}
   * @memberof WebhookVerificationOptions
   */
  ttl?: number;
}
