import React, {useCallback, useState, useRef} from 'react';
import Image from "next/image";
import Cropper from 'react-cropper';

import {ToastContainer, toast} from 'react-toastify';
import {Button} from "@blueprintjs/core";

import "cropperjs/dist/cropper.css";
import 'react-toastify/dist/ReactToastify.css';

import styles from './analyzer.module.scss'

const Analyzer = ({imageData, onCancel, curveFittingSettings}) => {

    const cropperRef = useRef(null);

    const [result, setResult] = useState(null);
    const [resultPlot, setResultPlot] = useState('');
    const [transmitting, setTransmitting] = useState(false);

    const [crop, setCrop] = useState({aspect: 1 / 4});

    //console.log(cropperRef);
    const handleSubmit = useCallback(async () => {
        setTransmitting(true);

        const imageElement = cropperRef?.current;
        const cropper = imageElement?.cropper;
        //console.log(imageElement, cropper)
        const croppedImage = cropper.getCroppedCanvas().toDataURL();

        const paramData = {
            settings: curveFittingSettings,
            imgData: croppedImage,
        }

        const response = await fetch('/api/analyzer', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paramData)
        });

        const responseText = JSON.parse(JSON.parse(await response.json()));
        setTransmitting(false);
        setResult(responseText);
        setResultPlot(responseText?.Plot);
    }, [cropperRef]);
	
    const handleCancel = useCallback(() => {
        onCancel();
    }, []);
	
    return (
	
        <div className={styles.analyzerContainer}>
            {
                result ? <div>
                        <h1>Results</h1>
			<img src={"data:image/png;charset=utf-8;base64," + resultPlot} className={styles.analyzerImage}
                             alt="result-plot"/>
                        {/*<div dangerouslySetInnerHTML={{__html: result}}/>*/}
                        <div className={styles.analyzerResults}>
                            <span>AUCs</span>
                            <span>{result?.AUCs?.join(', ')}</span>
                            <span>Percentages</span>
                            <span>{result?.Percentages?.join(', ')}</span>
                            <span>c/t</span>
                            <span>{result["c/t"]}</span>
                            <span>t/c</span>
                            <span>{result["t/c"]}</span>
                            <span>Conc</span>
                            <span>{result?.Concentrations?.join(', ')}</span>
                        </div>
                    </div> :
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
                    
           {
            result ?  <div className={styles.analyzerButtons}>
                         <Button onClick={handleCancel} intent="success" large icon="arrow-left" fill>Back</Button>
                      </div> :
            			<div className={styles.analyzerButtons}>
                			<Button onClick={handleCancel} intent="danger" large icon="delete" fill>Cancel</Button>
                			<Button onClick={handleSubmit} intent="success" icon="send-message"
                        		large fill loading={transmitting}>Submit</Button>
                                </div>
            }
        


            <ToastContainer/>
        </div>

    )
}

export default Analyzer;
