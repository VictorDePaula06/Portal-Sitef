import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Acesso Corporativo",
      credentials: {
        email: { label: "E-mail", type: "email" },
        password: { label: "Senha", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        if (!credentials.email.toLowerCase().endsWith("@globaltera.com.br")) {
          throw new Error("Acesso negado. Utilize seu e-mail @globaltera.com.br");
        }

        if (credentials.password !== "Global@2026") {
          throw new Error("Senha corporativa incorreta.");
        }

        return { id: "1", name: credentials.email.split('@')[0], email: credentials.email };
      }
    })
  ],
  pages: {
    signIn: '/login',
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "chave-secreta-provisoria-para-desenvolvimento"
});

export { handler as GET, handler as POST };
