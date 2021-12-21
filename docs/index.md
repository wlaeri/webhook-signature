# What are webhooks?
Webhooks are a method for pushing data change notifications over HTTP. Usually, a *client* exposes an API endpoint and registers the URL of that endpoint with a *server*. The server can then send `POST` requests to that endpoint when a data change event occurs. This allows clients to receive updates in real time when data changes on the server.

# What information should be included in the body of a webhook request?
Webhook payloads should include enough information for the client to fetch relevant update information from the server and nothing more. 