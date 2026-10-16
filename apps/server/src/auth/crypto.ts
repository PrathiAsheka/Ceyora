/**
 * Password hashing (PBKDF2-SHA256, same format as the web app's local mode),
 * random session tokens and access codes. Tokens and codes are stored only
 * as SHA-256 digests.
 */
import { createHash, pbkdf2, randomBytes, randomInt, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const pbkdf2Async = promisify(pbkdf2);
const ITERATIONS = 120_000;
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await pbkdf2Async(password, salt, ITERATIONS, 32, "sha256");
  return `pbkdf2$${ITERATIONS}$${salt.toString("hex")}$${hash.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [scheme, iterations, salt, hash] = stored.split("$");
  if (scheme !== "pbkdf2" || !iterations || !salt || !hash) return false;
  const expected = Buffer.from(hash, "hex");
  const actual = await pbkdf2Async(password, Buffer.from(salt, "hex"), Number(iterations), expected.length, "sha256");
  return actual.length === expected.length && timingSafeEqual(actual, expected);
}

export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export const newToken = () => randomBytes(32).toString("hex");

/** A fresh access code, e.g. "CEY-7KQ2-M9XD", and its normalised form. */
export function newAccessCode(): { display: string; normalized: string } {
  const chars = Array.from({ length: 8 }, () => CODE_ALPHABET[randomInt(CODE_ALPHABET.length)]).join("");
  const display = `CEY-${chars.slice(0, 4)}-${chars.slice(4)}`;
  return { display, normalized: display.replace(/-/g, "") };
}

/**
 * A password hash to compare against when the username doesn't exist, so a
 * failed sign-in takes the same time either way.
 */
export const DUMMY_HASH = `pbkdf2$${ITERATIONS}$${"0".repeat(32)}$${"0".repeat(64)}`;
