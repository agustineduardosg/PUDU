const encoder = new TextEncoder();

export const ADMIN_SESSION_COOKIE = "pudu_admin_session";
export const ADMIN_SESSION_MAX_AGE = 60 * 60 * 8;

type SessionPayload = {
  exp: number;
  role: "admin";
  version: 1;
};

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function stringToBase64Url(value: string) {
  return bytesToBase64Url(encoder.encode(value));
}

function base64UrlToString(value: string) {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));

  return new TextDecoder().decode(bytes);
}

function constantTimeEqual(left: string, right: string) {
  if (left.length !== right.length) {
    return false;
  }

  let mismatch = 0;

  for (let index = 0; index < left.length; index += 1) {
    mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }

  return mismatch === 0;
}

async function sha256(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(digest));
}

async function sign(value: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { hash: "SHA-256", name: "HMAC" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));

  return bytesToBase64Url(new Uint8Array(signature));
}

function getSessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error(
      "ADMIN_SESSION_SECRET debe contener al menos 32 caracteres.",
    );
  }

  return secret;
}

export async function verifyAdminPassword(candidate: string) {
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword || candidate.length === 0) {
    return false;
  }

  const [candidateDigest, configuredDigest] = await Promise.all([
    sha256(candidate),
    sha256(configuredPassword),
  ]);

  return constantTimeEqual(candidateDigest, configuredDigest);
}

export async function createAdminSessionToken() {
  const payload: SessionPayload = {
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_MAX_AGE,
    role: "admin",
    version: 1,
  };
  const encodedPayload = stringToBase64Url(JSON.stringify(payload));
  const signature = await sign(encodedPayload, getSessionSecret());

  return `${encodedPayload}.${signature}`;
}

export async function verifyAdminSessionToken(token?: string) {
  if (!token) {
    return false;
  }

  try {
    const [encodedPayload, providedSignature, extra] = token.split(".");

    if (!encodedPayload || !providedSignature || extra) {
      return false;
    }

    const expectedSignature = await sign(encodedPayload, getSessionSecret());

    if (!constantTimeEqual(providedSignature, expectedSignature)) {
      return false;
    }

    const payload = JSON.parse(
      base64UrlToString(encodedPayload),
    ) as SessionPayload;

    return (
      payload.version === 1 &&
      payload.role === "admin" &&
      payload.exp > Math.floor(Date.now() / 1000)
    );
  } catch {
    return false;
  }
}
