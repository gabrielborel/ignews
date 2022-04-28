import Head from 'next/head';
import { GetStaticPaths, GetStaticProps } from 'next';
import { useSession } from 'next-auth/react';
import { RichText } from 'prismic-dom';
import { client } from '../../../services/prismic';
import styles from '../post.module.scss';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/router';

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

interface PostPreviewProps {
  post: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  };
}

export default function PostPreview({ post }: PostPreviewProps) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${post.slug}`);
    }
  }, [post.slug, router, session]);

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href='/'>
              <a>Subscribe now 🤗</a>
            </Link>
          </div>
        </article>
      </motion.main>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = client;
  const response = await prismic.getByUID('post', String(slug), {});

  const post = {
    slug,
    title: RichText.asText(response.data['Title']),
    content: RichText.asHtml(response.data['Content'].splice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }),
  };

  return {
    props: { post },
    revalidate: 60 * 30, // ! 30 MINUTES
  };
};
