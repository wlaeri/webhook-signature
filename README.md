# Webhook Verifier
A utility for signing and verifying webhook requests.

## Usage

Install `webhook-verifier` as a dependency in your project:

```sh
$ npm install webhook-verifier
```

Create an instance of `WebhookVerifier`:
```ts
import { WebhookVerifier } from 'webhook-verifier'

const webhookVerifier = new WebhookVerifier({
  secret: 'my-super-secret-phrase', // Replace with the secret you want to sign the webhook payloads with.
})

```

Sign your webhook request on the server:
```ts
import { SignedPayload } from 'webhook-verifier'

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
  listingId: string
}

const payload: ListingUpdateEvent = {
  listingId: '4909afcd-311b-4f7e-9123-8b7fe4a9ad95'
}

const signedPayload: SignedPayload<ListingUpdateEvent> = webhookVerifier.sign(payload)

```

Your signed payload will now have the following attributes:

```json
{
  "data": {
    "listingId": "4909afcd-311b-4f7e-9123-8b7fe4a9ad95"
  },
  "sig": "02d681e1c2e8bcd4e785558987e144eca8d398ae15032034a9ca97dfaf9352c5",
  "iat": 1640123352,
  "alg": "sha256"
}

```

You can now verify your signed payload on the client side:
```ts
webhookVerifier.verify(signedPayload); // => true

const invalidPayload: SignedPayload<ListingUpdateEvent> = {
  data: {
    listingId: '4909afcd-311b-4f7e-9123-8b7fe4a9ad95',
  },
  sig: 'invalid-signature',
  iat: 1640123352,
  alg: 'sha256',
};

webhookVerifier.verify(invalidPayload); // => false

```

Since the request body is signed with the data payload and the issued at timestamp, changing either will cause verification to fail.
