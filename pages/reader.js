import React, {useCallback, useState} from 'react';
import LfdReader from "../components/lfd-reader";
import Analyzer from "../components/analyzer";

const Reader = () => {
    const [imageData, setImageData] = useState(null);

    const handleResetImageData = useCallback(() => setImageData(null), []);
    const handleSetImageData = useCallback((imageData) => {
        setImageData(imageData);
    }, []);


    return (<>
        {imageData == null ?
            <LfdReader onSendImageData={handleSetImageData}/> :
            <Analyzer imageData={imageData} onCancel={handleResetImageData}/>
        }
    </>)
}

export default Reader;