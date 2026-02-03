import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import Usuario from '../models/usuario.model.js';
import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, API_BASE_URL } from './env.js';

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

// Configurar estrategia de Google OAuth
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: `${API_BASE_URL}/api/auth/google/callback`
}, async (accessToken, refreshToken, profile, done) => {
    try {
        // Buscar usuario existente por googleId
        let usuario = await Usuario.findOne({ googleId: profile.id });

        if (usuario) {
            // Usuario existente - actualizar último acceso
            usuario.ultimoAcceso = new Date();
            usuario.esNuevo = false;
            await usuario.save();
            return done(null, usuario);
        }

        // Usuario nuevo - crear en la base de datos
        usuario = await Usuario.create({
            googleId: profile.id,
            email: profile.emails[0].value,
            nombre: profile.name.givenName,
            apellido: profile.name.familyName || '',
            foto: profile.photos[0]?.value || null,
            esNuevo: true,
            activo: true,
            rol: 'usuario',
            ultimoAcceso: new Date()
        });

        return done(null, usuario);
    } catch (error) {
        console.error('Error en estrategia de Google:', error);
        return done(error, null);
    }
}));

export default passport;
