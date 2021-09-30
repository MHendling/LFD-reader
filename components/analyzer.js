import React, {useCallback, useState} from 'react';
import Image from "next/image";

import Button from "./button";

import styles from './analyzer.module.scss'

const Analyzer = ({imageData}) => {

    const [result, setResult] = useState(null);
    const [transmitting, setTransmitting] = useState(false);

    const handleSubmit = useCallback(async () => {
        setTransmitting(true);

        const response = await fetch('/api/analyzer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imageData)
        });

        const responseText = JSON.parse(await response.text());

        setResult(responseText.message);
        setTransmitting(false);
    }, []);

    const handleCancel = useCallback(() => {
        setResult(null);

        // we basically want to exit here
    }, []);

    return (
        <div className={styles.analyzerContainer}>
            <div className={styles.analyzerResults}>
                {transmitting && <Image src='/rocket.gif' width={64} height={64}/>}
                {result &&
                <div>
                    <h1>Result</h1>
                    {result}
                </div>
                }
            </div>

            <img src={imageData} className={styles.analyzerImage} />

            <div className={styles.analyzerButtons}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button disabled={transmitting} onClick={handleSubmit}>Send to server</Button>
            </div>
        </div>
    )
}

export default Analyzer;