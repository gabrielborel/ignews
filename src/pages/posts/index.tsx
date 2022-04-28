import Head from 'next/head';
import { GetStaticProps } from 'next';
import { client } from '../../services/prismic';
import { RichText } from 'prismic-dom';
import { motion } from 'framer-motion';

import styles from './styles.module.scss';
import Link from 'next/link';

const container = {
  hidden: { opacity: 1, scale: 0 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2,
    },
  },
};

const item = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
  },
};

type Post = {
  slug: string;
  title: string;
  excerpt: string;
  updatedAt: string;
};

interface PostsProps {
  posts: Post[];
}

export default function Posts({ posts }: PostsProps) {
  return (
    <>
      <Head>
        <title>Posts | Ignews</title>
      </Head>

      <main className={styles.container}>
        <motion.div
          variants={container}
          initial='hidden'
          animate='visible'
          className={styles.posts}
        >
          {posts.map(({ slug, updatedAt, title, excerpt }) => (
            <Link
              href={`/posts/${slug}`}
              key={slug}
              passHref
            >
              <motion.a variants={item}>
                <time>{updatedAt}</time>
                <strong>{title}</strong>
                <p>{excerpt}</p>
              </motion.a>
            </Link>
          ))}
        </motion.div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = client;

  const response = await prismic.getAllByType('post', {
    fetch: ['publication.title', 'publication.content'],
    pageSize: 100,
  });

  const posts = response.map((post) => {
    return {
      slug: post.uid,
      title: RichText.asText(post.data['Title']),
      excerpt:
        post.data['Content'].find((content: { type: string }) => content.type === 'paragraph')
          ?.text ?? '',
      updatedAt: new Date(post.last_publication_date).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      }),
    };
  });

  return {
    props: { posts },
  };
};
