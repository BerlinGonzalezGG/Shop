import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import EmailProvider from "next-auth/providers/email";
import { clientPromise } from "@/lib/db";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import User from "@/lib/models/user";
import { connectDB } from "@/lib/mongo";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_ID,
      clientSecret: process.env.DISCORD_SECRET,
      allowDangerousEmailAccountLinking: true
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: process.env.EMAIL_SERVER_PORT,
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      allowDangerousEmailAccountLinking: true
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async session({ session }) {
      if (session) {
        try {
          await connectDB();

          let dbUser = await User.findOne({ email: session.user.email });
          if (!dbUser) {
            const role =
              session.user.email === process.env.ADMIN_EMAIL ? "admin" : "user";
            dbUser = new User({ email: session.user.email, role, balance: 0 });
            await dbUser.save();
          }

          session.user.role = dbUser.role;
          session.user.balance = dbUser.balance;
          return session;
        } catch (error) {
          console.error("Error connecting to database:", error);
          return session; // Return session without role and balance on error
        }
      }
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
