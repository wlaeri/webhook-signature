import { SignedPayload } from './interfaces/SignedPayload';
import { WebhookVerification } from './WebhookVerification';

describe('WebhookVerification', () => {
  let webhookVerification: WebhookVerification;
  beforeAll(() => {
    webhookVerification = new WebhookVerification({ secret: 'top-secret', ttl: 1 });
  });
  afterAll(jest.clearAllMocks);
  describe('sign method', () => {
    it('returns the same signature for identical payloads signed at the same time', () => {
      const payload = {
        message: 'test',
      };
      Date.now = jest.fn(() => 60000);
      const signedPayload1 = webhookVerification.sign(payload);
      const signedPayload2 = webhookVerification.sign(payload);
      expect(signedPayload1.sig).toEqual(signedPayload2.sig);
    });

    it('returns a different signature for identical payloads signed at different times', () => {
      const payload = {
        message: 'test',
      };
      Date.now = jest.fn(() => 60000);
      const signedPayload1 = webhookVerification.sign(payload);
      Date.now = jest.fn(() => 120000);
      const signedPayload2 = webhookVerification.sign(payload);
      expect(signedPayload1.sig).not.toEqual(signedPayload2.sig);
    });

    it('returns a different signature for different payloads signed at the same time', () => {
      const payload1 = {
        message: 'test1',
      };
      const payload2 = {
        message: 'test2',
      };
      Date.now = jest.fn(() => 60000);
      const signedPayload1 = webhookVerification.sign(payload1);
      const signedPayload2 = webhookVerification.sign(payload2);
      expect(signedPayload1.sig).not.toEqual(signedPayload2.sig);
    });

    it('returns a different signature for identical payloads signed at the same time with different secrets', () => {
      const payload = {
        message: 'test',
      };
      Date.now = jest.fn(() => 60000);
      const signedPayload1 = webhookVerification.sign(payload, 'top-secret-1');
      const signedPayload2 = webhookVerification.sign(payload, 'top-secret-2');
      expect(signedPayload1.sig).not.toEqual(signedPayload2.sig);
    });
  });
  describe('verify method', () => {
    it('returns false for a signed payload with an expired issued at timestamp', () => {
      const signedPayload: SignedPayload<{ message: string }> = {
        data: {
          message: 'test',
        },
        sig: 'invalid',
        alg: 'sha256',
        iat: 60,
      };
      Date.now = jest.fn(() => 120000);
      expect(webhookVerification.verify(signedPayload)).toBe(false);
    });

    it('returns false for a signed payload with an invalid signature', () => {
      const signedPayload: SignedPayload<{ message: string }> = {
        data: {
          message: 'test',
        },
        sig: 'invalid',
        alg: 'sha256',
        iat: 60,
      };
      Date.now = jest.fn(() => 60000);
      expect(webhookVerification.verify(signedPayload)).toBe(false);
    });

    it('returns true for a signed payload with a valid signature', () => {
      const signedPayload: SignedPayload<{ message: string }> = {
        data: {
          message: 'test',
        },
        sig: 'ede4af2b45d72cd4a766528bd08c7f436a42c9e7d1e8f612e9c6cdf9098dbc7e',
        alg: 'sha256',
        iat: 60,
      };
      Date.now = jest.fn(() => 60000);
      expect(webhookVerification.verify(signedPayload)).toBe(true);
    });
  });
});
