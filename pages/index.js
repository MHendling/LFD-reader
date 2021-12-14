import React, {useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import {Button, Callout, Classes, Dialog, Intent} from "@blueprintjs/core";
import Settings from "../components/settings";

import styles from '../styles/Home.module.css'

export default function Home() {
    const [currentSettings, setCurrentSettings] = useState(undefined);

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
                    <div>
                        <h2>1</h2>
                    </div>


                    <div>
                        <Settings
                            currentSettings={currentSettings}
                            onChange={newSettings => setCurrentSettings(newSettings)} />
                    </div>
                    <div>
                        <h2>2</h2>
                    </div>
                    <div className={styles.startArea}>
                        <Link href="reader">
                            <Button intent="primary" large fill disabled={currentSettings == null}>Start LFD reader</Button>
                        </Link>
                    </div>

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
