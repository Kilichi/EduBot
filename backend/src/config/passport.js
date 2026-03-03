import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import Usuario from '../models/usuario.model.js';

// Serializar usuario para la sesión
passport.serializeUser((user, done) => {
    done(null, user._id);
});

// Deserializar usuario desde la sesión
passport.deserializeUser(async (id, done) => {
    try {
        const user = await Usuario.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Estrategia local: usuario + contraseña
passport.use(new LocalStrategy(
    {
        usernameField: 'usuario',
        passwordField: 'password',
        passReqToCallback: false
    },
    async (usuario, password, done) => {
        try {
            const user = await Usuario.findOne({ usuario: usuario.toLowerCase(), activo: true })
                .select('+password');
            if (!user) {
                return done(null, false, { message: 'Usuario o contraseña incorrectos' });
            }
            const ok = await user.compararPassword(password);
            if (!ok) {
                return done(null, false, { message: 'Usuario o contraseña incorrectos' });
            }
            user.ultimoAcceso = new Date();
            user.esNuevo = false;
            await user.save({ validateBeforeSave: false });
            // No devolver password en el objeto de sesión
            const userPojo = user.toObject();
            delete userPojo.password;
            return done(null, userPojo);
        } catch (error) {
            console.error('Error en login local:', error);
            return done(error, null);
        }
    }
));

export default passport;
