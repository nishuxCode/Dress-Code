import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { connectDB } from "@/lib/mongodb";
import Student from "@/models/Student";
import bcrypt from "bcryptjs";
import type { JWT } from "next-auth/jwt";

/* =========================
   Extend JWT Type Locally
========================= */
interface CustomJWT extends JWT {
  id?: string;
  regNo?: string;
  year?: string;
  gender?: string;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email or Reg No", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        await connectDB();

        const student = await Student.findOne({
          $or: [
            { email: credentials.email },
            { regNo: credentials.email },
          ],
        });

        if (!student) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          student.password
        );

        if (!isPasswordValid) return null;

        return {
          id: student._id.toString(),
          name: student.name,
          email: student.email,
          regNo: student.regNo,
          year: student.year,
          gender: student.gender,
        };
      },
    }),
  ],

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  callbacks: {
    async jwt({ token, user }) {
      const customToken = token as CustomJWT;

      if (user) {
        customToken.id = user.id;
        customToken.regNo = (user as any).regNo;
        customToken.year = (user as any).year;
        customToken.gender = (user as any).gender;
      }

      return customToken;
    },

    async session({ session, token }) {
      const customToken = token as CustomJWT;

      if (session.user) {
        (session.user as any).id = customToken.id;
        (session.user as any).regNo = customToken.regNo;
        (session.user as any).year = customToken.year;
        (session.user as any).gender = customToken.gender;
      }

      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };