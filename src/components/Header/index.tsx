/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import Link from 'next/link';
import Head from 'next/head';

import styles from './styles.module.scss';

interface Header {
  title: string;
}

export default function Header({ title }: Header) {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>

      <header className={styles.container}>
        <div>
          <Link href="/">
            <a>
              <img src="/images/logo.svg" alt="logo" />
            </a>
          </Link>
        </div>
      </header>
    </>
  );
}
