// Usar variable de entorno en producción, localhost en desarrollo
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
    (import.meta.env.PROD ? '/api' : 'http://localhost:3300/api');

/**
 * Verificar estado de autenticación
 */
export const verificarAutenticacion = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/status`, {
      method: 'GET',
      credentials: 'include' // Incluir cookies
    });

    if (!response.ok) {
      return { autenticado: false, usuario: null };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al verificar autenticación:', error);
    return { autenticado: false, usuario: null };
  }
};

/**
 * Obtener información del usuario actual
 */
export const obtenerUsuario = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      method: 'GET',
      credentials: 'include'
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.usuario;
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    return null;
  }
};

/**
 * Cerrar sesión
 */
export const cerrarSesion = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Error al cerrar sesión');
    }

    return await response.json();
  } catch (error) {
    console.error('Error al cerrar sesión:', error);
    throw error;
  }
};

/**
 * Consultar acuerdos usando el endpoint de consulta
 */
export const consultarAPI = async (prompt) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/consulta`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies para autenticación
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `Error del servidor: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en consultarAPI:', error);
    
    // Mensajes de error más específicos
    if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
      throw new Error('No se pudo conectar con el servidor. Asegúrate de que el backend esté corriendo en http://localhost:3000');
    }
    
    throw error;
  }
};

/**
 * Preview de registro - convertir texto a JSON
 */
export const previewRegistroAPI = async (text) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/registro/preview`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en previewRegistroAPI:', error);
    throw error;
  }
};

/**
 * Confirmar y guardar acuerdo
 */
export const confirmRegistroAPI = async (acuerdoData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/chat/registro/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(acuerdoData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `Error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error en confirmRegistroAPI:', error);
    throw error;
  }
};
