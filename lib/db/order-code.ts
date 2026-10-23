import "server-only";
import { randomInt } from "node:crypto";

// No 0/O or 1/I/L, so codes are easy to read out at the counter.
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

export function orderCode() {
  let code = "GG-";
  for (let i = 0; i < 5; i++)
    code += CODE_ALPHABET[randomInt(CODE_ALPHABET.length)];
  return code;
}

// A clash with an existing order code; callers retry with a new one.
export function isDuplicateCode(error: unknown) {
  const cause = (error as { cause?: unknown })?.cause ?? error;
  const { code, constraint_name } = cause as {
    code?: string;
    constraint_name?: string;
  };
  return code === "23505" && constraint_name === "orders_code_unique";
}
