import React from 'react';
import './loading.css'

function loading() {
    return (
        <div className="wrap">
            <div className="outer"/>
            <div className="inner">
                <div className="spiner"/>
                <div className="filler"/>
                <div className="masker"/>
            </div>
            <div className="inner2">
                <div className="spiner"/>
                <div className="filler"/>
                <div className="masker"/>
            </div>
        </div>
    )
}

export default loading