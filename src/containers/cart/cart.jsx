import React, {Component} from 'react';
import {
    Layout,
    Notification,
    MessageBox,
    Message
} from 'element-react'
import CartItem from '../../components/cart-item/cart-item'
import './cart.css'
import CartFooter from "../../components/cart-footer/CartFooter";
import {connect} from "react-redux";
import {
    reqCart,
    updateCart
} from '../../redux/actions'
import {
    isObjEqual
} from '../../utils/localStorage'

import {
    delShopCart
} from '../../api'

class Cart extends Component {

    componentDidMount() {
        // 发请求获取购物车数据
        if(localStorage.getItem("userId")){
            this.props.reqCart(localStorage.getItem("userId"))
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let newPropsCart = nextProps.shoppingCart.map((cart) => ({...cart,isChecked: false}))
        this.setState({
            cartList: newPropsCart,
            oldCartList: [...newPropsCart],
        })
    }

    /*componentWillUnmount() {
        // 判断购物车是否被修改过
        console.log('altered', this.state.cartList)
        console.log('old', this.state.oldCartList)
        console.log('props', this.props.shoppingCart)
        const { length: cartListLength = 0 } = this.state.cartList
        const { length: oldCartListLength = 0 } = this.props.shoppingCart
        // 数组长度不相等
        if(cartListLength !== oldCartListLength){
            // 发请求修改购物车数据
            MessageBox.confirm('此操作尚未保存，是否保存并继续?', '提示', {
                type: 'warning'
            }).then(() => {
                this.handleChangeCart()
            }).catch(() => {
                Message({
                    type: 'info',
                    message: '已取消保存'
                });
            });
            return
        }
        // 数组长度相等
        let haveChecked = []
        for(let i = 0; i < cartListLength; i ++){
            delete this.state.cartList[i]['isChecked']
            delete this.props.shoppingCart[i]['isChecked']
            delete this.state.cartList[i]['totalPrice']
            delete this.props.shoppingCart[i]['totalPrice']
            haveChecked.push(isObjEqual(this.state.cartList[i], this.props.shoppingCart[i]))
        }
        // 全部true才返回true
        const result = haveChecked.every(item => item === true)
        if(!result){
            // 发请求修改购物车数据
            MessageBox.confirm('此操作尚未保存，是否继续?', '提示', {
                type: 'warning'
            }).then(() => {
                this.handleChangeCart()
            }).catch(() => {
                Message({
                    type: 'info',
                    message: '已取消保存'
                });
            });
        }
    }*/

    constructor(props) {
        super(props);
        this.state = {
            cartList: [],
            isCheckAll: false,
            totalPrice: 0,
        }
    }

    handleChangeCart = () => {
        let newCartList = [...this.state.cartList]
        for(let i =0; i < newCartList.length; i++){
            delete newCartList[i]['isChecked']
            delete newCartList[i]['totalPrice']
        }
        this.setState({
            cartList: newCartList
        })
        this.props.updateCart(localStorage.getItem('userId'), this.state.cartList)
    }

    // 处理全选功能
    handleCheckAll = () => {
        // 修改状态
        this.setState(({
            isCheckAll: !this.state.isCheckAll
        }))

        // 改变列表每一项的状态
        this.state.cartList.map((item) => {
            item.isChecked = !this.state.isCheckAll
        })

        // 计算已选中商品的总价并改变总价状态
        this.setState({
            totalPrice: this.handleTotalPrice()
        })

        console.log(' after check all cartList: ', this.state.cartList)
    }


    // 处理商品单选
    handleCheck = (e, index) => {

        /*
         *选中商品时,更新选中对应项的选中状态,更新商品信息状态,接着读取每一项商品的选中状态,
         * 如果每一项都选中则全选状态为true,反之亦然.最后根据选中项,更新总价状态
         */

        // 不直接改变state数组的状态
        let  newCartList = [...this.state.cartList]

        // 处理选中项的check状态
        newCartList[index].isChecked = e.target.checked

        // 改变state中的cartList的状态
        this.setState({
            cartList: newCartList
        })

        // 暂时缓存商品选中状态
        let checkedCache = []

        // 检查每一项商品的选中状态
        this.state.cartList.forEach((item) => {
            checkedCache.push(item.isChecked)
        })

        console.log('After Single Checked checkedCache', checkedCache)

        // 改变全选状态
        this.setState({
            isCheckAll: checkedCache.every(isChecked => isChecked)
        }, ()=> {
            console.log('After Single Check isCheckAll', this.state.isCheckAll)
            // 计算已选中商品的总价并改变总价状态
            this.setState({
                totalPrice: this.handleTotalPrice()
            })
        })


    }

    // 处理商品数量增加
    handlePlus = (e, index) => {
        // 直接增加即可

        // 1 生成一个新数组
        let  newCartList = [...this.state.cartList]
        // 2. 改变数量
        newCartList[index].count += 1
        // 3. 改变该商品总价
        newCartList[index].totalPrice += newCartList[index].price
        // 4. 改变商品状态
        this.setState({
            cartList: newCartList
        })

        // 改变购物车总价
        this.setState({
            totalPrice: this.handleTotalPrice()
        })

    }

    // 处理商品数量减少
    handleReduce = (e, index) => {
        // 判断商品数量是否等于1
        // 1. 复制一个新数组
        let  newCartList = [...this.state.cartList]
        const {count} = newCartList[index]
        if(count === 1){
            // 从购物车中删除
            newCartList = newCartList.filter((item, idx) => idx !== index)
            this.setState({
                cartList: newCartList
            })
        }else{
            // 2. 改变数量
            newCartList[index].count -= 1
            // 3. 改变该商品总价
            newCartList[index].totalPrice -= newCartList[index].price
            // 4. 改变商品状态
            this.setState({
                cartList: newCartList
            })

            // 改变购物车总价
            this.setState({
                totalPrice: this.handleTotalPrice()
            })
        }
    }

    // 处理总价计算
    handleTotalPrice = () => {
        let totalPrice = 0
        this.state.cartList.forEach((item) => {
            if (item.isChecked) {
                totalPrice += item.price * item.count
            }
        })
        console.log( 'totalPrice' ,totalPrice)
        return totalPrice
    }

    // 单个商品数量改变
    handleChange = (e, index) => {
        // 获取输入的值
        let value = e.target.value.replace(/\s/g, '')
        console.log('去掉空格之后', value)
        // 检查是否为数字和正整数
        if(!/^[0-9]+$/.test(value)){
            Notification.error({
                message: '请输入大于0的数字'
            });
        }else{
            // 通过验证
            // 1. 复制一个新数组
            let  newCartList = [...this.state.cartList]
            // 2. 改变newCartList中的count值
            newCartList[index].count = value
            // 3. 改变该商品总价
            newCartList[index].totalPrice = newCartList[index].price * newCartList[index].count
            // 4. 改变商品状态
            this.setState({
                cartList: newCartList
            })

            // 改变购物车总价
            this.setState({
                totalPrice: this.handleTotalPrice()
            })
        }
    }

    // 判断是否有选中的商品
    handleHaveChecked = () => {
        // 暂时缓存商品选中状态
        let haveChecked = []

        this.state.cartList.forEach((item) => {
            haveChecked.push(item.isChecked)
        })

        // 有一个true就返回
        return haveChecked.some(item => item === true)
    }

    // 判断选中数量
    handleSelectedCount = () => {
        let count = 0
        this.state.cartList.forEach((item) => {
            if(item.isChecked){
                count += 1
            }
        })
        console.log('count',count)
        return count
    }

    // 移除单个商品/多个商品/未选中商品(数量由1->0)
    handleRemove = async () => {
        if(this.handleHaveChecked()){
            let newCartList = [...this.state.cartList]
            let shouldDeleteCartIds = []
            this.state.cartList.forEach((item, index) => {
                if(item.isChecked){
                    newCartList = newCartList.filter((ele) => item !== ele)
                    shouldDeleteCartIds.push(item.cid)
                }
            })
            console.log("---------shouldDeleteCarts", shouldDeleteCartIds)
            console.log('---------newCartList',newCartList)
            // 1. newCartList 是剩下的购物车商品 this.state.cartList 是之前的商品

            const {data: {status, data, message}} = await delShopCart(localStorage.getItem("userId"), shouldDeleteCartIds)
            console.log(status)
            console.log(data)
            console.log(message)

            this.setState({
                cartList: newCartList,
            }, () => {
                console.log('---------cartList',this.state.cartList)
                this.setState({
                    totalPrice: this.handleTotalPrice()
                })
            })
        }else{
            Notification.error({
                message: '请选中一件商品'
            });
        }
    }

    // 保存购物车
    handleBuy = () => {
        this.handleChangeCart()
        /*if(this.handleHaveChecked()){
            MessageBox.prompt('请输入支付密码', '', {
                inputPattern: /^\d{6}$/,
                inputErrorMessage: '支付密码为6位数字',
                inputType: 'password'
            }).then(({ value }) => {
                /!*Message({
                    type: 'success',
                    message: '你的支付密码是: ' + value
                });*!/
                console.log('success')
            }).catch(() => {
                Message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        }else{
            Notification.error({
                message: '请选择一项商品'
            });
        }*/
    }


    render() {
        if(this.props.shoppingCart.length <= 0){
            return null
        }else {
            return (
                <Layout.Col span={14} push={4} className="m-cart">
                    <table id="cartTable">
                        <thead>
                        <tr>
                            <th><label><input
                                className="check-all check"
                                type="checkbox"
                                checked={this.state.isCheckAll}
                                onChange={this.handleCheckAll}
                            />&nbsp;全选</label></th>
                            <th>商品</th>
                            <th>单价</th>
                            <th>数量</th>
                            <th>小计</th>
                            <th>操作</th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            this.state.cartList.map((item, index) => (
                                <CartItem
                                    key={index}
                                    img={item.img}
                                    name={item.name}
                                    price={item.price}
                                    count={item.count}
                                    totalPrice={item.price * item.count}
                                    isChecked={item.isChecked}
                                    handleChange={e => this.handleChange(e, index)}
                                    handleCheck={e => this.handleCheck(e, index)}
                                    handlePlus={e => this.handlePlus(e, index)}
                                    handleReduce={e => this.handleReduce(e, index)}
                                    handleRemove={this.handleRemove}

                                />
                            ))
                        }
                        </tbody>
                    </table>
                    <CartFooter totalPrice={this.state.totalPrice}
                                handleRemove={this.handleRemove}
                                handleBuy={this.handleBuy}
                                handleCouldBuy={this.handleHaveChecked}
                                handleSelectedCount={this.handleSelectedCount}
                    />
                </Layout.Col>
            )
        }

    }
}

export default connect(
    state => ({shoppingCart: state.shoppingCart}),
    {
        reqCart,
        updateCart
    }
)(Cart)
