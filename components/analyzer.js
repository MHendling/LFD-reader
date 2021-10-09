import React, {useCallback, useState, useRef} from 'react';
import Image from "next/image";
import Cropper from 'react-cropper';

import { ToastContainer, toast } from 'react-toastify';

// import Button from "./button";
import { Button } from "@blueprintjs/core";

import "cropperjs/dist/cropper.css";
import 'react-toastify/dist/ReactToastify.css';
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

        toast(responseText, { autoClose: false});
        console.log(responseText)
        setTransmitting(false);
    }, []);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);


    const cropperRef = useRef(null);
    const onCrop = () => {
        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        console.log(cropper.getCroppedCanvas().toDataURL());
    };

    return (
        <div className={styles.analyzerContainer}>
            <Cropper
                style={{ height: "100%", width: "100%" }}
                zoomTo={0.5}
                initialAspectRatio={1/4}
                src={imageData}
                viewMode={1}
                minCropBoxHeight={10}
                minCropBoxWidth={10}
                background={false}
                responsive={true}
                autoCropArea={1}
                checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
                guides={true}
            />

            <div className={styles.analyzerButtons}>
                <Button onClick={handleCancel} intent="danger" large icon="delete">Cancel</Button>
                <Button disabled={transmitting} onClick={handleSubmit} intent="success" icon="send-message" large>Submit</Button>
            </div>

            <ToastContainer />
        </div>
    )
}

export default Analyzer;