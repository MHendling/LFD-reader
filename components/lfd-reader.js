import React, {useEffect, useCallback, useState, useRef} from 'react'

import styles from './lfd-reader.module.css'
import Button from "./button";
import Analyzer from "./analyzer";
import Image from "next/image";

const LfdReader = () => {

    /* Connection to our DOM elements */
    const containerRef = useRef()
    const cameraSensorRef = useRef()
    const cameraViewRef = useRef()

    /* The state of our reader component */
    const [cameraOutput, setCameraOutput] = useState(null)
    const [mediaStream, setMediaStream] = useState(null)
    const [canvasWidth, setCanvasWidth] = useState(0)
    const [canvasHeight, setCanvasHeight] = useState(0)
    const [torchButton, setTorchButton] = useState("/flash-off.svg")

    /* We set the correct canvas width after everything is drawn */
    useEffect(() => {
        console.log(containerRef.current?.clientWidth)
        console.log(containerRef.current?.clientHeight)
        setCanvasWidth(containerRef.current?.clientWidth)
        setCanvasHeight(containerRef.current?.clientHeight)
    }, [containerRef.current])

    /* Stream the video output to our component state */
    useEffect(() => {
        async function enableStream() {
            console.log('in enableStream')
            try {
                const stream = await navigator?.mediaDevices?.getUserMedia({
                    video: {
                        facingMode: 'environment'
                    },
                    audio: false,
                });
                console.log('got stream')
                if (navigator?.mediaDevices?.getSupportedConstraints().hasOwnProperty("torch"))
                {
                    const track = stream.getVideoTracks()[0];
                    track.applyConstraints({
                         advanced: [{torch: false}]
                    });
                }
                setMediaStream(stream)
            } catch (err) {
                // Todo: add proper error display
                console.log(err)
            }
        }

        if (!mediaStream) {
            enableStream()
        } else {
            return function cleanup() {
                mediaStream.getTracks().forEach(track => {
                    track.stop()
                })
            }
        }
    }, [mediaStream])

    /* Get the image data from our camera sensor and write it into the camera output */
    const handleCameraTrigger = useCallback(() => {
        const track = mediaStream.getTracks()[0];
        const streamWidth = track.getSettings().width;
        const streamHeight = track.getSettings().height;

        const cropStreamX = streamWidth * 0.4;
        const cropStreamY = streamHeight * 0.25;
        const cropStreamWidth = streamWidth * 0.2;
        const cropStreamHeight = streamHeight * 0.5;

        const cropCanvasX = canvasWidth * 0.4;
        const cropCanvasY = canvasHeight * 0.25;
        const cropCanvasWidth = canvasWidth * 0.2;
        const cropCanvasHeight = canvasHeight * 0.5;

        cameraSensorRef.current.getContext('2d').drawImage(cameraViewRef.current, cropStreamX, cropStreamY, cropStreamWidth, cropStreamHeight, cropCanvasX, cropCanvasY, cropCanvasWidth, cropCanvasHeight)
        setCameraOutput(cameraSensorRef.current.toDataURL('image/webp'))
    }, [cameraSensorRef.current, mediaStream, cameraViewRef.current])

    const handleCanPlay = useCallback(() => {
        cameraViewRef.current.play();
    }, [cameraViewRef.current]);

    const handleFlash = useCallback(() => {
        const track = mediaStream?.getVideoTracks()[0];

        if(track?.getSettings().torch == true)
        {
            setTorchButton("/flash-off.svg")
            track.applyConstraints({
                advanced: [{torch: false}]
            });
        }
        else
        {
            setTorchButton("/flash-on.svg")
            track?.applyConstraints({
                advanced: [{torch: true}]
            });
        }

    }, [mediaStream]);

    if (mediaStream && cameraViewRef.current &&
        !cameraViewRef.current.srcObject) {
        cameraViewRef.current.srcObject = mediaStream
    }


    /* return the main component */
    return (
        <main id="camera" className={styles.camera} ref={containerRef}>
            {/*Camera View*/}
            <video id="camera--view" className={styles.cameraView} onCanPlay={handleCanPlay}
                   playsInline ref={cameraViewRef}/>

            {/*Camera sensor*/}
            <canvas id="camera--sensor"
                    className={styles.cameraSensor}
                    ref={cameraSensorRef}
                    width={canvasWidth}
                    height={canvasHeight}/>

            <svg id="capture--frame" className={styles.captureFrame}>
                <rect width="100%" height="100%"/>
            </svg>

            <svg id="capture--border" className={styles.captureBorder}>
                <rect width="100%" height="100%"/>
            </svg>


            {/*Camera output */}
            {cameraOutput && <img src={cameraOutput} alt="" id="camera--output"
                                  className={styles.cameraOutput}/>}

            {/*Flash button */}
            <button className={styles.flashButton} onClick={handleFlash}>
                <Image src={torchButton} width={40} height={40}/>
            </button>



            {/*Camera trigger */}
            <Button onClick={handleCameraTrigger} className={styles.triggerButton}>Take a picture</Button>

        </main>
    )
}

export default LfdReader