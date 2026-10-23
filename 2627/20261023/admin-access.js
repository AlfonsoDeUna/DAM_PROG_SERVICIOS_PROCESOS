// Autentica la identidad para habilitar la navegación docente en esta interfaz.
// El contenido publicado en GitHub Pages es público: este control no lo hace privado.
export const ADMIN_ACCOUNT = Object.freeze({ id: 248110, login: 'AlfonsoDeUna' });
export const ADMIN_SESSION_MS = 30 * 60 * 1000;

const INVALID_TOKEN = 'El token no es válido. Usa un token personal fine-grained de GitHub.';
const OTHER_ACCOUNT = 'Esta cuenta no está autorizada para el modo docente.';
const UNAVAILABLE = 'No se pudo comprobar la cuenta en GitHub. Revisa la conexión e inténtalo de nuevo.';
const LIMITED = 'GitHub no permite completar la comprobación ahora. Revisa el token o inténtalo más tarde.';
const TIMED_OUT = 'La comprobación ha tardado demasiado. Inténtalo de nuevo.';

export async function verifyAdminToken(token, { fetchImpl = globalThis.fetch, timeoutMs = 15000 } = {}) {
  if (typeof token !== 'string' || !token.startsWith('github_pat_') || token.length > 2000 || /\s/u.test(token)) {
    throw new Error(INVALID_TOKEN);
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response;
    try {
      response = await fetchImpl('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/vnd.github+json',
          'X-GitHub-Api-Version': '2026-03-10'
        },
        credentials: 'omit',
        redirect: 'error',
        cache: 'no-store',
        referrerPolicy: 'no-referrer',
        signal: controller.signal
      });
    } catch {
      throw new Error(controller.signal.aborted ? TIMED_OUT : UNAVAILABLE);
    }

    if (!response?.ok) {
      if (response?.status === 401) throw new Error(INVALID_TOKEN);
      if (response?.status === 403 || response?.status === 429) throw new Error(LIMITED);
      throw new Error(UNAVAILABLE);
    }

    let user;
    try {
      user = await response.json();
    } catch {
      throw new Error(controller.signal.aborted ? TIMED_OUT : UNAVAILABLE);
    }
    if (user?.id !== ADMIN_ACCOUNT.id || user?.type !== 'User') throw new Error(OTHER_ACCOUNT);
    if (typeof user.login !== 'string' || !user.login.trim()) throw new Error(UNAVAILABLE);

    return { id: user.id, login: user.login, expiresAt: Date.now() + ADMIN_SESSION_MS };
  } finally {
    clearTimeout(timeout);
  }
}
