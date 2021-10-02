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
        setCanvasWidth(containerRef.current?.clientWidth)
        setCanvasHeight(containerRef.current?.clientHeight)
    }, [containerRef.current])

    /* Stream the video output to our component state */
    useEffect(() => {
        async function enableStream() {
            console.log('in enableStream')
            try {
                const stream = await navigator?.mediaDevices?.getUserMedia({
                    video: {facingMode: 'environment'},
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
        console.log(containerRef.current?.clientWidth)
        console.log(cameraSensorRef.current?.clientWidth)
        console.log(cameraViewRef.current.naturalWidth)
        console.log(canvasWidth)
        const cropY = canvasHeight * 0.25;
        const cropX = canvasWidth * 0.4;
        const cropWidth = canvasWidth * 0.2;
        const cropHeight = canvasHeight * 0.5;
        console.log(cropY, cropX, cropWidth, cropHeight)
        cameraSensorRef.current.getContext('2d').drawImage(cameraViewRef.current, canvasWidth * 0.6, canvasHeight*0.25, cropWidth, cropHeight, cropX, cropY, cropWidth, cropHeight)
        setCameraOutput(cameraSensorRef.current.toDataURL('image/webp'))
    }, [cameraSensorRef.current])

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