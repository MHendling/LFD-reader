import React, {useCallback, useState} from 'react';
import LfdReader from "../components/lfd-reader";
import Analyzer from "../components/analyzer";

const Reader = ({curveFittingSettings}) => {
    const [imageData, setImageData] = useState(null);

    const handleResetImageData = useCallback(() => setImageData(null), []);
    const handleSetImageData = useCallback((imageData) => {
        setImageData(imageData);
    }, []);


    return (<>
        {imageData == null ?
            <LfdReader onSendImageData={handleSetImageData}/> :
            <Analyzer imageData={imageData} onCancel={handleResetImageData} curveFittingSettings={curveFittingSettings}/>
        }
    </>)
}

export default Reader;

export async function getServerSideProps(context) {
    const { curveFittingSettings } = context.query;

    return {
        props: {curveFittingSettings},
    }
}