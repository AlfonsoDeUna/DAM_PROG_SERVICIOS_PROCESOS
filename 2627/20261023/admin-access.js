// Autentica la identidad para habilitar la navegación docente en esta interfaz.
// El contenido publicado en GitHub Pages es público: este control no lo hace privado.
export const ADMIN_ACCOUNT = Object.freeze({ id: 248110, login: 'AlfonsoDeUna' });
export const ADMIN_SESSION_MS = 30 * 60 * 1000;

const MESSAGES = Object.freeze({
  invalid_format: 'El formato no parece un token personal de GitHub. Pega el token completo: debe empezar por github_pat_ o ghp_ y no contener espacios interiores.',
  unauthorized_token: 'GitHub no acepta este token (401). Puede estar caducado, revocado o incompleto. Revisa que lo hayas copiado completo o crea uno nuevo.',
  forbidden: 'GitHub no permite comprobar la cuenta con este token (403). Revisa su estado en GitHub o inténtalo más tarde.',
  rate_limited: 'GitHub ha limitado las comprobaciones (429). Espera y vuelve a intentarlo más tarde.',
  network: 'No se ha podido conectar con GitHub. Comprueba tu conexión y que el navegador permita acceder a api.github.com; después vuelve a intentarlo.',
  timeout: 'La comprobación ha tardado demasiado. Revisa la conexión e inténtalo de nuevo.',
  wrong_account: 'Esta cuenta no está autorizada para el modo docente. Usa un token de AlfonsoDeUna.',
  service_error: 'GitHub no ha podido completar la comprobación. Inténtalo más tarde.',
  invalid_response: 'GitHub ha devuelto una respuesta que no permite comprobar la cuenta. Inténtalo de nuevo.'
});

function accessError(code) {
  const error = new Error(MESSAGES[code]);
  error.name = 'AdminAccessError';
  error.code = code;
  return error;
}

export async function verifyAdminToken(token, { fetchImpl = globalThis.fetch, timeoutMs = 15000 } = {}) {
  const personalToken = typeof token === 'string' ? token.trim() : '';
  if (personalToken.length > 2000 || !/^(?:github_pat_|ghp_)\S+$/u.test(personalToken)) {
    throw accessError('invalid_format');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    let response;
    try {
      response = await fetchImpl('https://api.github.com/user', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${personalToken}`,
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
      throw accessError(controller.signal.aborted ? 'timeout' : 'network');
    }

    if (!response?.ok) {
      if (response?.status === 401) throw accessError('unauthorized_token');
      if (response?.status === 403) throw accessError('forbidden');
      if (response?.status === 429) throw accessError('rate_limited');
      throw accessError('service_error');
    }

    let user;
    try {
      user = await response.json();
    } catch {
      throw accessError(controller.signal.aborted ? 'timeout' : 'invalid_response');
    }
    if (user?.id !== ADMIN_ACCOUNT.id || user?.type !== 'User') throw accessError('wrong_account');
    if (typeof user.login !== 'string' || !user.login.trim()) throw accessError('invalid_response');

    return { id: user.id, login: user.login, expiresAt: Date.now() + ADMIN_SESSION_MS };
  } finally {
    clearTimeout(timeout);
  }
}
