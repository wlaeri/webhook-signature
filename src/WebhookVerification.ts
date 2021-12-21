import crypto from 'crypto';
import { Stringable, SignedPayload, WebhookVerificationOptions } from './interfaces';
import { DEFAULT_ALGO, DEFAULT_TTL } from './constants';
import { MessageDigestAlgorithm } from './types';

export class WebhookVerification {
  private secret: string;
  private algo: MessageDigestAlgorithm;
  private ttl: number;

  constructor(options: WebhookVerificationOptions) {
    this.secret = options.secret;
    this.algo = options.algorithm || DEFAULT_ALGO;
    this.ttl = options.ttl || DEFAULT_TTL;
  }

  /**
   * Utility function to return current UNIX epoch time in seconds.
   * @private
   * @return {*}  {number}
   * @memberof WebhookVerification
   */
  private _getNow(): number {
    return Math.floor(Date.now() / 1000);
  }

  /**
   * Utility function to generate a hash from a payload and a timestamp.
   * @private
   * @param {Stringable} payload
   * @param {number} timestamp
   * @param {MessageDigestAlgorithm} algo
   * @param {string} secret
   * @return {*}  {string}
   * @memberof WebhookVerification
   */
  private _sign(payload: Stringable, timestamp: number, algo: MessageDigestAlgorithm, secret: string): string {
    return crypto.createHmac(algo, secret).update(JSON.stringify(payload)).update(timestamp.toString()).digest('hex');
  }

  /**
   * A function to sign a webhook request body.
   * @template T The structure of the data payload.
   * @param {T} payload The data payload to sign.
   * @param {string} [secret] Optional secret to override `this.secret`. Useful for issuing client-specific secrets.
   * @return {*}  {SignedPayload<T>}
   * @memberof WebhookVerification
   */
  public sign<T extends Stringable>(payload: T, secret?: string): SignedPayload<T> {
    const iat = this._getNow();
    const sig = this._sign(payload, iat, this.algo, secret || this.secret);
    return {
      data: payload,
      sig,
      iat,
      alg: this.algo,
    };
  }

  /**
   * Verify a signed payload by checking its provided signature against its hash.
   * @param {SignedPayload<Stringable>} signedPayload
   * @return {*}  {boolean}
   * @memberof WebhookVerification
   */
  public verify(signedPayload: SignedPayload<Stringable>): boolean {
    const age = this._getNow() - signedPayload.iat;
    if (age > this.ttl) return false;
    const hash = this._sign(signedPayload.data, signedPayload.iat, signedPayload.alg, this.secret);
    return hash === signedPayload.sig;
  }
}
