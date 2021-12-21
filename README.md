# Webhook Verification
A utility for signing and verifying webhook requests.

## Usage

Install `webhook-verfication` as a dependency in your project:

```sh
$ npm install webhook-verification
```

Create an instance of `WebhookVerification`:
```ts
import { WebhookVerification } from 'webhook-verification'

const webhookVerification = new WebhookVerification({
  secret: 'my-super-secret-phrase', // Replace with the secret you want to sign the webhook payloads with.
})

```

Sign your webhook request on the server:
```ts
import { SignedPayload } from 'webhook-verification'

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

const signedPayload: SignedPayload<ListingUpdateEvent> = webhookVerification.sign(payload)

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
webhookVerification.verify(signedPayload); // => true

const invalidPayload: SignedPayload<ListingUpdateEvent> = {
  data: {
    listingId: '4909afcd-311b-4f7e-9123-8b7fe4a9ad95',
  },
  sig: 'invalid-signature',
  iat: 1640123352,
  alg: 'sha256',
};

webhookVerification.verify(invalidPayload); // => false

```

Since the request body is signed with the data payload and the issued at timestamp, changing either will cause validation to fail.
