import { useUser } from "@clerk/nextjs";
import type { NextPage } from "next";
import Image from "next/image";
import { useState } from "react";

import Feed from "~/components/Feed";
import Header from "~/components/Header";
import { api } from "~/utils/api";

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
    (error.data?.zodError?.fieldErrors?.content?.[0] ??
      "An error ocurred, try again later");

  if (!user) return null;

  const onPost: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    mutate({ content });
  };

  return (
    <div className="flex items-start gap-4 border-b border-zinc-100 p-4 transition-colors has-focus-within:bg-zinc-50 dark:border-zinc-800 dark:has-focus-within:bg-zinc-900">
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
          className="h-12 border-b border-zinc-100 text-xl outline-none dark:border-zinc-800"
        />
        <div className="flex w-full items-center">
          {errorMessage && <p className="text-red-700">{errorMessage}</p>}
          <button
            type="submit"
            disabled={isPending || content.length === 0}
            className="ml-auto cursor-pointer rounded-full bg-zinc-900 px-4 py-2 font-bold text-white transition-all hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-black"
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

const HomePage: NextPage = () => {
  const posts = api.post.getAll.useQuery();

  return (
    <>
      <Header>Posts</Header>
      <CreatePost />
      <Feed posts={posts.data} isLoading={posts.isLoading} />
    </>
  );
};

export default HomePage;
