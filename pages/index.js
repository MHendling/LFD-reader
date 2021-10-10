import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import styles from '../styles/Home.module.css'
import {Button, Callout} from "@blueprintjs/core";

export default function Home() {
    return (
        <div className={styles.container}>
            <Head>
                <title>AIT LFD Reader</title>
                <meta name="description" content="Proudly presented by AIT / Michaela Hendling"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>

                <div>
                    <Image src="/ait-logo-footer.svg" width={288} height={64}/>
                    <h2 className={styles.title}>
                        LFD Reader
                    </h2>
                </div>

                <Callout className={styles.welcome}>
                    <p>Some instructional text could go here ... dingo bongo wongo</p>
                    <Link href="reader">
                        <Button intent="primary" large>Start LFD reader</Button>
                    </Link>
                </Callout>
            </main>

            {/*<footer className={styles.footer}>*/}
            {/*    <span className={styles.logo}>*/}
            {/*      <Image src="/ait-logo-footer.svg" width={288} height={64}/>*/}
            {/*    </span>*/}
            {/*</footer>*/}
        </div>
    )
}
