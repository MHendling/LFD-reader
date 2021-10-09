import React, {useCallback, useState} from 'react';
import Image from "next/image";
import ReactCrop from 'react-image-crop';

import Button from "./button";

import 'react-image-crop/dist/ReactCrop.css';
import styles from './analyzer.module.scss'

const Analyzer = ({imageData, onCancel}) => {

    const [result, setResult] = useState(null);
    const [transmitting, setTransmitting] = useState(false);

    const [crop, setCrop] = useState({aspect: 1 / 5});

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

        console.log(responseText)
        setResult(responseText);
        setTransmitting(false);
    }, []);

    const handleCancel = useCallback(() => {
        setResult(null);

        // we basically want to exit here
        onCancel();
    }, []);

    return (
        <div className={styles.analyzerContainer}>
            <div className={styles.analyzerResults}>
                {transmitting && <Image src='/rocket.gif' width={64} height={64}/>}
                {result &&
                <div>
                    <h1>Result</h1>
                    <p>{result}</p>
                </div>
                }
            </div>

            <ReactCrop src={imageData} className={styles.analyzerImage} crop={crop}
                       onChange={newCrop => setCrop(newCrop)}/>;
            {/*<img src={imageData} className={styles.analyzerImage} />*/}

            <div className={styles.analyzerButtons}>
                <Button onClick={handleCancel}>Cancel</Button>
                <Button disabled={transmitting} onClick={handleSubmit}>Submit</Button>
            </div>
        </div>
    )
}

export default Analyzer;