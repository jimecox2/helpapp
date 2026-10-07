import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import FacebookProvider from "next-auth/providers/facebook";
import axios from 'axios';
const axiosInstance = axios.create({
  withCredentials: true
});

import { API_URL, WWW_URL } from '@/config/site';

async function checkUserInStrapi(email, password) {
  try {
    // Make a request to Strapi to check if the user exists
    const res = await axiosInstance.post(`${API_URL}/auth/local`, {
      identifier: email,
      password: password //'placeholderPassword', // Password will be irrelevant for OAuth
    });
    const user = {
      id: res.data.user.id,
      username: res.data.user.username,
      email: res.data.user.email
    };
    const jwt = res.data.jwt;
    return { user, jwt };

  } catch (error) {
    // Handle specific error response from Strapi
    if (error.response && error.response.status === 400) {
      const strapiErrorMessage = error.response.data?.error?.message || "An unknown error occurred.";
      console.log("Strapi error checkUserInStrapi: ", strapiErrorMessage);
      return null;
    } else {
      // do not throw errors, next auth handles this;
      return null;
    }
  }
}

async function registerUserInStrapi(username, email, password) {
  try {
    // Create the user in Strapi
    const res = await axiosInstance.post(`${API_URL}/auth/local/register`, {
      username,
      email,
      password,
    });
    // Set the user as confirmed because Oauth, there is no email confirmn using the admin token
    await axiosInstance.put(`${API_URL}/users/${res.data.user.id}`, {
      confirmed: true,
    }, {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_ADMIN_TOKEN}`,
      },
    });

    // return user object
    return {
      user: {
        id: res.data.user.id,
        username: res.data.user.username,
        email: res.data.user.email
      },
      jwt: res.data.jwt
    };
  } catch (error) {
    return null;
  }
}

const secureCookies = process.env.NODE_ENV === 'production';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },

      async authorize(credentials) {
        try {
          // console.log("Attempting login with email:", credentials.email);
          // Make a request to Strapi to check if the user exists
          const res = await axiosInstance.post(`${API_URL}/auth/local`, {
            identifier: credentials.email,
            password: credentials.password,
          });
          const user = res.data.user;
          const jwt = res.data.jwt;
          //    console.log("Strapi response:", res.data);
          // If the user exists and the request was successful, return the user object
          //   return { ...user, jwt };
          return {
            id: user.id,
            name: user.username,
            email: user.email,
            jwt
          };

        } catch (error) {
          // Handle specific error response from Strapi
          if (error.response && error.response.status === 400) {
            const strapiErrorMessage = error.response.data?.error?.message || "An unknown error occurred";
            console.log("jauth custom error: ", strapiErrorMessage)
            // error message 1: Your account email is not confirmed
            // error message 2: Your account has been blocked by an administrator
            // error message 3: Invalid identifier or password
            //   throw new Error(strapiErrorMessage);
            //   throw new Error("FullError: " + error + "strapiErrorMessage " + strapiErrorMessage);
            return null;
          }
          // throw new Error("Top Level Error: ", error);
          return null;
        }
      }
      // end authorize
    }),
  ],

  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
    newUser: `${WWW_URL}/auth/new-user`, // registration lives on www
  },

  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {

    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.name = user.name || user.username; // Use username as fallback for credentials provider
        token.jwt = user.jwt;

        // Fetch customer_id and primary_role from Strapi User table
        try {
          const userResponse = await axiosInstance.get(`${API_URL}/users/${user.id}`, {
            headers: {
              Authorization: `Bearer ${user.jwt}`,
            },
          });

          // Add RBAC fields to token
          token.customer_id = userResponse.data.customer_id || null;
          token.primary_role = userResponse.data.primary_role || null;

        } catch (error) {
          console.error('Error fetching RBAC fields from Strapi:', error.message);
          token.customer_id = null;
          token.primary_role = null;
        }
      }
      return token;
    },

    async session({ session, token }) {
      session.user.id = token.id;
      session.user.name = token.name;
      session.jwt = token.jwt;

      // Add RBAC fields to session
      session.user.customer_id = token.customer_id;
      session.user.primary_role = token.primary_role;

      return session;
    },

    async signIn({ user, account }) {
      // List of supported OAuth providers
      const oauthProviders = ["github", "google", "facebook", "microsoft"];
      console.log("account.provider ", JSON.stringify(account.provider))
      if (oauthProviders.includes(account.provider)) {
        const username = user.name || user.email.split('@')[0]; // Generate a username
        const email = user.email;
        const password = 'someRandomPassword'; // handle securely - esed to create user

        try {
          // Check if the user exists in Strapi
          const existingUser = await checkUserInStrapi(email, password);

          if (existingUser) {
            // User exists, update user object with Strapi information
            user.id = existingUser.user.id;
            user.name = existingUser.user.username + "-" + account.provider;
            user.jwt = existingUser.jwt;
            return true

          } else {
            // User does not exist, create a new user in Strapi
            const username_provider = username + "-" + account.provider
            const newUser = await registerUserInStrapi(username_provider, email, password);

            if (newUser) {
              // Update user object with new Strapi information
              user.id = newUser.user.id;
              user.name = newUser.user.username + "-" + account.provider;
              user.jwt = newUser.jwt;
              return true
            }
          }

        } catch (error) {
          console.error(`Error during ${account.provider} OAuth login:`, error);
          return false; // Block sign in if there's an error
        }
      }
      return true; // Allow sign in for other providers
    },
  },
  // Own cookie names: this app keeps its own login (not shared with www), and on localhost
  // cookies are not split by port, so tbwww's cookies would otherwise collide with these.
  cookies: {
    sessionToken: {
      name: `${secureCookies ? '__Secure-' : ''}tbcloud.session-token`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: secureCookies },
    },
    callbackUrl: {
      name: `${secureCookies ? '__Secure-' : ''}tbcloud.callback-url`,
      options: { sameSite: 'lax', path: '/', secure: secureCookies },
    },
    csrfToken: {
      name: `${secureCookies ? '__Host-' : ''}tbcloud.csrf-token`,
      options: { httpOnly: true, sameSite: 'lax', path: '/', secure: secureCookies },
    },
  },
  trustHost: true
});
