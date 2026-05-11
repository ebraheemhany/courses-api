const passport = require("passport");
const { Strategy: GoogleStrategy } = require("passport-google-oauth20");
const userRepo = require("../user.module/user.Repo");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      proxy: true,
      scope: ["profile", "email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails[0].value;

        // 1. نشوف لو الـ user موجود
        let user = await userRepo.findByEmail(email);

        if (user) {
          // موجود — نرجعه
          return done(null, user);
        }

        // 2. مش موجود — ننشئه
        user = await userRepo.create({
          name: profile.displayName,
          email,
          googleId: profile.id,
          isVerified: true, // Google بتتحقق من الإيميل تلقائياً ✅
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    },
  ),
);

module.exports = passport;
