import React, { useEffect, useCallback, useState, useRef } from 'react'

import styles from './lfd-reader.module.css'

const LfdReader = () => {

  /* Connection to our DOM elements */
  const containerRef = useRef()
  const cameraSensorRef = useRef()
  const cameraViewRef = useRef()

  /* The state of our reader component */
  const [cameraOutput, setCameraOutput] = useState('//:0)')
  {/* Note to cameraOutput: using //:0 as the source will prevent the empty image icon from showing without the browser showing a security warning */
  }
  const [cameraInitialized, setCameraInitialized] = useState(false)
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
    async function enableStream () {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        })
        setMediaStream(stream)
        setCameraInitialized(true)
      } catch (err) {
        // Todo: add proper error display
        console.log(err)
      }
    }

    if (!mediaStream) {
      enableStream()
    } else {
      return function cleanup () {
        mediaStream.getTracks().forEach(track => {
          track.stop()
        })
      }
    }
  }, [cameraInitialized, mediaStream])

  /* Get the image data from our camera sensor and write it into the camera output */
  const handleCameraTrigger = useCallback(() => {
    cameraSensorRef.getContext('2d').drawImage(cameraViewRef, 0, 0)
    setCameraOutput(cameraSensorRef.toDataURL('image/webp'))
  }, [])

  /* If the camera was not successfully initialized, display this error message */
  if (!mediaStream) {
    console.log('checking,', cameraViewRef)
    return (
      <div style={{ textAlign: 'center' }}>
        <h2>Camera permissions not set.</h2>
      </div>
    )
  }

  if (mediaStream && cameraViewRef.current &&
    !cameraViewRef.current.srcObject) {
    cameraViewRef.current.srcObject = mediaStream
  }

  /* Otherwise return the main component */
  return (
    <main id="camera" className={styles.camera} ref={containerRef}>

      {/*Camera View*/}
      <video id="camera--view" className={styles.cameraView} autoPlay
             playsInline ref={cameraViewRef}/>

      {/*Camera sensor*/}
      <canvas id="camera--sensor"
              className={styles.cameraSensor}
              ref={cameraSensorRef}
              width={canvasWidth}
              height={canvasHeight}/>

      {/*Camera output */}
      <img src={cameraOutput} alt="" id="camera--output"
           className={styles.cameraOutput}/>

      <svg id="capture--frame" className={styles.captureFrame}>
        <rect width="100%" height="100%"/>
      </svg>

      {/*Camera trigger */}
      <button id="camera--trigger" className={styles.button}
              onClick={handleCameraTrigger}>Take a picture
      </button>

    </main>
  )
}

export default LfdReader