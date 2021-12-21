import { SignedPayload } from './interfaces/SignedPayload';
import { WebhookAuth } from './WebhookAuth';

describe('WebhookAuth', () => {
  let webhookAuth: WebhookAuth;
  beforeAll(() => {
    webhookAuth = new WebhookAuth({ secret: 'top-secret', ttl: 1 });
  });
  afterAll(jest.clearAllMocks);
  describe('sign method', () => {
    it('returns the same signature for identical payloads signed at the same time', () => {
      const payload = {
        message: 'test',
      };
      Date.now = jest.fn(() => 60000);
      const signedPayload1 = webhookAuth.sign(payload);
      const signedPayload2 = webhookAuth.sign(payload);
      expect(signedPayload1.sig).toEqual(signedPayload2.sig);
    });

    it('returns a different signature for identical payloads signed at different times', () => {
      const payload = {
        message: 'test',
      };
      Date.now = jest.fn(() => 60000);
      const signedPayload1 = webhookAuth.sign(payload);
      Date.now = jest.fn(() => 120000);
      const signedPayload2 = webhookAuth.sign(payload);
      expect(signedPayload1.sig).not.toEqual(signedPayload2.sig);
    });

    it('returns a different signature for identical payloads signed at the same time', () => {
      const payload1 = {
        message: 'test1',
      };
      const payload2 = {
        message: 'test2',
      };
      Date.now = jest.fn(() => 60000);
      const signedPayload1 = webhookAuth.sign(payload1);
      const signedPayload2 = webhookAuth.sign(payload2);
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
        iat: 60,
      };
      Date.now = jest.fn(() => 120000);
      expect(webhookAuth.verify(signedPayload)).toBe(false);
    });

    it('returns false for a signed payload with an invalid signature', () => {
      const signedPayload: SignedPayload<{ message: string }> = {
        data: {
          message: 'test',
        },
        sig: 'invalid',
        iat: 60,
      };
      Date.now = jest.fn(() => 60000);
      expect(webhookAuth.verify(signedPayload)).toBe(false);
    });

    it('returns true for a signed payload with a valid signature', () => {
      const signedPayload: SignedPayload<{ message: string }> = {
        data: {
          message: 'test',
        },
        sig: 'ede4af2b45d72cd4a766528bd08c7f436a42c9e7d1e8f612e9c6cdf9098dbc7e',
        iat: 60,
      };
      Date.now = jest.fn(() => 60000);
      expect(webhookAuth.verify(signedPayload)).toBe(true);
    });
  });
});
