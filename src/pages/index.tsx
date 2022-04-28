/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import { GetStaticProps } from 'next';
import { stripe } from '../services/stripe';
import { SubscribeButton } from '../components/SubscribeButton';
import styles from './home.module.scss';
import { motion } from 'framer-motion';

const variantsLeft = {
  hidden: {
    y: -50,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
  },
};

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  };
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news</title>
      </Head>

      <main className={styles.contentContainer}>
        <motion.section
          variants={variantsLeft}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.5, delay: 0.3 }}
          className={styles.hero}
        >
          <span className={styles.icon}>👋 Hey, welcome</span>
          <h1>
            News about <br /> the <span>React</span> world.
          </h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>

          <SubscribeButton />
        </motion.section>

        <motion.img
          variants={variantsLeft}
          initial='hidden'
          animate='visible'
          transition={{ duration: 0.5, delay: 0.5 }}
          height='520px'
          width='334px'
          src='/images/avatar.svg'
          alt='Girl coding'
        />
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KpEILC8HRYGB2HdMjaYqOpF');

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  };

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, // ! 24 HOURS
  };
};
