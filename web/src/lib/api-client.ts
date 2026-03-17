export type AuthStatus = {
  autenticado: boolean;
  usuario: {
    id: string;
    usuario: string;
    nombre: string;
    esNuevo?: boolean;
    rol: 'usuario' | 'admin';
  } | null;
};

export type Agreement = {
  fecha: string;
  titulo: string;
  descripcion: string;
  etiquetas: string[];
  origen: string;
};

async function parseJsonSafe(response: Response) {
  try {
    return await response.json();
  } catch {
    return {};
  }
}

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    credentials: 'include',
  });

  const data = await parseJsonSafe(response);
  if (!response.ok) {
    throw new Error((data as { error?: string })?.error || `Error ${response.status}`);
  }

  return data as T;
}

export const api = {
  login: (usuario: string, password: string) =>
    apiFetch<AuthStatus>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ usuario, password }),
    }),

  register: (usuario: string, password: string, nombre: string) =>
    apiFetch<{ message: string }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ usuario, password, nombre }),
    }),

  status: () => apiFetch<AuthStatus>('/api/auth/status'),

  me: () => apiFetch<{ usuario: NonNullable<AuthStatus['usuario']> & { ultimoAcceso?: string } }>('/api/auth/me'),

  logout: () =>
    apiFetch<{ message: string; autenticado: false }>('/api/auth/logout', {
      method: 'POST',
    }),

  consultar: (prompt: string) =>
    apiFetch<{ respuesta: string; acuerdos?: Agreement[] }>('/api/chat/consulta', {
      method: 'POST',
      body: JSON.stringify({ prompt }),
    }),

  previewRegistro: (text: string) =>
    apiFetch<Agreement>('/api/chat/registro/preview', {
      method: 'POST',
      body: JSON.stringify({ text }),
    }),

  confirmRegistro: (acuerdoData: Agreement) =>
    apiFetch<{ message: string }>('/api/chat/registro/confirm', {
      method: 'POST',
      body: JSON.stringify(acuerdoData),
    }),
};

