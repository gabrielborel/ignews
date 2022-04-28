import Head from 'next/head';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/react';
import { RichText } from 'prismic-dom';
import { client } from '../../services/prismic';
import styles from './post.module.scss';
import { motion } from 'framer-motion';

const variants = {
  hidden: {
    opacity: 0,
    y: -10,
  },
  visible: {
    opacity: 1,
    y: 10,
  },
};

interface PostProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function Post({ post }: PostProps) {
  return (
    <>
      <Head>
        <title>{post.title} | Ignews</title>
      </Head>

      <motion.main
        variants={variants}
        initial='hidden'
        animate='visible'
        transition={{ duration: 0.5 }}
        className={styles.container}
      >
        <article className={styles.post}>
          <h1>{post.title}</h1>
          <time>{post.updatedAt}</time>
          <div
            className={styles.postContent}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </motion.main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
  const session = await getSession({ req });
  const { slug } = params;

  const prismic = client;
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data['Title']),
    content: RichText.asHtml(response.data['Content']),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  if (!session?.activeSubscription) {
    return {
      redirect: {
        destination: `/posts/preview/${post.slug}`,
        permanent: false,
      },
    };
  }

  return {
    props: { post },
  };
};
