#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");
const iconsDir = path.join(projectRoot, "public/community-icons");
const manifestPath = path.join(projectRoot, "db/seed/community-logos.json");

const TIMEOUT_MS = 15_000;
const MAX_BYTES = 512 * 1024;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const EXTENSION_BY_MIME = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg",
  "image/x-icon": "ico",
  "image/vnd.microsoft.icon": "ico",
};

function usage() {
  console.log(`Usage:
  npm run community-icon:import -- <logo-url> <community-slug> [--force]

Examples:
  npm run community-icon:import -- https://example.com/logo.svg acme-security
  npm run community-icon:import -- https://cdn.example.com/brand.png rootedcon --force

What it does:
  - Downloads a community logo from an HTTPS URL
  - Validates image type and size (max ${MAX_BYTES} bytes)
  - Saves to public/community-icons/<slug>.<ext>
  - Updates db/seed/community-logos.json with icon_path and source_url
  - Prints the icon_url to use in seed JSON (icon_url field)

Slug rules: lowercase letters, numbers, hyphens (e.g. acme-security)
`);
}

function parseArgs(argv) {
  let force = false;
  const positional = [];

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      usage();
      process.exit(0);
    }
    if (arg === "--force") {
      force = true;
      continue;
    }
    if (arg.startsWith("--")) {
      throw new Error(`Unknown option: ${arg}`);
    }
    positional.push(arg);
  }

  const [logoUrl, slug] = positional;
  if (!logoUrl || !slug) {
    throw new Error("Provide <logo-url> and <community-slug>");
  }

  return { logoUrl, slug, force };
}

function assertValidSlug(slug) {
  if (!SLUG_PATTERN.test(slug)) {
    throw new Error(`Invalid slug "${slug}". Use lowercase letters, numbers, and hyphens only.`);
  }
}

function assertValidLogoUrl(logoUrl) {
  let parsed;
  try {
    parsed = new URL(logoUrl);
  } catch {
    throw new Error(`Invalid logo URL: ${logoUrl}`);
  }

  if (parsed.protocol !== "https:") {
    throw new Error("Logo URL must use HTTPS");
  }
}

function extensionFromUrl(logoUrl) {
  try {
    const pathname = new URL(logoUrl).pathname.toLowerCase();
    const match = pathname.match(/\.(png|jpe?g|gif|webp|svg|ico)$/);
    return match?.[1]?.replace("jpeg", "jpg") ?? null;
  } catch {
    return null;
  }
}

function sniffImageKind(buffer) {
  if (buffer.length < 12) {
    return null;
  }

  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
    return "png";
  }
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return "jpg";
  }
  if (buffer.subarray(0, 3).toString("ascii") === "GIF") {
    return "gif";
  }
  if (
    buffer.subarray(0, 4).toString("ascii") === "RIFF" &&
    buffer.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "webp";
  }
  if (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x01 && buffer[3] === 0x00) {
    return "ico";
  }

  const textStart = buffer.subarray(0, Math.min(buffer.length, 256)).toString("utf8").trim();
  if (textStart.startsWith("<svg") || textStart.startsWith("<?xml")) {
    return "svg";
  }

  return null;
}

function normalizeContentType(contentType) {
  if (!contentType) {
    return null;
  }
  return contentType.split(";")[0].trim().toLowerCase();
}

function resolveExtension({ contentType, logoUrl, buffer }) {
  const mime = normalizeContentType(contentType);
  const fromMime = mime ? EXTENSION_BY_MIME[mime] : null;
  const fromUrl = extensionFromUrl(logoUrl);
  const fromSniff = sniffImageKind(buffer);

  return fromMime ?? fromSniff ?? fromUrl ?? null;
}

async function downloadLogo(logoUrl) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const response = await fetch(logoUrl, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "Mozilla/5.0 (compatible; RutaSec-Community-Icon-Import/1.0)" },
    });

    if (!response.ok) {
      throw new Error(`Download failed with HTTP ${response.status}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (buffer.byteLength === 0) {
      throw new Error("Downloaded logo is empty");
    }
    if (buffer.byteLength > MAX_BYTES) {
      throw new Error(`Logo exceeds ${MAX_BYTES} bytes`);
    }

    const extension = resolveExtension({
      contentType: response.headers.get("content-type"),
      logoUrl,
      buffer,
    });

    if (!extension) {
      throw new Error("Could not detect a supported image type (png, jpg, gif, webp, svg, ico)");
    }

    return { buffer, extension };
  } finally {
    clearTimeout(timer);
  }
}

async function readManifest() {
  try {
    const raw = await fs.readFile(manifestPath, "utf8");
    const parsed = JSON.parse(raw);
    if (!parsed.communities || typeof parsed.communities !== "object") {
      throw new Error("Invalid manifest shape");
    }
    return parsed;
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === "ENOENT") {
      return { communities: {} };
    }
    throw error;
  }
}

async function writeManifest(manifest) {
  await fs.mkdir(path.dirname(manifestPath), { recursive: true });
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

async function main() {
  const { logoUrl, slug, force } = parseArgs(process.argv.slice(2));
  assertValidSlug(slug);
  assertValidLogoUrl(logoUrl);

  const filename = `${slug}`;
  const { buffer, extension } = await downloadLogo(logoUrl);
  const outputPath = path.join(iconsDir, `${filename}.${extension}`);
  const iconPath = `/community-icons/${filename}.${extension}`;

  await fs.mkdir(iconsDir, { recursive: true });

  if (!force) {
    try {
      await fs.access(outputPath);
      throw new Error(
        `File already exists: public/community-icons/${filename}.${extension}. Use --force to overwrite.`,
      );
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code !== "ENOENT") {
        throw error;
      }
    }
  }

  await fs.writeFile(outputPath, buffer);

  const manifest = await readManifest();
  manifest.communities[slug] = {
    icon_path: iconPath,
    source_url: logoUrl,
    updated_at: new Date().toISOString(),
  };
  await writeManifest(manifest);

  console.log(`Saved public/community-icons/${filename}.${extension}`);
  console.log(`Manifest updated: db/seed/community-logos.json`);
  console.log("");
  console.log("Use in seed JSON:");
  console.log(`  "icon_url": "${iconPath}"`);
}

main().catch((error) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Community icon import failed: ${message}`);
  process.exit(1);
});
