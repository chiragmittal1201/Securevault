import crypto from "crypto";

const algorithm = "aes-256-gcm";

const secretKey = Buffer.from(
  process.env.ENCRYPTION_KEY
);



// ================= ENCRYPT =================

export function encrypt(text) {
  // Generate IV
  const iv = crypto.randomBytes(12);

  // Create cipher
  const cipher = crypto.createCipheriv(
    algorithm,
    secretKey,
    iv
  );

  // Encrypt
  let encrypted = cipher.update(
    text,
    "utf8",
    "base64"
  );

  encrypted += cipher.final("base64");

  // Get auth tag
  const authTag = cipher.getAuthTag();

  return {
    encryptedContent: encrypted,

    iv: iv.toString("base64"),

    authTag:
      authTag.toString("base64"),
  };
}



// ================= DECRYPT =================

export function decrypt(
  encryptedContent,
  iv,
  authTag
) {
  // Create decipher
  const decipher =
    crypto.createDecipheriv(
      algorithm,
      secretKey,
      Buffer.from(iv, "base64")
    );

  // Set auth tag
  decipher.setAuthTag(
    Buffer.from(authTag, "base64")
  );

  // Decrypt
  let decrypted = decipher.update(
    encryptedContent,
    "base64",
    "utf8"
  );

  decrypted += decipher.final("utf8");

  return decrypted;
}