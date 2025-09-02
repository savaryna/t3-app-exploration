import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

import Feed from "~/components/Feed";
import Header from "~/components/Header";
import { createSsgHelper } from "~/server/utils/ssgHelper";
import { api } from "~/utils/api";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const author = api.profile.getByUsername.useQuery({ username });

  if (!author.data)
    return <div className="flex justify-center p-6">Something went wrong</div>;

  const posts = api.post.getByAuthorId.useQuery({ authorId: author.data.id });

  return (
    <>
      <Head>
        <title>T3 - Profile</title>
      </Head>

      <Header showBackButton>Profile</Header>

      <div className="block h-48 w-full shrink-0 bg-gradient-to-t from-zinc-50 to-zinc-100"></div>

      <div className="-mt-16 border-b border-zinc-100 px-6 pb-6">
        <Image
          src={author.data.imageUrl}
          alt="Profile image"
          width={128}
          height={128}
          className="h-32 shrink-0 rounded-full border-2 border-zinc-100"
        />
        <p className="text-xl font-bold">{author.data.fullName}</p>
        <p className="text-zinc-500">@{author.data.username}</p>
      </div>
      <Feed posts={posts.data} isLoading={posts.isLoading} />
    </>
  );
};

export default ProfilePage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (typeof params?.username !== "string")
    throw new Error("No username found");

  const ssgHelper = createSsgHelper();
  await ssgHelper.profile.getByUsername.prefetch({ username: params.username });

  return {
    props: {
      trpcState: ssgHelper.dehydrate(),
      username: params.username,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
