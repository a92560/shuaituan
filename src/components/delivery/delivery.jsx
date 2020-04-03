import React, {Component} from 'react';
import {
    Layout,
    Button, Notification
} from "element-react";
import {
    withRouter
} from 'react-router-dom'
import './delivery.css'
import {
    patchHangOrderStatus
} from "../../api";

class Delivery extends Component {
    constructor(props) {
        super(props);
    }

    // 查看用户信息
    handleSearchUserInfo = () => {
        console.log('handleSearchUserInfo')
    }

    // 查看商家信息
    handleSearchShopInfo = () => {
        console.log('handleSearchShopInfo')
    }

    // 配送员接单
    handleAcceptOrder = async (o_id) => {
        // 更新两个表的状态
        const did = localStorage.getItem("deliId")
        const {data: {status, data: {data: updateCount}}} = await patchHangOrderStatus(o_id, 1, did)
        // 把订单表和挂单表的配送员更改为 localStorage.getItem("deliId")
        if (status === 0 && updateCount === 1) {
            Notification({
                message: "接单成功",
                type: "success"
            })
        }
    }
    render() {
        const { hangUpOrderList } = this.props
        if( !hangUpOrderList || hangUpOrderList.length <= 0){
            return null
        }
        return (
            <div className="delivery-list">
                <Layout.Row className="page-product">
                    <Layout.Col span={18} style={{paddingLeft: 180}}>
                        <div className="orderList">
                            {
                                hangUpOrderList.map((handUpOrder) => (
                                    <dl className="s-item" key={handUpOrder.id}>
                                        <dt style={{marginTop: 20}}>
                                            <img src={require(`../../assets/images/${handUpOrder.g_img}`)} className="autoImage" alt="商家图片"/>
                                        </dt>
                                        <dd style={{marginTop: 10, width: 150}}>
                                            {/*<span className="label-tip">名称：---&nbsp;数量：</span>
                                            <span>猪脚饭&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2</span>*/}
                                            <span className="label-tip">商品名称：</span><h3 style={{margin: '4px 0', width: 130}} onClick={() => this.props.history.push(`/detail/${handUpOrder.sid}`)}>{handUpOrder.g_name}</h3>
                                            <p style={{margin: '0 0'}}>
                                                <span className="label-tip">商品数量：</span><span className="s-item-addr">{handUpOrder.g_count}</span>
                                            </p>
                                            <p style={{margin: '4px 0'}}>
                                                <span className="label-tip">商品价格：</span><span className="s-item-addr">￥{handUpOrder.price}</span>
                                            </p>
                                            <p style={{margin: '4px 0'}}>
                                                <span className="label-tip">商品总价：</span><span className="s-item-addr">￥{handUpOrder.total}</span>
                                            </p>
                                            <p style={{margin: '0 0'}}>
                                                <span className="label-tip">配送费：</span><em className="s-item-price">￥{handUpOrder.payment}</em>
                                            </p>
                                        </dd>
                                        <dd>
                                            <span className="label-tip">用户真实姓名：</span><h3 style={{width: 140, margin: '0 0'}} onClick={() => this.handleSearchUserInfo()}>{handUpOrder.u_name}</h3>
                                            <p>
                                                <span className="label-tip">用户地址：</span><span className="s-item-addr">{handUpOrder.u_address}</span>
                                            </p>
                                            <p>
                                                <span className="label-tip">用户手机号：</span><span className="s-item-addr">{handUpOrder.u_phone}</span>
                                            </p>
                                        </dd>
                                        <dd>
                                            <span className="label-tip">商家名称：</span><h3 style={{width: 130, margin: '0 0'}} onClick={() => this.handleSearchShopInfo()}>{handUpOrder.s_name}</h3>
                                            <p>
                                                <span className="label-tip">商家地址：</span><span className="s-item-addr">{handUpOrder.s_address}</span>
                                            </p>
                                            <p>
                                                <span className="label-tip">商家手机号：</span><span className="s-item-addr">{handUpOrder.s_phone}</span>
                                            </p>
                                        </dd>
                                        <dd>
                                            <Button type="primary" onClick={() => this.handleAcceptOrder(handUpOrder.oid)}>接单</Button>
                                        </dd>
                                    </dl>
                                ))
                            }

                        </div>
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}

export default withRouter(Delivery)