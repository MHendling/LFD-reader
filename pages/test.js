import React, {useCallback, useState} from 'react';
import LfdReader from "../components/lfd-reader";
import Analyzer from "../components/analyzer";

function createMarkup(input) {
    return {__html: `${input}`}
}

const Test = ({data}) => {

    return (<div dangerouslySetInnerHTML={createMarkup(data)} />)
}

export default Test;