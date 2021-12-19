import React, {useCallback, useEffect, useState} from 'react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'

import {Button, Callout, Classes, Dialog, Icon, Intent, Spinner} from "@blueprintjs/core";
import Settings from "../components/settings";

import styles from '../styles/Home.module.css'

const https = require('https');
const agent = new https.Agent({
  rejectUnauthorized: false
});

const fetchCurveFittingSettings = async () => {
    const curveFittingSettingsQuery = await fetch('https://localhost:3000/api/curve_fitting_settings',
    {
    method: 'GET',
    agent
    });

    return await curveFittingSettingsQuery.json();
}

export default function Home({mongoDbAlive, curveFittingSettings}) {
    const [currentSettings, setCurrentSettings] = useState(undefined);
    const [allSettings, setAllSettings] = useState(curveFittingSettings);


    const handleAddSettings = useCallback(async (settings) => {
        const newSettings = await fetch('https://localhost:3000/api/curve_fitting_settings', {
            method: 'POST',
            agent,
            body: JSON.stringify(settings)
        });

        // bulky, we refetch all our datas. this is a prototype after all.
        const allSettings = await fetchCurveFittingSettings();
        setAllSettings(allSettings);

        const newSettingData = await newSettings.json();
        setCurrentSettings(newSettingData);
    }, []);


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
                        {mongoDbAlive ?
                            <Settings
                                settings={allSettings}
                                currentSettings={currentSettings}
                                onChange={async newSelection => setCurrentSettings(newSelection)}
                                onSubmit={async newSettings => await handleAddSettings(newSettings)}/>
                            : <Spinner/>}
                    </div>
                    <div>
                        <h2>2</h2>
                    </div>
                    <div className={styles.startArea}>
                        <Link
                            href={{
                                pathname: `/reader`,
                                query: {
                                    curveFittingSettings: JSON.stringify(currentSettings)
                                },
                            }}
                        >
                            <Button intent="primary" large fill disabled={currentSettings == null}>Start LFD
                                reader</Button>
                        </Link>
                    </div>
                </Callout>
            </main>
        </div>
    )
}

export async function getServerSideProps(context) {
    try {
        // fetch our initial settings data
        const curveFittingSettings = await fetchCurveFittingSettings();

        return {
            props: {mongoDbAlive: true, curveFittingSettings},
        }
    } catch (e) {
        console.error(e)
        return {
            props: {mongoDbAlive: false},
        }
    }
}