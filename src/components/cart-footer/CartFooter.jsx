import React, {Component} from 'react';

export default class CartFooter extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="foot" id="foot">
                <span className="fl delete" id="deleteAll" onClick={this.props.handleRemove}>删除</span>
                <div className="fr closing" disabled={this.props.handleHaveChecked} onClick={this.props.handleBuy}>保存</div>
                <div className="fr total">合计：￥<span id="priceTotal">{this.props.totalPrice}</span></div>
                <div className="fr selected" id="selected">已选商品
                    <span id="selectedTotal">{this.props.handleSelectedCount()}</span>件
                    <span className="arrow up">︽</span>
                    <span className="arrow down">︾</span>
                </div>
                <div className="selected-view">
                    <div id="selectedViewList" className="clearfix"/>
                    <span className="arrow">◆<span>◆</span></span>
                </div>
            </div>
        )
    }
}
