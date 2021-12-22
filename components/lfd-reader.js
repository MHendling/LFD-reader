import React, {useEffect, useCallback, useState, useRef} from 'react'

import styles from './lfd-reader.module.css'
import Image from "next/image";

import {Button, Colors, Icon} from "@blueprintjs/core";

const LfdReader = ({onSendImageData}) => {

    /* Connection to our DOM elements */
    const containerRef = useRef()
    const cameraSensorRef = useRef()
    const cameraViewRef = useRef()

    /* The state of our reader component */
    const [mediaStream, setMediaStream] = useState(null)
    const [canvasWidth, setCanvasWidth] = useState(0)
    const [canvasHeight, setCanvasHeight] = useState(0)
    const [flash, setFlash] = useState(false);
    const [hasFlashSupport, setHasFlashSupport] = useState(false);

    /* We set the correct canvas width after everything is drawn */
    useEffect(() => {
        setCanvasWidth(containerRef.current?.clientWidth)
        setCanvasHeight(containerRef.current?.clientHeight)
    }, [containerRef.current])

    /* Stream the video output to our component state */
    useEffect(() => {
        async function enableStream() {
            try {
                const stream = await navigator?.mediaDevices?.getUserMedia({
                    video: {
                        facingMode: 'environment',
                        width: 1920,
                        height: 1080,
                    },
                    audio: false,
                });
                if (await navigator?.mediaDevices?.getSupportedConstraints()?.torch) {
                    setFlash(false);
                    setHasFlashSupport(true);
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
        const track = mediaStream?.getTracks()[0];
        const streamWidth = track?.getSettings().width;
        const streamHeight = track?.getSettings().height;

        const cropStreamX = streamWidth * 0.4;
        const cropStreamY = streamHeight * 0.25;
        const cropStreamWidth = streamWidth * 0.2;
        const cropStreamHeight = streamHeight * 0.5;

        const cropCanvasX = canvasWidth * 0.4;
        const cropCanvasY = canvasHeight * 0.25;
        const cropCanvasWidth = canvasWidth * 0.2;
        const cropCanvasHeight = canvasHeight * 0.5;

        //cameraSensorRef.current.getContext('2d').drawImage(cameraViewRef.current,0,0)

        cameraSensorRef.current.getContext('2d').drawImage(cameraViewRef.current,
            cropStreamX,
            cropStreamY,
            cropStreamWidth,
            cropStreamHeight,
            cropCanvasX,
            cropCanvasY,
            cropCanvasWidth,
            cropCanvasHeight)

        const cameraData = cameraSensorRef.current.toDataURL('image/webp');

        onSendImageData(cameraData);
    }, [cameraSensorRef.current, mediaStream])

    const handleCanPlay = useCallback(() => {
        cameraViewRef.current.play();
    }, [cameraViewRef.current]);

    const handleFlash = useCallback(async () => {
        const track = mediaStream?.getVideoTracks()[0];

        const torchSetting = track?.getConstraints()?.advanced?.find((entry) => entry?.torch)?.torch;

        if (torchSetting) {
            setFlash(false);
            await track?.applyConstraints({
                advanced: [{torch: false}]
            });
        } else {
            await track?.applyConstraints({
                advanced: [{torch: true}]
            });
            setFlash(true);
        }
    }, [mediaStream]);

    if (mediaStream && cameraViewRef.current &&
        !cameraViewRef.current.srcObject) {
        cameraViewRef.current.srcObject = mediaStream
    }


    /* return the main component */
    return (
        <main id="camera" className={styles.camera} ref={containerRef}>

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

            {/*Flash button */}
            {hasFlashSupport &&
                <Button className={styles.flashButton} onClick={handleFlash} minimal>
                    <Icon icon="lightning" size={48} color={flash ? Colors.GOLD5 : Colors.GRAY3}/>
                </Button>
            }


            {/*Camera trigger */}
            <div className={styles.triggerButtonContainer}>
                <Button onClick={handleCameraTrigger} icon="camera" intent="primary" large disabled={mediaStream == null}>Take a picture</Button>
            </div>

        </main>
    )
}

export default LfdReader