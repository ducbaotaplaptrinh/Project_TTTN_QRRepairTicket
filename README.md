# React + Vite

## Environment variables

Copy `.env.example` to `.env.local` for local development and set `VITE_API_BASE_URL` to the backend origin without `/api` (for example, `http://localhost:5000`). API requests add the documented `/api/...` paths. For a phone on Wi-Fi, use the backend computer's LAN IP instead of `localhost`. The local `.env.local` file is ignored by Git.

For staging, create `.env.staging` with its backend URL and run `npm run build -- --mode staging`. For production, set `VITE_API_BASE_URL` in the deployment environment (or `.env.production`) before building. Vite embeds these values at build time, so rebuild/redeploy after changing them.

Restart the Vite dev server after changing a local env file.

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.
You can also try [the experimental native React Compiler support in plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md#rust-react-compiler) by using `compiler: true` in the plugin options instead of using the Babel plugin.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
