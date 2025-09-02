import Head from "next/head";
import type { PropsWithChildren } from "react";

import Navigation from "./Navigation";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Head>
        <title>T3 - App Exploration</title>
        <meta name="description" content="T3 - App Exploration" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/api/og" />
      </Head>
      <main className="mx-auto flex h-svh flex-col-reverse md:container md:flex-row">
        <Navigation />
        <div className="flex h-screen grow flex-col overflow-y-auto border-r border-zinc-100 dark:border-zinc-800">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
