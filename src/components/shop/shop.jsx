import React, {Component} from 'react';
import {
    withRouter
} from 'react-router-dom'
import {
    Rate,
    Layout
} from "element-react";
import './shop.css'
import img from '../../assets/images/1.jpg'
class Shop extends Component {
    constructor(props){
        super(props)
    }

    render() {
        return (
            <div>
                <Layout.Row className="page-product">
                    <Layout.Col span={18} style={{paddingLeft: 180}}>
                        <div className="orderList">
                            {
                                this.props.chooseArr.map(item => (
                                    <span className={item.isChosen ? 'active': ''}
                                            onClick={this.props.handleChoose}
                                            key={item.text}>
                                        {item.text}
                                    </span>
                                ))
                            }
                        </div>
                        {
                            this.props.shopList.map(shop => (
                                <dl className="s-item" key={shop.name}>
                                    <dt style={{marginTop: 20}}>
                                        <img src={require(`../../assets/images/${shop.img_cover && shop.img_cover}`)} alt="商家图片"/>
                                    </dt>
                                    <dd>
                                        <h3 onClick={() => this.props.history.push(`/detail/${shop.sid}`)}>{shop.name}</h3>
                                        <Rate disabled={true} value={shop.rating} showText={true} />
                                        <span className="s-item-comment-total">{shop.comment_count}人评论</span>
                                        <p>
                                            <span className="s-item-addr">{shop.address}</span>
                                        </p>
                                        <p>
                                            <em className="s-item-price">￥{shop.average_cost}起</em>
                                            {
                                                this.props.handleIsOpen(shop.open_time, shop.end_time) ? (
                                                    <b>营业中</b>
                                                ) : (
                                                    <b className="close">商家休息中</b>
                                                )
                                            }
                                        </p>
                                    </dd>
                                </dl>
                            ))
                        }
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}
export default withRouter(Shop)