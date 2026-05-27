// ================= TEXT ENCODER / DECODER =================

const encoder = new TextEncoder();
const decoder = new TextDecoder();



// ================= SECRET KEY =================

const SECRET_KEY =
  import.meta.env.VITE_ENCRYPTION_KEY;



// ================= GET AES KEY =================

async function getKey() {
  return await window.crypto.subtle.importKey(
    "raw",

    encoder.encode(SECRET_KEY),

    {
      name: "AES-GCM",
    },

    false,

    ["encrypt", "decrypt"]
  );
}



// ================= ENCRYPT NOTE =================

export async function encryptNote(text) {
  const key = await getKey();

  // Generate random IV
  const iv = window.crypto.getRandomValues(
    new Uint8Array(12)
  );

  // Encrypt
  const encryptedBuffer =
    await window.crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },

      key,

      encoder.encode(text)
    );

  const encryptedArray =
    new Uint8Array(encryptedBuffer);

  return {
    encryptedContent: btoa(
      String.fromCharCode(
        ...encryptedArray
      )
    ),

    iv: btoa(
      String.fromCharCode(...iv)
    ),
  };
}



// ================= DECRYPT NOTE =================

export async function decryptNote(
  encryptedContent,
  iv
) {
  const key = await getKey();

  const encryptedArray =
    Uint8Array.from(
      atob(encryptedContent),
      (c) => c.charCodeAt(0)
    );

  const ivArray =
    Uint8Array.from(
      atob(iv),
      (c) => c.charCodeAt(0)
    );

  const decryptedBuffer =
    await window.crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv: ivArray,
      },

      key,

      encryptedArray
    );

  return decoder.decode(
    decryptedBuffer
  );
}