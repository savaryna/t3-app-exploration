import type { GetStaticProps, NextPage } from "next";
import Head from "next/head";

import { Post } from "~/components/Feed";
import Header from "~/components/Header";
import { createSsgHelper } from "~/server/utils/ssgHelper";
import { api } from "~/utils/api";

const PostPage: NextPage<{ id: string }> = ({ id }) => {
  const post = api.post.getById.useQuery({ id });
  if (!post.data)
    return <div className="flex justify-center p-6">Something went wrong</div>;

  return (
    <>
      <Head>
        <title>T3 - Post</title>
      </Head>
      <Header showBackButton>Post</Header>
      <Post {...post.data} />
    </>
  );
};

export default PostPage;

export const getStaticProps: GetStaticProps = async ({ params }) => {
  if (typeof params?.id !== "string") throw new Error("No id found");

  const ssgHelper = createSsgHelper();
  await ssgHelper.post.getById.prefetch({ id: params.id });

  return {
    props: {
      trpcState: ssgHelper.dehydrate(),
      id: params.id,
    },
  };
};

export const getStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};
