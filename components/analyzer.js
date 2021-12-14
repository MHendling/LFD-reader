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
    const [settings, setSettings] = useState({a: 1, b: 2, c: 3, d: 4});

    const [crop, setCrop] = useState({aspect: 1 / 5});

    //console.log(cropperRef);
    const handleSubmit = useCallback(async () => {
        setTransmitting(true);

        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        //console.log(imageElement, cropper)
        const croppedImage = cropper.getCroppedCanvas().toDataURL();

        const paramData = {
            settings,
            imgData: croppedImage,
        }

        const response = await fetch('/api/analyzer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paramData)
            // body: JSON.stringify(croppedImage)
        });

        const responseText = JSON.parse(await response.text());

        //toast(responseText, {autoClose: false});
        setTransmitting(false);
        setResult({__html: `${responseText}`});
    }, [cropperRef]);

    const handleCancel = useCallback(() => {
        onCancel();
    }, []);

    return (
        <div className={styles.analyzerContainer}>
            {
                result ? <div><h1>Result start</h1>
                        <div dangerouslySetInnerHTML={result}/>
                        <p>Result end</p></div> :
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
                    />}

            <div className={styles.analyzerButtons}>
                <Button onClick={handleCancel} intent="danger" large icon="delete" fill>Cancel</Button>
                <Button onClick={handleSubmit} intent="success" icon="send-message"
                        large fill loading={transmitting}>Submit</Button>
            </div>


            <ToastContainer/>
        </div>

    )
}

export default Analyzer;