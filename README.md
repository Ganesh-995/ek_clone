# EK Celebrations

## Inquiry database setup

The inquiry form sends submissions to the Express API in `server/`, which stores them in MongoDB through Mongoose.

1. Create a MongoDB Atlas cluster and database user.
2. Copy `.env.example` to `.env` and replace `MONGODB_URI` with the Atlas connection string.
3. Start the API with `npm run server`.
4. Start the frontend with `npm run dev`.

For local development, Vite proxies `/api` to `http://localhost:5000`. For production, deploy the `server/` API to a Node host such as Render or Railway, then set the Netlify environment variable `VITE_API_URL` to that API's public URL and redeploy the frontend. Set the API's `CLIENT_ORIGIN` to the Netlify site URL.

## Available commands

- `npm run dev` - start the Vite frontend
- `npm run server` - start the MongoDB API
- `npm run build` - create a production frontend build

## Original Vite notes

This template provides a minimal setup to get React working in Vite with HMR and some Oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
