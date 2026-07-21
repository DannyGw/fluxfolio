import { Request, Response } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "../index";
import { generateToken } from "./auth";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const BACKEND_URL = process.env.BACKEND_URL || "https://fluxfolio-production.up.railway.app";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      callbackURL: `${BACKEND_URL}/api/auth/google/callback`,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email returned from Google"));
        }

        // Find user by Google ID or email, create if doesn't exist
        let user = await prisma.user.findFirst({
          where: {
            OR: [{ googleId: profile.id }, { email }],
          },
        });

        if (user) {
          // Link Google ID to existing user
          if (!user.googleId) {
            user = await prisma.user.update({
              where: { id: user.id },
              data: { googleId: profile.id },
            });
          }
        } else {
          // Create new user
          user = await prisma.user.create({
            data: {
              email,
              name: profile.displayName,
              googleId: profile.id,
            },
          });
        }

        done(null, user);
      } catch (error) {
        done(error as Error);
      }
    }
  )
);

export function initPassport(app: any) {
  app.use(passport.initialize());

  // Google OAuth login route
  app.get(
    "/api/auth/google",
    passport.authenticate("google", {
      scope: ["profile", "email"],
      session: false,
    })
  );

  // Google OAuth callback
  app.get(
    "/api/auth/google/callback",
    passport.authenticate("google", { session: false, failureRedirect: `${FRONTEND_URL}/admin/login?error=google_auth_failed` }),
    (req: Request, res: Response) => {
      const user = req.user as any;
      const token = generateToken(user.id);
      res.redirect(`${FRONTEND_URL}/admin/login?token=${token}`);
    }
  );
}
