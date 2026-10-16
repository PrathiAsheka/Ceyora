/**
 * Vercel serverless entry point: every request (see vercel.json) is handled
 * by the Express app. Locally, `npm run dev` runs src/index.ts instead.
 */
import { createApp } from "../src/app";

export default createApp();
