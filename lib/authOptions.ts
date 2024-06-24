import { NextAuthOptions } from "next-auth";
import axios from "axios";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials, req) {
        try {
          const response = await axios.post('http://localhost:8000/api/auth/login', {
            email: credentials?.email,
            password: credentials?.password,
          });

          const user = response.data;

          if (user) {
            // If login is successful and the user is returned
            return {
              id: user.id,
              email: user.email,
              name: user.name, // Assuming your backend returns the user's name
            };
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authentication", error);
          return null;
        }
        // const client = await clientPromise;
        // const db = client.db() as any;

        // const user = await db
        //   .collection("users")
        //   .findOne({ email: credentials?.email });

        // const bcrypt = require("bcrypt");

        // const passwordCorrect = await bcrypt.compare(
        //   credentials?.password,
        //   user?.password
        // );

        // if (passwordCorrect) {
        //   return {
        //     id: user?._id,
        //     email: user?.email,
        //   };
        // }

        // console.log("credentials", credentials);
        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ user, token, trigger, session }) => {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }
      return { ...token, ...user };
    },
  },
};
