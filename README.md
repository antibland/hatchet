# Getting Hatchet Running Locally

There's a client and server side to Hatchet. The server starts at `/` and runs on Node Express. There is no server-side rendering. All that's done on the client, in React. The client is located in `/client`.

## Set up the server side

1. Navigate to project root and run `yarn install`.
2. Create `.env` and fill it with necessary credentials. `EMAIL_USER` and `EMAIL_PASS` come from the Ethereal mail account you'll need to create [here](https://ethereal.email/create). Well, you'll need to create it to get emails sending when you're in the dev environment. While in the dev environment, emails are trapped using the aforementioned service and are not *real* outside of the production environment. If you open up the terminal after a sent email in dev mode, you'll see a URL you can visit to see an email preview. `ROOT_URL` is used to redirect back to the web app from the test email links. Finally, `JWT_SECRET` is used when creating tokens during account login. Create an arbitrary value here.

```
EMAIL_USER=<SOME_KEY>@ethereal.email
EMAIL_PASS=<SOME_PASSWORD>
JWT_SECRET=<WHATEVER_YOU_WANT_IT_TO_BE>
ROOT_URL=http://localhost:3000
```

## Set up the client side

1. Navigate to `/client`
2. Create `.env` and add the following key/value: `SKIP_PREFLIGHT_CHECK=true`. This helps to resolve an `es-lint` issue during package installation.
3. From the same directory, run `yarn install`

## Start the server and client

1. Open up two tabs in the terminal—one for the server and one for the client.
2. In tab 1, to project root and run `yarn start`.
3. In tab 2, navigate to `/client` and run `yarn start`.

You should see a new instance of Hatchet running at `http://localhost:3000`.

Done!