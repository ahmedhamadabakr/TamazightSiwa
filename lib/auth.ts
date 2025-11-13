// Import NextAuth types
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import { getMongoClient } from '@/lib/mongodb';
import { database } from '@/lib/models';
import { comparePassword } from '@/lib/security/password';

export const authOptions = {
  adapter: MongoDBAdapter(getMongoClient() as any),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const email = String(credentials.email).trim().toLowerCase();
        const password = String(credentials.password);
        const user = await database.findUserByEmail(email);
        if (!user) return null;
        if (!user.isActive) {
          throw new Error('Your account is not activated. Please check your email.');
        }
        const ok = await comparePassword(password, (user as any).password);
        if (!ok) return null;
        return {
          id: (user as any)._id?.toString(),
          name: user.name,
          email: user.email,
          role: (user as any).role,
          image: (user as any).image,
          fullName: (user as any).fullName,
        } as any;
      }
    }),
   
  ],

  pages: {
    signIn: '/login',
    error: '/login',
  },

  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  callbacks: {
    async jwt({ token, user, account }: any) {
      // On initial sign-in, attach user data to token
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.fullName = user.fullName;
        token.tokenId = crypto.randomUUID();

        // Create session in background (non-blocking for faster login)
        const now = new Date();
        const exp = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
        database.createCustomSession({
          userId: String(token.id),
          provider: account?.provider || 'credentials',
          tokenId: token.tokenId,
          issuedAt: now,
          expiresAt: exp,
          userAgent: null,
          ip: null,
        }).catch(() => {
          // Silently fail - don't block login
        });
      }
      return token;
    },
    async session({ session, token }: any) {
      // Attach token data to session (fast - no DB call)
      if (token && session.user) {
        (session.user as any).id = token.id || token.sub;
        (session.user as any).role = token.role;
        (session.user as any).fullName = token.fullName;
      }
      return session;
    },

    async redirect({ url, baseUrl }: any) {

      if (url.startsWith('/')) {
        return `${baseUrl}${url}`;
      }
      else if (new URL(url).origin === baseUrl) {
        return url;
      }
      return baseUrl;
    }
  },

  events: {
    async signOut({ token }: any) {
      // Clean up sessions in background (non-blocking)
      if (token?.id) {
        database.deleteCustomSessionsByUser(String(token.id)).catch(() => {
          // Silently fail - don't block logout
        });
      }
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
};

if (!process.env.NEXTAUTH_SECRET) {
  console.warn('Warning: NEXTAUTH_SECRET is not defined');
}

export async function getAuthOptions() {
  return authOptions;
}
