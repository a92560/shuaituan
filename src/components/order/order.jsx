import React, {Component, Fragment} from 'react';
import {
    Layout,
    Tabs,
    Button,
    Menu,
    Dialog,
    Form,
    Input,
    Rate,
    Notification
} from "element-react";
import CommentForm from '../../components/comment-form/comment-form'
import {
    withRouter
} from 'react-router-dom'
import {
    connect
} from 'react-redux'
import {
    receiveSelectedIndex,
    receiveTabName
} from '../../redux/actions'

import {
    postDeliComment,
    postShopComment,
    reqUserOrders,
    reqShopOrders,
    postHangUpOrders,
    postOrderStatus,
    patchHangOrderStatus,
    reqOrderShopComment,
    reqOrderDeliComment,
    reqOrderUserComment,
    reqHangUpOrders,
    reqDeliHangOrder,
    reqDeliInfo
} from "../../api";
import './order.css'
import Comment from "../comment/comment";

class Order extends Component {
    constructor(props) {
        super(props)
        this.state = {
            commentList: [],
            tabArray: [{
                'name': '全部订单',
                'index': '1-1',
                'path': '/order'
            }, {
                'name': '待接单',
                'index': '1-2',
                'path': '/order?status=0'
            }, {
                'name': '待配送',
                'index': '1-3',
                'path': '/order?status=1'
            }, {
                'name': '配送中',
                'index': '1-4',
                'path': '/order?status=2'
            }, {
                'name': '待评价',
                'index': '1-5',
                'path': '/order?status=3'
            }, {
                'name': '已完成',
                'index': '1-6',
                'path': '/order?status=4'
            }, {
                'name': '我的购物车',
                'index': '2',
                'path': '/cart'
            }, {
                'name': '个人信息',
                'index': '3',
                'path': '/personal'
            }, {
                'name': '钱包',
                'index': '4',
                'path': '/wallet'
            }
            ],
            shopTabArray: [{
                'name': '全部订单',
                'index': '1-1',
                'path': '/order'
            }, {
                'name': '待接单',
                'index': '1-2',
                'path': '/order?status=0'
            }, {
                'name': '待配送',
                'index': '1-3',
                'path': '/order?status=1'
            }, {
                'name': '配送中',
                'index': '1-4',
                'path': '/order?status=2'
            }, {
                'name': '待评价',
                'index': '1-5',
                'path': '/order?status=3'
            }, {
                'name': '已完成',
                'index': '1-6',
                'path': '/order?status=4'
            }, {
                'name': '个人信息',
                'index': '2',
                'path': '/personal'
            }, {
                'name': '钱包',
                'index': '3',
                'path': '/wallet'
            }
            ],
            deliTabArray: [{
                'name': '全部订单',
                'index': '1-1',
                'path': '/order'
            }, {
                'name': '配送中',
                'index': '1-2',
                'path': '/order?status=1'
            }, {
                'name': '待评价',
                'index': '1-4',
                'path': '/order?status=2'
            }, {
                'name': '已完成',
                'index': '1-5',
                'path': '/order?status=3'
            }, {
                'name': '个人信息',
                'index': '2',
                'path': '/personal'
            }, {
                'name': '钱包',
                'index': '3',
                'path': '/wallet'
            }
            ],
            orderList: [], // 订单列表
            originOrderList: [], // 保存全部类型订单
            selectedIndex: '', // 左侧aside选中下标
            showCommentDialog: false, // 显示弹框
            comment: {
                s_content: '', // 商家评论内容
                s_rating: 0, // 商家评分
                d_content: '', // 商家评论内容
                d_rating: 0, // 商家评分
            },
            oid: '', //订单ID
            showPaymentDialog: false, // 显示配送费弹框
            payment: '', // 配送费
            readComment: {}, //
            delivery: {
                d_rating: 0,
                b_user: {}
            },
            showDeliveryDialog: false,
            d_rating: 0
        }
    }


    async componentDidMount() {
        let {pathname, search} = this.props.history.location
        // 分为两种情况
        // pathname 一定有值  search有值 search 无值
        // 有值  加上之后 要清空search的值
        if (search) {
            pathname += search
            search = ''
        }
        switch (parseInt(localStorage.getItem("roleId"))) {
            case 0:
                const shouldUpdateTabArray = [...this.state.tabArray]
                await this.handleReload(shouldUpdateTabArray, "userId", pathname, search)
                break
            case 1:
                const shouldUpdateShopTabArray = [...this.state.shopTabArray]
                await this.handleReload(shouldUpdateShopTabArray, "shopId", pathname, search)
                break
            case 2:
                const shouldUpdateDeliArray = [...this.state.deliTabArray]
                await this.handleReload(shouldUpdateDeliArray, "deliId", pathname, search)
                break
        }
    }


    // 处理不是/order路由刷新时候selectedIndex 和 tabName 不一致
    handleReload = async (arr, localName, pathname, search) => {
        let willUpdateTabArray = arr.filter(item => item.path === pathname || item.path === search)
        this.props.receiveSelectedIndex({selectedIndex: willUpdateTabArray[0].index})
        this.props.receiveTabName({tabName: willUpdateTabArray[0].name})
        const {data: {status, message, data: {data: orderList}}} = localName === 'userId' ? await reqUserOrders(localStorage.getItem(localName)) : (localName === 'shopId' ? await reqShopOrders(localStorage.getItem(localName)) : await reqDeliHangOrder(localStorage.getItem(localName)))
        if (status === 0 && message === '成功') {
            console.log(orderList)
            this.setState({
                orderList,
                originOrderList: orderList
            })
            this.handleOrderStatusChange(willUpdateTabArray[0].index)
        } else {
            alert("fail")
        }
    }

    // 处理tab标签点击  左边aside栏同样产生变化
    handleTabClick = async (tab) => {
        // 更新selectedIndex 让对应的aside栏切换相应的subMenu
        // 1. 得到selectedIndex
        let index;
        switch (parseInt(localStorage.getItem("roleId"))) {
            case 0:
                index = this.handleTabAfterClick(this.state.tabArray, tab)
                break
            case 1:
                index = this.handleTabAfterClick(this.state.shopTabArray, tab)
                break
            case 2:
                index = this.handleTabAfterClick(this.state.deliTabArray, tab)
                break
        }
        // 2.更新selectedIndex
        this.props.receiveSelectedIndex({selectedIndex: index})
        // 3. 处理订单状态改变
        this.handleOrderStatusChange(index)
    }

    handleTabAfterClick = (arr, tab) => {
        return arr.filter((item) => item.name === tab.props.name)[0].index
    }

    // 处理订单状态改变
    handleOrderStatus = (newTabArray, index) => {
        newTabArray = newTabArray.filter(item => item.index === index)[0]
        if (index === '1-1') {
            // 有个例外 index 为'1-1'
            this.props.history.push('/order')
            this.setState({
                orderList: this.state.originOrderList
            })
        } else {
            // index 为 '1-2'之类的
            this.props.history.push(newTabArray.path)
            let status = this.props.history.location.search.split("=")[1]
            let updatedOrders = [...this.state.originOrderList]
            let shouldUpdateOrders = updatedOrders.filter(order => order.status === parseInt(status))
            this.setState({
                orderList: shouldUpdateOrders
            })
        }
    }

    // 处理tab标签选中之后订单状态改变
    handleOrderStatusChange = (index) => {
        // 提出arr中合适的index和path
        switch (parseInt(localStorage.getItem("roleId"))) {
            case 0:
                let newTabArray = [...this.state.tabArray]
                // 路由跳转 更新订单状态
                this.handleOrderStatus(newTabArray, index)
                break
            case 1:
                let newShopTabArray = [...this.state.shopTabArray]
                this.handleOrderStatus(newShopTabArray, index)
                break
            case 2:
                let newDeliTabArray = [...this.state.deliTabArray]
                this.handleOrderStatus(newDeliTabArray, index)
                break
        }
    }

    // 评论之前
    handleBeforeComment = (orderId) => {
        this.setState({
            showCommentDialog: true,
            commentShop: true,
            oid: orderId
        })
    }

    // 处理评论事件
    handleComment = async (e) => {
        if (this.state.commentList.length > 0 || Object.keys(this.state.readComment).length > 0) {
            this.setState({showCommentDialog: false})
            return
        }
        this.setState({showCommentDialog: false})
        if (this.state.commentShop === true) {
            // 过滤订单
            let shouldCommentOrders = [...this.state.orderList]
            let shouldCommentOrder = shouldCommentOrders.filter(order => order.oid === this.state.oid)
            // 评论商家
            const {uid, sid, did} = shouldCommentOrder[0]
            const {s_content, s_rating, d_content, d_rating} = this.state.comment
            let shouldPostShopComment = {
                uid,
                sid,
                content: s_content,
                rating: s_rating,
                oid: this.state.oid
            }
            let shouldPostDeliComment = {
                uid,
                did,
                content: d_content,
                rating: d_rating,
                oid: this.state.oid
            }
            const {data: {status: shopStatus, data: {data: shopCount}}} = await postShopComment(sid, shouldPostShopComment)
            const {data: {status: deliStatus, data: {data: deliCount}}} = await postDeliComment(did, shouldPostDeliComment)
            if (shopStatus === 0 && shopCount === 1 && deliStatus === 0 && deliCount === 1) {
                Notification({
                    message: '评论成功',
                    type: 'success'
                });
            }
        } else {

        }
    }

    handleInputChange = (val, name) => {
        if (name === 'payment') {
            this.setState({
                payment: val
            })
            return
        }
        this.setState({
            comment: {...this.state.comment, ...{[name]: val}}
        })
    }

    // 处理aside选中事件
    handleSelect = (index) => {
        this.setState({
            selectedIndex: index
        }, (() => {
            // 更新tabName
            // 1. 获取tabName
            switch (parseInt(localStorage.getItem("roleId"))) {
                case 0:
                    // 处理路由跳转和订单状态改变
                    this.handleTabPaneSwitch(this.state.tabArray)
                    break
                case 1:
                    // 处理路由跳转和订单状态改变
                    this.handleTabPaneSwitch(this.state.shopTabArray)
                    break
                case 2:
                    // 处理路由跳转和订单状态改变
                    this.handleTabPaneSwitch(this.state.deliTabArray)
                    break
            }
        }))
    }

    // 更新tabName方法
    handleTabPaneSwitch = (arr) => {
        let {name, path = '/'} = arr.filter((item) => item.index === this.state.selectedIndex)[0]
        this.props.history.push(path)
        this.props.receiveTabName({tabName: name})
        this.props.receiveSelectedIndex({selectedIndex: this.state.selectedIndex})
        // 处理订单状态改变
        this.handleOrderStatusChange(this.state.selectedIndex)
    }

    // 处理订单循环
    handleOrdersStatus = (roleId, selectedIndex, isSubMenu = true) => {
        return roleId === 0 ?
            this.state.tabArray.map((item) => {
                if (!isSubMenu && !(item.index.startsWith('1'))) {
                    // 不是subMenu
                    return <Menu.Item
                        className={selectedIndex === item.index ? "is-active" : ''}
                        index={item.index}
                        key={item.index}

                    ><i className="el-icon-message"/>
                        {item.name}
                    </Menu.Item>
                } else if (isSubMenu && item.index.startsWith('1')) {
                    // 是subMenu
                    return <Menu.Item
                        className={selectedIndex === item.index ? "is-active" : ''}
                        index={item.index}
                        key={item.index}
                    >
                        {item.name}
                    </Menu.Item>
                }
            }) : (roleId === 1 ?
                    this.state.shopTabArray.map((item) => {
                        if (!isSubMenu && !(item.index.startsWith('1'))) {
                            // 不是subMenu
                            return <Menu.Item
                                className={selectedIndex === item.index ? "is-active" : ''}
                                index={item.index}
                                key={item.index}
                            ><i className="el-icon-message"/>
                                {item.name}
                            </Menu.Item>
                        } else if (isSubMenu && item.index.startsWith('1')) {
                            return <Menu.Item
                                className={selectedIndex === item.index ? "is-active" : ''}
                                index={item.index}
                                key={item.index}
                            >
                                {item.name}
                            </Menu.Item>
                        }
                    }) :
                    this.state.deliTabArray.map((item) => {
                        if (!isSubMenu && !(item.index.startsWith('1'))) {
                            // 不是subMenu
                            return <Menu.Item
                                className={selectedIndex === item.index ? "is-active" : ''}
                                index={item.index}
                                key={item.index}
                            ><i className="el-icon-message"/>
                                {item.name}
                            </Menu.Item>
                        } else if (isSubMenu && item.index.startsWith('1')) {
                            return <Menu.Item
                                className={selectedIndex === item.index ? "is-active" : ''}
                                index={item.index}
                                key={item.index}
                            >
                                {item.name}
                            </Menu.Item>
                        }
                    })
            )
    }

    // 商家接单
    handleShopAcceptOrder = async (order) => {
        // 收集所需数据
        console.log(order)
        this.setState({
            showPaymentDialog: true
        })
        const {name: s_name, address: s_address, phone: s_phone} = order.shop
        const {did, g_name, gid: g_id, count: g_count, oid, price, total, sid, uid, u_name, u_address, u_phone, img: g_img} = order
        // 创建挂单表
        const {data: {status, data: {data: insertCount}}} = await postHangUpOrders(oid, {
            did,
            g_name,
            g_id,
            g_count,
            oid,
            price,
            total,
            sid,
            s_name,
            s_address,
            s_phone,
            uid,
            u_name,
            u_address,
            u_phone,
            g_img,
            payment: this.state.payment
        })
        // 修改该订单状态为待配送
        const {data: {status: updateStatus, data: {data: updateCount}}} = await postOrderStatus(oid)
        if (status === 0 && insertCount === 1 && updateStatus === 0 && updateCount === 1) {
            alert("接单成功")
            window.location.reload()
        }
    }

    // 点击获取配送员信息
    handleDeliveryInfo = async (e, order) => {
        e.stopPropagation()
        // 重新获取订单信息
        const did = order.did
        const {data: {status, data: {data: delivery}}} = await reqDeliInfo(did)
        if (status === 0) {
            this.setState({
                d_rating: delivery.d_rating,
                delivery,
                showDeliveryDialog: true
            })

        }
    }

    // 处理订单状态分别处理
    // 注意用户和商家共用一个订单表  0-> 商家未接单(商家设计BUTTON)  1-> 配送员未接单(配送员设计BUTTON)  2-> 配送中
    // 3-> 用户未评价(用户设计BUTTON)  4 -> 已完成订单
    // 处理商家订单状态展示
    handleShopStatus = (order, orderStatus) => {
        // 为商家时 待接单显示按钮
        return orderStatus === 0 ?
            <dd>
                <Input
                    ref="payment"
                    onChange={val => this.handleInputChange(val, "payment")}
                    placeholder="请输入配送费"
                />
                <div className="comment-wrapper">
                    <Button
                        onClick={() => this.handleShopAcceptOrder(order)}>接单</Button>
                </div>
            </dd> :
            <dd>
                <div>
                        <span className="status" status={orderStatus}
                              onClick={(e) => this.handleShowComment(e, order.oid)}>
                        {
                            orderStatus === 1 ? '待配送' : (orderStatus === 2
                                ?
                                <div className="comment-wrapper">
                                    <Button
                                        onClick={(e) => this.handleDeliveryInfo(e, order)}>查看详情</Button>
                                </div>
                                : (orderStatus === 3 ? '待评价' : '已完成'))
                        }
                        </span>
                </div>
            </dd>
    }

    // 处理用户订单状态显示
    handleUserStatus = (order, orderStatus) => {
        // 为用户时 待评价显示按钮
        return orderStatus === 3 ?
            <dd>
                <div className="comment-wrapper">
                    <Button
                        onClick={() => this.handleBeforeComment(order.oid)}>评价订单</Button>
                </div>
            </dd> :
            <dd>
                <div>
                        <span className="status" status={orderStatus}
                              onClick={(e) => this.handleShowComment(e, order.oid)}>
                        {
                            orderStatus === 0 ? '待接单' : (orderStatus === 1 ? '待配送' : (orderStatus === 2 ?
                                <div className="comment-wrapper">
                                    <Button
                                        onClick={(e) => this.handleDeliveryInfo(e, order)}>查看详情</Button>
                                </div>
                                : '已完成'))
                        }
                        </span>
                </div>
            </dd>
    }

    // 处理配送员主动完成订单
    handleFinishOrder = async (oid) => {
        // 更新订单表和挂单表的状态
        const {data: {status, data: {data: updateCount}}} = await patchHangOrderStatus(oid, 2)
        if (status === 0 && updateCount === 1) {
            // 余额增加
            Notification({
                message: "送达成功",
                type: "success"
            })
        }
    }

    // 处理展示评论
    handleShowComment = async (e, oid) => {
        if (parseInt(e.target.getAttribute("status")) < 3) {
            return
        }
        switch (parseInt(localStorage.getItem("roleId"))) {
            case 0:
                const {data: {status, data: {data: commentList}}} = await reqOrderUserComment(oid, localStorage.getItem("userId"))
                if (status === 0) {
                    this.setState({
                        commentList
                    }, () => {
                        this.setState({showCommentDialog: true})
                    })
                }
                break
            case 1:
                const {data: {status: shopStatus, data: {data: shopComment}}} = await reqOrderShopComment(oid, localStorage.getItem("shopId"))
                if (shopStatus === 0) {
                    this.setState({
                        readComment: shopComment
                    }, () => {
                        this.setState({showCommentDialog: true})
                    })
                }
                break
            case 2:
                const {data: {status: deliStatus, data: {data: deliComment}}} = await reqOrderDeliComment(oid, localStorage.getItem("deliId"))
                if (deliStatus === 0) {
                    this.setState({
                        readComment: deliComment
                    }, () => {
                        this.setState({showCommentDialog: true})
                    })
                }
        }
    }

    // 配送员接单
    handleDeliReceiveOrder = (oid) => {
        console.log(oid)
    }

    // 处理配送员订单状态显示
    handleDeliStatus = (oid, orderStatus) => {
        // 为配送员时 配送中显示按钮
        // 默认0 ->表示未有人接单（无需显示）  1-> 配送中（显示'完成订单'按钮）  2-> 待评价（配送员主动完成之后） 3-> 已完成 用户评价完成之后
        return orderStatus === 1 ?
            <dd>
                <div className="comment-wrapper">
                    {/* 完成的时候 需要修改两张表的数据 s_order需要修改成待评价 status 3 hang_up_order status 也需要修改成2 */}
                    <Button
                        onClick={() => this.handleFinishOrder(oid)}>完成订单</Button>
                </div>
            </dd> : (
                <dd>
                    <p>
                        <span className="status" status={orderStatus} onClick={(e) => this.handleShowComment(e, oid)}>
                        {
                            orderStatus === 2 ? '待评价' : (orderStatus === 3 ? '查看评价' : '')
                        }
                        </span>
                    </p>
                </dd>
            )

    }

    // 处理tabPane页面显示
    handleTest = (status, roleId) => {
        return this.state.orderList.length > 0 ? this.state.orderList.map(order => (
            <ul key={order.oid}>
                <li className="m-order-item">
                    <dl className="section">
                        {
                            roleId === 2 ?
                                <Fragment>
                                    <dt style={{marginTop: -10}}>
                                        <img src={require(`../../assets/images/${order.g_img}`)}
                                             className="order-auto-image"
                                             alt="商家图片"/>
                                    </dt>
                                    <dd style={{marginTop: -10}}>
                                        <span className="label-tip">商品名称：</span><h3
                                        style={{margin: '4px 0', width: 130}}
                                        onClick={() => this.props.history.push(`/detail/${order.sid}`)}>{order.g_name}</h3>
                                        <p style={{margin: '0 0'}}>
                                            <span className="label-tip">商品数量：</span><span
                                            className="s-item-addr">{order.g_count}</span>
                                        </p>
                                        <p style={{margin: '4px 0'}}>
                                            <span className="label-tip">商品价格：</span><span
                                            className="s-item-addr">￥{order.price}</span>
                                        </p>
                                        <p style={{margin: '4px 0'}}>
                                            <span className="label-tip">商品总价：</span><span
                                            className="s-item-addr">￥{order.total}</span>
                                        </p>
                                        <p style={{margin: '0 0'}}>
                                            <span className="label-tip">配送费：</span><em
                                            className="s-item-price">￥{order.payment}</em>
                                        </p>
                                    </dd>
                                    <dd>
                                        <span className="label-tip">用户真实姓名：</span><h3
                                        style={{width: 140, margin: '0 0'}}
                                        onClick={() => this.handleSearchUserInfo()}>{order.u_name}</h3>
                                        <p>
                                            <span className="label-tip">用户地址：</span><span
                                            className="s-item-addr">{order.u_address}</span>
                                        </p>
                                        <p>
                                            <span className="label-tip">用户手机号：</span><span
                                            className="s-item-addr">{order.u_phone}</span>
                                        </p>
                                    </dd>
                                    <dd>
                                        <span className="label-tip">商家名称：</span><h3 style={{width: 130, margin: '0 0'}}
                                                                                    onClick={() => this.handleSearchShopInfo()}>{order.s_name}</h3>
                                        <p>
                                            <span className="label-tip">商家地址：</span><span
                                            className="s-item-addr">{order.s_address}</span>
                                        </p>
                                        <p>
                                            <span className="label-tip">商家手机号：</span><span
                                            className="s-item-addr">{order.s_phone}</span>
                                        </p>
                                    </dd>
                                </Fragment> :
                                <Fragment>
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
                                </Fragment>

                        }

                        {
                            roleId === 0 ? this.handleUserStatus(order, order.status) : (
                                roleId === 1 ? this.handleShopStatus(order, order.status) :
                                    this.handleDeliStatus(order.oid, order.status)
                            )

                        }
                    </dl>
                </li>
            </ul>
        )) : <div>暂无内容</div>
    }


    // 处理tab标签循环
    handleTabStatus = (roleId) => {
        return roleId === 0 ?
            this.state.tabArray.map((item) => {
                    return item.index.startsWith("1") ?
                        <Tabs.Pane
                            name={item.name}
                            label={item.name}
                            key={item.index}
                            orderList={this.state.orderList}
                        >{this.handleTest(this.state.status, roleId)}</Tabs.Pane> : null
                }
            ) : (roleId === 1 ?
                    this.state.shopTabArray.map((item) => {
                            return item.index.startsWith("1") ?
                                <Tabs.Pane
                                    name={item.name}
                                    label={item.name}
                                    key={item.index}
                                    orderList={this.state.orderList}
                                >{this.handleTest(this.state.status, roleId)}</Tabs.Pane> : null
                        }
                    ) :
                    this.state.deliTabArray.map((item) => {
                            return item.index.startsWith("1") ?
                                <Tabs.Pane
                                    name={item.name}
                                    label={item.name}
                                    key={item.index}
                                    orderList={this.state.orderList}
                                >{this.handleTest(this.state.status, roleId)}</Tabs.Pane> : null
                        }
                    )
            )
    }

    render() {
        const {selectedIndex} = this.props.asideTab
        const roleId = parseInt(localStorage.getItem("roleId"))
        return (
            <Layout.Row style={{backgroundColor: '#F8F8F8'}}>
                <Layout.Col span={4} push={3} style={{marginLeft: -25}}>
                    <Menu onSelect={this.handleSelect} defaultActive="1" defaultOpeneds={['1']}
                          className="el-menu-vertical-demo">
                        <Menu.SubMenu
                            style={{height: 385}}
                            index="1"
                            title={<span><i className="el-icon-message"/>我的订单</span>}>
                            {
                                this.handleOrdersStatus(roleId, selectedIndex, true)
                            }
                        </Menu.SubMenu>
                        {
                            this.handleOrdersStatus(roleId, selectedIndex, false)
                        }
                    </Menu>
                </Layout.Col>
                <Layout.Col span={13} push={4}>
                    <div className="m-order-list">
                        <Tabs activeName={this.props.asideTab.tabName} onTabClick={this.handleTabClick}>
                            {
                                this.handleTabStatus(roleId)
                            }
                        </Tabs>
                    </div>
                    <Dialog
                        title="评价信息"
                        visible={this.state.showCommentDialog}
                        onCancel={() => this.setState({showCommentDialog: false})}
                        lockScroll={false}
                    >
                        <Dialog.Body>
                            {
                                this.state.commentList.length > 0 ? (
                                    this.state.commentList.map((comment, index) => (
                                        <CommentForm
                                            key={index}
                                            comment={comment}
                                        />
                                    ))
                                ) : (Object.keys(this.state.readComment).length > 0 ?
                                        <CommentForm
                                            comment={this.state.readComment}
                                        />
                                        :
                                        <CommentForm
                                            handleInputChange={this.handleInputChange}
                                            comment={this.state.comment}
                                        />
                                )
                            }
                            {/*<Form model={this.state.comment}>
                                <span className="comment-title">评价商家：</span>
                                <Form.Item label="评分" labelWidth="120">
                                    <Rate value={this.state.comment.s_rating - 1}
                                          showText={true}
                                          onChange={(val) => this.handleInputChange(val, 's_rating')}
                                    />
                                </Form.Item>
                                <Form.Item label="评价内容" labelWidth="120">
                                    <Input value={this.state.comment.s_content}
                                           onChange={(val) => this.handleInputChange(val, 's_content')}/>
                                </Form.Item>
                                <span className="comment-title">评价配送员：</span>
                                <Form.Item label="评分" labelWidth="120">
                                    <Rate value={this.state.comment.d_rating - 1}
                                          showText={true}
                                          onChange={(val) => this.handleInputChange(val, 'd_rating')}
                                    />
                                </Form.Item>
                                <Form.Item label="评价内容" labelWidth="120">
                                    <Input value={this.state.comment.d_content}
                                           onChange={(val) => this.handleInputChange(val, 'd_content')}/>
                                </Form.Item>
                            </Form>*/}
                        </Dialog.Body>

                        <Dialog.Footer className="dialog-footer">
                            <Button onClick={() => this.setState({showCommentDialog: false})}>取 消</Button>
                            <Button type="primary" onClick={this.handleComment}>确 定</Button>
                        </Dialog.Footer>
                    </Dialog>
                    <Dialog
                        title="配送员信息"
                        visible={this.state.showDeliveryDialog}
                        onCancel={() => this.setState({showDeliveryDialog: false})}
                        lockScroll={false}
                    >
                        <Dialog.Body>

                            <Form>
                                <span className="comment-title">配送员信息：</span>
                                <Form.Item label="真实姓名" labelWidth="120">
                                    <Input value={this.state.delivery.r_name}
                                           disabled={true}
                                    />
                                </Form.Item>
                                <Form.Item label="手机号" labelWidth="120">
                                    <Input value={this.state.delivery.b_user.phone}
                                           disabled={true}
                                    />
                                </Form.Item>
                            </Form>
                        </Dialog.Body>

                        <Dialog.Footer className="dialog-footer">
                            <Button type="primary" onClick={() => this.setState({showDeliveryDialog: false})}>确
                                定</Button>
                        </Dialog.Footer>
                    </Dialog>
                </Layout.Col>
            </Layout.Row>
        )
    }
}

export default withRouter(
    connect(
        state => ({asideTab: state.asideTab}),
        {
            receiveSelectedIndex,
            receiveTabName
        }
    )(Order)
)
