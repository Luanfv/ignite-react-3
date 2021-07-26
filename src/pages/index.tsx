/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { useState, useCallback } from 'react';
import { GetStaticProps } from 'next';
import Prismic from '@prismicio/client';
import { FiCalendar, FiUser } from 'react-icons/fi';
import { format } from 'date-fns';
import Link from 'next/link';

import { ptBR } from 'date-fns/locale';
import { getPrismicClient } from '../services/prismic';

import commonStyles from '../styles/common.module.scss';
import styles from './home.module.scss';

import Header from '../components/Header';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps) {
  const [posts, setPosts] = useState<Post[]>(postsPagination.results);
  const [nextPage, setNextPage] = useState<string | null>(
    postsPagination.next_page
  );

  const handleNextPage = useCallback(() => {
    if (nextPage) {
      fetch(nextPage)
        .then(response => response.json())
        .then(newPosts => {
          setNextPage(newPosts.next_page);
          setPosts([...posts, ...newPosts.results]);
        });
    }
  }, [posts, nextPage]);

  return (
    <>
      <Header title="posts | spacetraveling" />

      <main className={commonStyles.container}>
        <section>
          {posts.map(post => {
            return (
              <Link key={post.uid} href={`/post/${post.uid}`}>
                <a className={styles.post}>
                  <h1>{post.data.title}</h1>

                  <p>{post.data.subtitle}</p>

                  <div>
                    <div>
                      <FiCalendar />
                      <time>
                        {format(
                          new Date(post.first_publication_date),
                          'dd MMM yyyy',
                          {
                            locale: ptBR,
                          }
                        )}
                      </time>
                    </div>

                    <div>
                      <FiUser />
                      <span>{post.data.author}</span>
                    </div>
                  </div>
                </a>
              </Link>
            );
          })}
        </section>

        {nextPage && (
          <div>
            <button
              className={styles.morePosts}
              type="button"
              onClick={handleNextPage}
            >
              Carregar mais posts
            </button>
          </div>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const prismic = getPrismicClient();

  const postsResponse = await prismic.query(
    [Prismic.predicates.at('document.type', 'posts')],

    {
      pageSize: 1,
    }
  );

  return {
    props: {
      postsPagination: {
        next_page: postsResponse.next_page,
        results: postsResponse.results,
      },
    },
  };
};
