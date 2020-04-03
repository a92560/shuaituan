import React, {Component} from 'react';
import {
    Tabs
} from 'element-react'

export default class Tab extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {name, label, orderList, key} = this.props
        return (
            <Tabs.Pane name={name} label={label} key={key}>
                {
                    orderList.length > 0 ? orderList.map(order => (
                        <ul key={order.oid}>
                            <li className="m-order-item">
                                <dl className="section">
                                    <dd>
                                        <img src={require(`../../assets/images/${order.img}`)}
                                             alt="商品图片"/>
                                    </dd>
                                    <dd>
                                        <h4>{order.g_name}</h4>
                                        <span style={{
                                            display: 'inline-block',
                                            padding: '4px 0',
                                            fontSize: 14
                                        }}>商家：{order.shop.name}</span>
                                        <p>
                                            <span>数量：{order.count}份</span>
                                        </p>
                                    </dd>
                                    <dd>
                                        <p>
                                            <span className="price"
                                                  style={{lineHeight: '18px'}}>{order.total}</span>
                                        </p>
                                    </dd>
                                    <dd>
                                        <p>
                                            <span className="status">
                                                {
                                                    order.status === 0 ? '待配送' : (order.status === 1 ? '配送中' : (order.status === 2 ? '待评价' : '已评价'))
                                                }
                                            </span>
                                        </p>
                                    </dd>
                                </dl>
                            </li>
                        </ul>
                    )) : <div>暂无内容</div>
                }
            </Tabs.Pane>
        )
    }
}