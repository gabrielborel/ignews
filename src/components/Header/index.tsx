import Link from 'next/link';

import { motion } from 'framer-motion';
import { SignInButton } from './SignInButton';
import styles from './styles.module.scss';
import { ActiveLink } from './ActiveLink';
import Image from 'next/image';

const container = {
  hidden: { y: -80 },
  visible: { y: 0 },
};

export const Header = () => {
  return (
    <motion.header
      variants={container}
      initial='hidden'
      animate='visible'
      transition={{ duration: 0.5, delay: 0.1 }}
      className={styles.headerContainer}
    >
      <div className={styles.headerContent}>
        <Image width='108px' height='34px' src='/images/logo.svg' alt='Logo ig.news' />

        <nav>
          <ActiveLink activeClassName={styles.active} href='/'>
            <a>Home</a>
          </ActiveLink>
          <ActiveLink activeClassName={styles.active} href='/posts'>
            <a>Posts</a>
          </ActiveLink>
        </nav>

        <SignInButton />
      </div>
    </motion.header>
  );
};
