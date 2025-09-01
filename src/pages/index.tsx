import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { SignInButton, SignOutButton, useUser } from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import Image from "next/image";

import { api, type RouterOutputs } from "~/utils/api";
import Loading from "~/components/loading";
import { useState } from "react";

dayjs.extend(relativeTime);

const CreatePost = () => {
  const [content, setContent] = useState("");
  const { user } = useUser();
  const utils = api.useUtils();

  const { mutate, isPending, error } = api.post.create.useMutation({
    onSuccess: () => {
      setContent("");
      void utils.post.getAll.invalidate();
    },
  });

  const errorMessage =
    error &&
    (error.data?.zodError?.fieldErrors?.content?.[0] ||
      "An error ocurred, try again later");

  if (!user) return null;

  const onPost: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    mutate({ content });
  };

  return (
    <div className="flex items-start gap-4 border-b border-zinc-100 p-4 transition-colors has-focus-within:bg-zinc-50">
      <Image
        src={user.imageUrl}
        alt="Profile image"
        width={48}
        height={48}
        className="h-12 shrink-0 rounded-full"
      />
      <form className="flex grow flex-col gap-4" onSubmit={onPost}>
        <input
          type="text"
          name="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isPending}
          placeholder="What's happening?"
          className="h-12 border-b border-zinc-100 text-xl outline-none focus:border-zinc-900"
        />
        <div className="flex w-full items-center">
          {errorMessage && <p className="text-red-700">{errorMessage}</p>}
          <button
            type="submit"
            disabled={isPending || content.length === 0}
            className="ml-auto cursor-pointer rounded-full bg-zinc-900 px-4 py-2 font-bold text-white transition-colors hover:bg-zinc-700 disabled:cursor-not-allowed disabled:bg-zinc-400"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

type PostWithAuthor = RouterOutputs["post"]["getAll"][number];

const PostView = ({ post, author }: PostWithAuthor) => {
  return (
    <div className="flex items-start gap-4">
      <Image
        src={author.imageUrl}
        alt="Profile image"
        width={48}
        height={48}
        className="h-12 shrink-0 rounded-full"
      />
      <div className="flex grow flex-col">
        <div className="flex gap-2">
          <p className="font-bold">{author.fullName}</p>
          <p className="font-normal text-zinc-500">
            <span>@{author.username}</span>
            <span> • </span>
            <span>{dayjs(post.createdAt).fromNow()}</span>
          </p>
        </div>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

const Feed = () => {
  const { data, isLoading } = api.post.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center p-6">
        <Loading />
      </div>
    );
  }

  if (!data) return <div>Something went wrong</div>;

  return (
    <ul className="flex flex-col">
      {data.map(({ post, author }) => (
        <li
          key={post.id}
          className="flex flex-col border-b border-zinc-100 p-4"
        >
          <PostView post={post} author={author} />
        </li>
      ))}
    </ul>
  );
};

export default function Home() {
  const { user } = useUser();

  return (
    <>
      <Head>
        <title>T3 - App Exploration</title>
        <meta name="description" content="T3 App Exploration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid h-screen grid-cols-4">
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
          <Link
            href="/"
            className="flex items-center gap-5 rounded-full p-3 text-xl font-bold hover:bg-zinc-100"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
            >
              <path fill="currentColor" d="M4 21V9l8-6l8 6v12h-6v-7h-4v7z" />
            </svg>
            <span>Home</span>
          </Link>
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
          <div className="sticky top-0 flex h-14 flex-shrink-0 items-center border-b border-zinc-100 bg-white/20 px-6 backdrop-blur-md">
            <p className="font-bold">Posts</p>
          </div>
          <CreatePost />
          <Feed />
        </div>
      </main>
    </>
  );
}
