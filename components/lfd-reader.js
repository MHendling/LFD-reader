import React, {useEffect, useCallback, useState, useRef} from 'react';

import styles from './lfd-reader.module.css';

const LfdReader = () => {

    /* Connection to our DOM elements */
    const containerRef = useRef();
    const cameraSensorRef = useRef();
    const cameraViewRef = useRef();

    /* The state of our reader component */
    const [cameraOutput, setCameraOutput] = useState('//:0)');
    {/* Note to cameraOutput: using //:0 as the source will prevent the empty image icon from showing without the browser showing a security warning */
    }
    const [canvasWidth, setCanvasWidth] = useState(0);
    const [canvasHeight, setCanvasHeight] = useState(0);
    const [cameraInitializing, setCameraInitializing] = useState(true);
    const [cameraInitialized, setCameraInitialized] = useState(false);

    /* We set the correct canvas width after everything is drawn */
    useEffect(() => {
        setCanvasWidth(containerRef.current?.clientWidth);
        setCanvasHeight(containerRef.current?.clientHeight);
    }, [containerRef.current]);

    /* If not yet initialized, the camera will try to start streaming
    *
    * (hopefully, couldnt test that <3)
    *  */
    useEffect(() => {
        cameraInitializing &&
        navigator.mediaDevices
            .getUserMedia({video: {facingMode: "environment"}, audio: false})
            .then(function (stream) {
                // const track = stream.getTracks()[0]; // unused?
                cameraViewRef.srcObject = stream;
                setCameraInitialized(true);
                setCameraInitializing(false);
            })
            .catch(function (error) {
                console.error("Oops. Something is broken.", error);
                setCameraInitialized(false);
                setCameraInitializing(false);
            });
    }, [cameraInitializing]);

    /* Get the image data from our camera sensor and write it into the camera output */
    const handleCameraTrigger = useCallback(() => {
        cameraSensorRef.getContext("2d").drawImage(cameraViewRef, 0, 0);
        setCameraOutput(cameraSensorRef.toDataURL("image/webp"));
    }, []);

    /* If the camera was not successfully initialized, display this error message */
    if (!cameraInitialized) {
        return (
            <div style={{textAlign: 'center'}}>
                <h2>Camera permissions not set.</h2>

                <button className={styles.button} onClick={() => setCameraInitializing(true)}>
                    Retry
                </button>
            </div>
        )
    }

    /* Otherwise return the main component */
    return (
        <main id="camera" className={styles.camera} ref={containerRef}>

            {/*Camera View*/}
            <video id="camera--view" className={styles.cameraView} autoPlay playsInline ref={cameraViewRef}/>

            {/*Camera sensor*/}
            <canvas id="camera--sensor"
                    className={styles.cameraSensor}
                    ref={cameraSensorRef}
                    width={canvasWidth}
                    height={canvasHeight}/>

            {/*Camera output */}
            <img src={cameraOutput} alt="" id="camera--output" className={styles.cameraOutput}/>

            <svg id="capture--frame" className={styles.captureFrame}>
                <rect width="100%" height="100%"/>
            </svg>

            {/*Camera trigger */}
            <button id="camera--trigger" className={styles.cameraTrigger} onClick={handleCameraTrigger}>Take a picture
            </button>

        </main>
    )
}

export default LfdReader;