const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/User');

const opts = {};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here';

module.exports = (passport) => {
  // Local Strategy for Login
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          const user = await User.findOne({ email });

          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }

          const isMatch = await user.matchPassword(password);
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: 'Invalid credentials' });
          }
        } catch (err) {
          return done(err, false);
        }
      }
    )
  );

  // JWT Strategy for protected routes
  passport.use(
    new JwtStrategy(opts, async (jwt_payload, done) => {
      try {
        const user = await User.findById(jwt_payload.id).select('-password');

        if (user) {
          return done(null, user);
        }
        return done(null, false);
      } catch (err) {
        return done(err, false);
      }
    })
  );
};
