import React, {Component, Fragment} from 'react';
import {
    Button
} from 'element-react'
import {
    withRouter
} from 'react-router-dom'
import {
    connect
} from 'react-redux'
import './product-item.css'
class ProductItem extends Component {
    constructor(props){
        super(props)
    }


    render() {
        if(!this.props.img){
            return null
        }
        const {img, name, sell_count, price, good_rating, count, handleToAddCart, handleToBuy, handleToEditGoods, handleToDeleteGoods, isShopperSelf} = this.props
        return (
            <li className="m-detail-item">
                <dl className="section">
                    <dd>
                        <img src={require(`../../assets/images/${img}`)} alt="商品图片"/>
                    </dd>
                    <dd>
                        <h4>{name}</h4>
                        <p>
                            <span>已售：{sell_count}份</span>
                            <span style={{display: 'inline-block', marginLeft: 15, fontWeight: 'bold'}}>剩余：{count}份</span>
                        </p>
                        <div style={{fontSize: 14, marginTop: -7}}>
                            <span >{good_rating}人好评</span>
                        </div>
                        <p>
                            <span className="price">{price}</span>
                        </p>
                    </dd>
                    <dd>
                        {
                            !isShopperSelf ?
                                <Fragment>
                                    <Button type="primary" onClick={handleToAddCart}>加入购物车</Button>
                                    <Button type="warning" onClick={handleToBuy}>立即抢购</Button>
                                </Fragment> :
                                <Fragment>
                                    <Button type="primary" onClick={handleToEditGoods}>编辑商品</Button>
                                    <Button type="warning" onClick={handleToDeleteGoods}>删除商品</Button>
                                </Fragment>
                        }
                    </dd>
                </dl>
            </li>
        )
    }
}
export default withRouter(
    connect(
        state => ({shoppingCart : state.shoppingCart})
    )(ProductItem)
)