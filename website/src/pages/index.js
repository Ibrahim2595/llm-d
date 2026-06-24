import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';

import styles from './index.module.css';

/**
 * Landing page — placeholder hero. Swap the copy / add sections here without
 * touching the rest of the site.
 */
export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title="llm-d" description={siteConfig.tagline}>
      <main className={styles.hero}>
        <div className={styles.heroInner}>
          <p className={styles.wip}>🚧 Placeholder — this landing page is a work in progress</p>
          <img className={styles.logo} src="/img/llm-d-logotype-and-icon.svg" alt="llm-d" />
          <h1 className={styles.title}>
            The fastest path to state-of-the-art LLM inference on any accelerator
          </h1>

          <p className={styles.lede}>
            llm-d is an open-source inference stack for Kubernetes that turns
            single-node model servers like vLLM and SGLang into production-grade
            distributed serving — on the infrastructure you already run.
          </p>

          <div className={styles.buttons}>
            <Link className={clsx('button button--primary button--lg', styles.button)} to="/docs">
              Get Started
            </Link>
            <Link className={clsx('button button--secondary button--lg', styles.button)} to="/blog">
              Read the Blog
            </Link>
            <Link className={clsx('button button--secondary button--lg', styles.button)} to="/community">
              Join the Community
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  );
}
