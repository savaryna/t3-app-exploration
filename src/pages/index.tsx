import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/nextjs";
import Head from "next/head";
import Link from "next/link";
import { api, type RouterOutputs } from "~/utils/api";

const CreatePost = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex items-start gap-4 border-b border-zinc-100 p-4">
      <img
        src={user.imageUrl}
        alt="Profile image"
        className="h-12 shrink-0 rounded-full"
      />
      <div className="flex grow flex-col gap-4">
        <input
          type="text"
          name="post"
          placeholder="What's happening?"
          className="h-12 border-b border-zinc-100 text-xl"
        />
        <button
          type="button"
          className="self-end rounded-full bg-zinc-900 px-4 py-2 font-bold text-white"
        >
          Post
        </button>
      </div>
    </div>
  );
};

type PostWithAuthor = RouterOutputs["post"]["getAll"][number];

const PostView = ({ post, author }: PostWithAuthor) => {
  return (
    <div className="flex items-start gap-4">
      <img
        src={author.imageUrl}
        alt="Profile image"
        className="h-12 shrink-0 rounded-full"
      />
      <div className="flex grow flex-col">
        <div className="flex gap-2">
          <p className="font-bold">{author.fullName}</p>
          <p className="font-normal text-zinc-500">
            <span>@{author.username}</span>
            <span> • </span>
            <span>{post.createdAt.toDateString()}</span>
          </p>
        </div>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export default function Home() {
  const posts = api.post.getAll.useQuery();

  return (
    <>
      <Head>
        <title>T3 - App Exploration</title>
        <meta name="description" content="T3 App Exploration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="grid h-screen grid-cols-4">
        <aside className="flex flex-col gap-4 border-r border-zinc-100 px-6">
          <div className="flex h-14 items-center justify-between">
            <Link href="/" className="text-3xl font-bold">
              T3
            </Link>
            <SignedOut>
              <SignInButton />
            </SignedOut>
            <SignedIn>
              <UserButton showName />
            </SignedIn>
          </div>
          <Link href="/" className="text-xl">
            Home
          </Link>
        </aside>
        <div className="col-span-3 flex h-screen flex-col overflow-y-auto border-r border-zinc-100">
          <div className="sticky top-0 flex h-14 flex-shrink-0 items-center border-b border-zinc-100 bg-white/20 px-6 backdrop-blur-md">
            <p className="font-bold">Posts</p>
          </div>
          <CreatePost />
          <div>
            <ul className="flex flex-col">
              {posts.data?.map(({ post, author }) => (
                <li
                  key={post.id}
                  className="flex flex-col border-b border-zinc-100 p-4"
                >
                  <PostView post={post} author={author} />
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </>
  );
}
