import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import type { PropsWithChildren } from "react";

import NavLink from "./NavLink";

const Layout = ({ children }: PropsWithChildren) => {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>T3 - App Exploration</title>
        <meta name="description" content="T3 - App Exploration" />
        <link rel="icon" href="/favicon.ico" />
        <meta property="og:image" content="/api/og" />
      </Head>

      <main className={`container mx-auto grid h-screen grid-cols-4`}>
        <aside className="flex flex-col border-r border-zinc-100 px-3">
          <div className="flex h-14 items-center justify-between">
            <Link
              href="/"
              className="rounded-full p-3 text-xl font-black hover:bg-zinc-100"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
              >
                <path
                  fill="currentColor"
                  d="M5.5 12.4L1.6 8.5l3.9-3.9l3.9 3.9zM9 22v-5q-1.525-.125-3.025-.363T3 16l.5-2q2.1.575 4.213.788T12 15t4.288-.213T20.5 14l.5 2q-1.475.4-2.975.638T15 17v5zM5.5 9.6l1.1-1.1l-1.1-1.1l-1.1 1.1zM12 7q-1.25 0-2.125-.875T9 4t.875-2.125T12 1t2.125.875T15 4t-.875 2.125T12 7m0 7q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14m0-9q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5m5.05 7l-1.7-3l1.7-3h3.4l1.7 3l-1.7 3zm1.15-2h1.1l.55-1l-.55-1h-1.1l-.55 1zm.55-1"
                />
              </svg>
            </Link>
          </div>
          <NavLink href="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M4 21V9l8-6l8 6v12h-6v-7h-4v7z" />
            </svg>
            <span>Home</span>
          </NavLink>
          <NavLink href="https://github.com/savaryna/t3-app-exploration">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path
                fill="currentColor"
                d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"
              />
            </svg>
            <span>Source code</span>
          </NavLink>
          {user ? (
            <SignOutButton>
              <button className="mt-auto mb-3 flex items-center gap-5 rounded-full p-3 transition-colors hover:cursor-pointer hover:bg-zinc-100">
                <Image
                  src={user.imageUrl}
                  alt="Profile image"
                  width={48}
                  height={48}
                  className="h-12 shrink-0 rounded-full"
                />
                <div className="mr-auto">
                  <div className="font-bold">{user.fullName}</div>
                  <div className="text-zinc-500">@{user.username}</div>
                </div>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h7v2H5v14h7v2zm11-4l-1.375-1.45l2.55-2.55H9v-2h8.175l-2.55-2.55L16 7l5 5z"
                  />
                </svg>
              </button>
            </SignOutButton>
          ) : (
            <SignInButton>
              <button className="mt-auto mb-3 flex items-center gap-5 rounded-full p-3 transition-colors hover:cursor-pointer hover:bg-zinc-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="32"
                  height="32"
                  viewBox="0 0 24 24"
                >
                  <path
                    fill="currentColor"
                    d="M12 21v-2h7V5h-7V3h7q.825 0 1.413.588T21 5v14q0 .825-.587 1.413T19 21zm-2-4l-1.375-1.45l2.55-2.55H3v-2h8.175l-2.55-2.55L10 7l5 5z"
                  />
                </svg>
                <span className="text-xl">Sign in</span>
              </button>
            </SignInButton>
          )}
        </aside>
        <div className="col-span-3 flex h-screen flex-col overflow-y-auto border-r border-zinc-100">
          {children}
        </div>
      </main>
    </>
  );
};

export default Layout;
