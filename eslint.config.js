import { defineConfig } from "eslint/config";
import svelteLint from "./packages/bakeoff1/eslint.config.js";

export default defineConfig([
  ...svelteLint
])
