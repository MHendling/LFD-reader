import React, {useEffect, useCallback, useState, useRef} from 'react'

import styles from './lfd-reader.module.css'

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

    /* We set the correct canvas width after everything is drawn */
    useEffect(() => {
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
        cameraSensorRef.current.getContext('2d').drawImage(cameraViewRef.current, 0, 0)
        setCameraOutput(cameraSensorRef.current.toDataURL('image/webp'))
    }, [cameraSensorRef.current])

    const handleCanPlay = useCallback(() => {
        cameraViewRef.current.play();
    }, [cameraViewRef.current]);

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


            {/*Camera output */}
            {cameraOutput && <img src={cameraOutput} alt="" id="camera--output"
                                  className={styles.cameraOutput}/>}


            {/*Camera trigger */}
            <button id="camera--trigger" className={styles.button}
                    onClick={handleCameraTrigger}>Take a picture
            </button>

        </main>
    )
}

export default LfdReader