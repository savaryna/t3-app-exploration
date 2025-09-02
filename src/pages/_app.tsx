import { ClerkProvider } from "@clerk/nextjs";
import { type AppType } from "next/app";
import { Geist } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";

import Layout from "~/components/Layout";

const geist = Geist({
  subsets: ["latin"],
});

const MyApp: AppType = ({ Component, pageProps }) => {
  return (
    <ClerkProvider>
      <Layout>
        <Component {...pageProps} className={geist.className} />
      </Layout>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
