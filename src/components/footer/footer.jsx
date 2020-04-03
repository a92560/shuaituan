import React, {Component} from 'react';
import './footer.css'
export default class Footer extends Component {

    render() {
        return (
            <div style={{position: 'relative', bottom: 0}}>
                <footer className="footer">
                    <div className="footer__wrap">
                        <div className="footer__secondary">
                            <div className="footer__inner">
                                <div className="footer__region">
                                    <span>Region</span>
                                    <select className="footer__region__select">
                                        <option value="en-US">USA</option>
                                        <option value="zh-CN">China</option>
                                    </select>
                                </div>
                                <div className="footer__secondary__nav">
                                    <span>Copyright © 2019 shuaituan All Rights Reserved.</span>
                                <span>
                                    About Us
                                </span>
                                <span>
                                    Terms &amp; Conditions
                                </span>
                                <span>
                                    Privacy Policy
                                </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        )
    }
}