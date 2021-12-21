import crypto from 'crypto';
import { DEFAULT_ALGO, DEFAULT_TTL } from './constants';
import { SignedPayload } from './interfaces/SignedPayload';
import { WebhookAuthOptions } from './interfaces/WebhookAuthOptions';
import { MessageDigestAlgorithm, PayloadData } from './types';

export class WebhookAuth {
  private secret: string;
  private algo: MessageDigestAlgorithm;
  private ttl: number;

  constructor(options: WebhookAuthOptions) {
    this.secret = options.secret;
    this.algo = options.algorithm || DEFAULT_ALGO;
    this.ttl = options.ttl || DEFAULT_TTL;
  }

  /**
   * Utility function to return current UNIX epoch time in seconds.
   * @private
   * @return {*}  {number}
   * @memberof WebhookAuth
   */
  private _getNow(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Utility function to generate a hash from a payload and a timestamp.
   * @private
   * @param {PayloadData} payload
   * @param {number} timestamp
   * @return {*}  {string}
   * @memberof WebhookAuth
   */
  private _sign(payload: PayloadData, timestamp: number): string {
    return crypto
      .createHmac(this.algo, this.secret)
      .update(JSON.stringify(payload))
      .update(timestamp.toString())
      .digest('hex');
  }

  /**
   * A function to sign a webhook request body.
   * @template T The structure of the data payload.
   * @param {T} payload The data payload to sign.
   * @return {*}  {SignedPayload<T>}
   * @memberof WebhookAuth
   */
  public sign<T extends PayloadData>(payload: T): SignedPayload<T> {
    const iat = this._getNow();
    const sig = this._sign(payload, iat);
    return {
      data: payload,
      sig,
      iat,
    };
  }

  /**
   * Verify a signed payload by checking its provided signature against its hash.
   * @param {SignedPayload<PayloadData>} signedPayload
   * @return {*}  {boolean}
   * @memberof WebhookAuth
   */
  public verify(signedPayload: SignedPayload<PayloadData>): boolean {
    const age = this._getNow() - signedPayload.iat;
    if (age > this.ttl) return false;
    const hash = this._sign(signedPayload.data, signedPayload.iat);
    return hash === signedPayload.sig;
  }
}
