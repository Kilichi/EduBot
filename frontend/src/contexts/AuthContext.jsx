import { createContext, useContext, useState, useEffect } from 'react';
import { verificarAutenticacion, cerrarSesion as cerrarSesionAPI, iniciarSesion as iniciarSesionAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [autenticado, setAutenticado] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    verificarEstadoAutenticacion();
  }, []);

  const verificarEstadoAutenticacion = async () => {
    try {
      setCargando(true);
      const resultado = await verificarAutenticacion();
      setAutenticado(resultado.autenticado);
      setUsuario(resultado.usuario || null);
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      setAutenticado(false);
      setUsuario(null);
    } finally {
      setCargando(false);
    }
  };

  const cerrarSesion = async () => {
    try {
      await cerrarSesionAPI();
      setAutenticado(false);
      setUsuario(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  const login = async (usuario, password) => {
    const resultado = await iniciarSesionAPI(usuario, password);
    setAutenticado(resultado.autenticado);
    setUsuario(resultado.usuario || null);
  };

  const actualizarUsuario = (nuevoUsuario) => {
    setUsuario(nuevoUsuario);
    setAutenticado(!!nuevoUsuario);
  };

  const value = {
    usuario,
    autenticado,
    cargando,
    login,
    cerrarSesion,
    actualizarUsuario,
    verificarEstadoAutenticacion
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
