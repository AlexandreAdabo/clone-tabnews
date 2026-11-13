import Head from 'next/head';
import { PageLayout, Header, Text } from '@primer/react';
import styles from './index.module.css';

const contentWidthClasses = {
  small: styles.smallContent,
};

export default function DefaultLayout({
  children,
  metadata = {},
  contentWidth = 'full',
}) {
  const extraContentClassName = contentWidthClasses[contentWidth] || '';

  return (
    <>
      <Head>
        <title>{metadata.title ? `${metadata.title} · ` : ''}FinTab</title>
        {metadata.description && (
          <meta name="description" content={metadata.description} />
        )}
      </Head>
      <PageLayout.Header>
        <Header>
          <Header.Item full>
            <Header.Link href="/">FinTab</Header.Link>
          </Header.Item>
          <Header.Item>
            <Header.Link href="/login">Login</Header.Link>
          </Header.Item>
          <Header.Item>
            <Header.Link href="/cadastro">Cadastro</Header.Link>
          </Header.Item>
        </Header>
      </PageLayout.Header>
      <PageLayout>
        <PageLayout.Content
          width={contentWidth}
          className={extraContentClassName}
        >
          {children}
        </PageLayout.Content>
        <PageLayout.Footer divider="line">
          <Text size="small">
            {new Date().getFullYear()} FinTab. Todos os direitos reservados.
          </Text>
        </PageLayout.Footer>
      </PageLayout>
    </>
  );
}
