import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";
import Link from "next/link";

import type { RouterOutputs } from "~/utils/api";

import Loading from "./Loading";

dayjs.extend(relativeTime);

export type PostProps = RouterOutputs["post"]["getAll"][number];

export const Post = (post: PostProps) => {
  return (
    <div className="relative flex items-start gap-4 border-b border-zinc-100 p-4 dark:border-zinc-800">
      <Link
        href={`/${post.author.username}/posts/${post.id}`}
        className="absolute inset-0"
      />
      <Image
        src={post.author.imageUrl}
        alt="Profile image"
        width={48}
        height={48}
        className="h-12 shrink-0 rounded-full"
      />
      <div className="flex grow flex-col">
        <Link
          href={`/${post.author.username}`}
          className="relative flex flex-wrap self-start"
        >
          <div className="pr-2 font-bold">{post.author.fullName}</div>
          <div className="font-normal text-zinc-500">
            <span>@{post.author.username}</span>
            <span> • </span>
            <span>{dayjs(post.createdAt).fromNow()}</span>
          </div>
        </Link>
        <p>{post.content}</p>
      </div>
    </div>
  );
};

export type FeedProps = {
  posts?: RouterOutputs["post"]["getAll"];
  isLoading: boolean;
};

const Feed = ({ posts, isLoading }: FeedProps) => {
  if (isLoading) {
    return <Loading />;
  }

  if (!posts)
    return <div className="flex justify-center p-6">Something went wrong</div>;

  return (
    <ul className="flex flex-col">
      {posts.map((post) => (
        <li key={post.id}>
          <Post {...post} />
        </li>
      ))}
    </ul>
  );
};

export default Feed;
