import { SignedPayload, WebhookVerification } from '../src';

const webhookVerification = new WebhookVerification({
  secret: 'my-super-secret-phrase', // Replace with the secret you want to sign the webhook payloads with.
  ttl: 9999999999999, // Infinite TTL for testing purposes.
});

/**
 * The webhook request payload for a property listing update event.
 * @interface
 */
interface ListingUpdateEvent {
  /**
   * The UUID of the updated listing.
   * @type {string}
   * @memberof ListingUpdateEvent
   */
  listingId: string;
}

const payload: ListingUpdateEvent = {
  listingId: '4909afcd-311b-4f7e-9123-8b7fe4a9ad95',
};

const signedPayload: SignedPayload<ListingUpdateEvent> = webhookVerification.sign(payload);

console.log('SIGNED PAYLOAD:\n', signedPayload);

const validPayload: SignedPayload<ListingUpdateEvent> = {
  data: {
    listingId: '4909afcd-311b-4f7e-9123-8b7fe4a9ad95',
  },
  sig: '02d681e1c2e8bcd4e785558987e144eca8d398ae15032034a9ca97dfaf9352c5',
  iat: 1640123352,
  alg: 'sha256',
};

console.log(webhookVerification.verify(validPayload)); // true

const invalidPayload: SignedPayload<ListingUpdateEvent> = {
  data: {
    listingId: '4909afcd-311b-4f7e-9123-8b7fe4a9ad95',
  },
  sig: 'invalid-signature',
  iat: 1640123352,
  alg: 'sha256',
};

console.log(webhookVerification.verify(invalidPayload)); // false
