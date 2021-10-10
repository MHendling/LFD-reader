import React, {useCallback, useState, useRef} from 'react';
import Image from "next/image";
import Cropper from 'react-cropper';

import {ToastContainer, toast} from 'react-toastify';
import {Button} from "@blueprintjs/core";

import "cropperjs/dist/cropper.css";
import 'react-toastify/dist/ReactToastify.css';

import styles from './analyzer.module.scss'

const Analyzer = ({imageData, onCancel}) => {

    const cropperRef = useRef(null);

    const [result, setResult] = useState(null);
    const [transmitting, setTransmitting] = useState(false);

    const [crop, setCrop] = useState({aspect: 1 / 5});

    console.log(cropperRef);
    const handleSubmit = useCallback(async () => {
        setTransmitting(true);

        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        console.log(imageElement, cropper)
        const croppedImage = cropper.getCroppedCanvas().toDataURL();

        const response = await fetch('/api/analyzer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(imageData)
        });

        const responseText = JSON.parse(await response.text());

        toast(responseText, {autoClose: false});
        console.log(responseText)
        setTransmitting(false);
    }, [cropperRef]);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);

    return (
        <div className={styles.analyzerContainer}>
            <Cropper
                style={{height: "80vh", width: "100%"}}
                zoomTo={2}
                initialAspectRatio={1 / 4}
                src={imageData}
                viewMode={1}
                minCropBoxHeight={100}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={true}
                guides={true}
                movable={false}
                ref={cropperRef}
            />

            <div className={styles.analyzerButtons}>
                <Button onClick={handleCancel} intent="danger" large icon="delete" fill>Cancel</Button>
                <Button  onClick={handleSubmit} intent="success" icon="send-message"
                        large fill loading={transmitting}>Submit</Button>
            </div>

            <ToastContainer/>
        </div>
    )
}

export default Analyzer;