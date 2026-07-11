import { build, context } from "esbuild";
import { gzipSync } from "node:zlib";
import { readFileSync, existsSync } from "node:fs";

try {
  process.loadEnvFile(new URL("../.env.local", import.meta.url));
} catch {
  // .env.local is optional (e.g. CI) — falls back to the default below.
}

const MAX_GZIP_BYTES = 30 * 1024;

const apiBase = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

const options = {
  entryPoints: ["widget/src/index.ts"],
  outfile: "public/v1.js",
  bundle: true,
  minify: true,
  sourcemap: false,
  format: "iife",
  target: ["es2019"],
  platform: "browser",
  legalComments: "none",
  define: {
    __CANCELKIT_API_BASE__: JSON.stringify(apiBase),
  },
};

function reportSize() {
  const raw = readFileSync("public/v1.js");
  const gzipped = gzipSync(raw);
  const rawKb = (raw.length / 1024).toFixed(1);
  const gzipKb = (gzipped.length / 1024).toFixed(1);
  const status = gzipped.length <= MAX_GZIP_BYTES ? "OK" : "OVER BUDGET";
  console.log(`[widget] public/v1.js — ${rawKb}KB raw / ${gzipKb}KB gzip (budget 30KB gzip) [${status}]`);
  if (gzipped.length > MAX_GZIP_BYTES) {
    process.exitCode = 1;
  }
}

async function main() {
  if (process.argv.includes("--watch")) {
    const ctx = await context(options);
    await ctx.watch();
    console.log("[widget] watching widget/src for changes...");
    return;
  }

  await build(options);
  if (existsSync("public/v1.js")) reportSize();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
