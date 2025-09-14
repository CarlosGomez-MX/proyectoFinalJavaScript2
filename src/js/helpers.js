// src/js/helpers.js
import { TIMEOUT_SEC } from './config.js';

// Promesa que rechaza después de s segundos
const timeout = function (s) {
  return new Promise((_, reject) => {
    setTimeout(
      () =>
        reject(
          new Error(`Request took too long! Timeout after ${s} second${s > 1 ? 's' : ''}`)
        ),
      s * 1000
    );
  });
};

// getJSON: hace fetch con timeout y devuelve data
export const getJSON = async function (url) {
  try {
    const fetchPro = fetch(url);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok) throw new Error(`${data.message} (${res.status})`);
    return data;
  } catch (error) {
    throw error; // se propaga al caller (model.js)
  }
};

export { timeout };
