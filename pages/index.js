import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/Home.module.css'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
          <h1 className={styles.title}>
              AIT LFD Reader Demo
          </h1>

          <Link href="reader" style={{marginTop: "2rem"}} >
              <img src="http://placekitten.com/300"/>
          </Link>
      </main>

      <footer className={styles.footer}>
          <span className={styles.logo}>
            <Image src="/AIT_logo-1.webp" width={144} height={32}/>
          </span>
      </footer>
    </div>
  )
}
