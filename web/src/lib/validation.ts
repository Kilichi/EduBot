export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const USUARIO_MIN = 3;
const USUARIO_MAX = 30;
const USUARIO_REGEX = /^[a-zA-Z0-9._-]+$/;

const PASSWORD_MIN = 8;
const PASSWORD_MAX = 128;

const NOMBRE_MIN = 2;
const NOMBRE_MAX = 60;
const NOMBRE_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]+$/;

export function validateUsuario(value: string): ValidationResult {
  const v = value.trim();
  const errors: string[] = [];

  if (!v) {
    errors.push('El usuario es obligatorio');
  } else {
    if (v.length < USUARIO_MIN) errors.push(`Mínimo ${USUARIO_MIN} caracteres`);
    if (v.length > USUARIO_MAX) errors.push(`Máximo ${USUARIO_MAX} caracteres`);
    if (!USUARIO_REGEX.test(v)) errors.push('Solo letras, números, puntos, guiones y guiones bajos');
  }

  return { valid: errors.length === 0, errors };
}

export function validatePassword(value: string): ValidationResult {
  const errors: string[] = [];

  if (!value) {
    errors.push('La contraseña es obligatoria');
  } else {
    if (value.length < PASSWORD_MIN) errors.push(`Mínimo ${PASSWORD_MIN} caracteres`);
    if (value.length > PASSWORD_MAX) errors.push(`Máximo ${PASSWORD_MAX} caracteres`);
    if (!/[A-Z]/.test(value)) errors.push('Al menos una letra mayúscula');
    if (!/[a-z]/.test(value)) errors.push('Al menos una letra minúscula');
    if (!/[0-9]/.test(value)) errors.push('Al menos un número');
  }

  return { valid: errors.length === 0, errors };
}

export function validateNombre(value: string): ValidationResult {
  const v = value.trim();
  const errors: string[] = [];

  if (!v) {
    errors.push('El nombre es obligatorio');
  } else {
    if (v.length < NOMBRE_MIN) errors.push(`Mínimo ${NOMBRE_MIN} caracteres`);
    if (v.length > NOMBRE_MAX) errors.push(`Máximo ${NOMBRE_MAX} caracteres`);
    if (!NOMBRE_REGEX.test(v)) errors.push('Solo letras y espacios');
  }

  return { valid: errors.length === 0, errors };
}

export function validateLoginForm(usuario: string, password: string) {
  const uErrors: string[] = [];
  const pErrors: string[] = [];

  if (!usuario.trim()) uErrors.push('El usuario es obligatorio');
  if (!password) pErrors.push('La contraseña es obligatoria');

  return {
    valid: uErrors.length === 0 && pErrors.length === 0,
    usuario: uErrors,
    password: pErrors,
  };
}

export function validateRegisterForm(usuario: string, password: string, nombre: string) {
  const u = validateUsuario(usuario);
  const p = validatePassword(password);
  const n = validateNombre(nombre);

  return {
    valid: u.valid && p.valid && n.valid,
    usuario: u.errors,
    password: p.errors,
    nombre: n.errors,
  };
}
