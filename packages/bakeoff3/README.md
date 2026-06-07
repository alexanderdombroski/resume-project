# Bakeoff 3

## Clerk auth setup

This app uses Clerk for authentication with a modal sign-in/register flow in the nav and a protected
`/dashboard` route.

Add these env vars in your local `.env` file:

```bash
PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
```

In the Clerk dashboard, enable the username/password sign-in method you want to support for the app.
The modal uses Clerk's prebuilt `SignIn` component, which supports both sign in and sign up.

Run `npm install` after pulling the Clerk dependency update, then start the app with `npm run dev`.
