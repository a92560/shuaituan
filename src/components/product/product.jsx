import React, {Component} from 'react';
import ProductItem from '../../components/product-item/product-item'
import './product.css'
import {
    connect
} from "react-redux";
import {
    reqCart,
    updateCart
} from '../../redux/actions'
import {
    addShoppingCart,
    reqUploadPic,
    reqUploadPics,
    addShopGoods,
    updGoodsInfo,
    delGoodsInfo, reqGoodInfo
} from '../../api'
import {
    withRouter
} from 'react-router-dom'
import {
    Button,
    Dialog,
    Form,
    Input,
    Upload,
    Message,
    Notification,
    MessageBox
} from "element-react";

class Product extends Component {
    constructor(props) {
        super(props)
        this.state = {
            shouldAddGoods: {
                name: '', // 商品名称
                price: '', // 商品价格
                count: 1, // 商品数量
                img: '', // 商品图片
            },
            shouldDialogVisible: false,
            fileList: [],
            goodsOperation: false,
            gid: '', //商品编号
        };
    }


    componentDidMount() {
        if(localStorage.getItem("userId") && !(this.props.shoppingCart.length < 0) ){
            this.props.reqCart(localStorage.getItem('userId'))
        }
    }

    // 处理添加购物车
    handleToAddCart = async (product) => {
        // 判断购物车里是否有这个gid
        if (this.props.shoppingCart.some(cart => (cart.gid === product.gid))) {
            // 购物车里包含该商品
            // 发请求数量 +1
            console.log('enter')
            let shouldUpdateCart = this.props.shoppingCart.filter(cart => cart.gid === product.gid)
            delete shouldUpdateCart['isChecked']
            delete shouldUpdateCart['totalPrice']
            shouldUpdateCart[0].count += 1
            this.props.updateCart(localStorage.getItem('userId'), shouldUpdateCart)
            this.props.reqCart(localStorage.getItem('userId'))
            Notification({
                title: '成功',
                message: '添加购物车成功',
                type: 'success'
            });
        } else {
            // 购物车里不包含该商品
            // 发请求添加一条新记录
            const uid = localStorage.getItem("userId")
            let cartList = {
                uid: uid,
                gid: product.gid,
                img: product.img,
                count: 1,
                price: product.price,
                name: product.name
            }
            const {data: {status, data: {data: count}}} = await addShoppingCart(uid, cartList)
            if (status === 0) {
                console.log('success')
                console.log(count)
                Notification({
                    title: '成功',
                    message: '添加购物车成功',
                    type: 'success'
                });
                this.props.reqCart(localStorage.getItem('userId'))
            }
        }
    }

    // 处理购买商品
    handleToBuy = (shopId, gid) => {
        this.props.history.push(`/shop/${shopId}/buy/${gid}`)
    }

    // 处理添加商品
    handleAddShopGoods = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        // 1. 发送图片上传请求
        console.log(this.props)
        const {shopId = '100000'} = this.props.match.params
        let formData = new FormData()
        const shouldSendPic = this.state.raw
        console.log('raw', this.state.raw)
        formData.append("file", shouldSendPic)
        const {data: {status, message}} = await reqUploadPic(shopId, formData)
        this.setState({shouldDialogVisible: false})
        if(status === '0' && message === 'success'){
            // 2. 发送goods数据请求
            const {data: {status, message, data }} = await addShopGoods(shopId, this.state.shouldAddGoods);
            if(status === 0 && data.data === 1){
                Notification({
                    title: '成功',
                    message: '添加商品成功',
                    type: 'success'
                });
            }else{
                Notification.error({
                    title: '错误',
                    message
                });
            }
        }else{
            Notification.error({
                title: '错误',
                message: "请添加图片"
            });
        }


    }

    // 输入框输入
    handleInputChange = (val, name) => {
        this.setState({
            shouldAddGoods: {...this.state.shouldAddGoods, ...{[name]: val}}
        })
    }

    // 文件改变
    async handleChange(file, fileList) {
        console.log(fileList)
        console.log(file)
        this.setState({
            raw: fileList[0] && fileList[0].raw
        })
        if(fileList.length>=3){
            let formData = new FormData()
            const shouldSendPics = fileList.map(file => file.raw)
            console.log(shouldSendPics)
            formData.append('file',shouldSendPics)
            const {data: {status, data}} = await reqUploadPics(formData)
            console.log(status)
            console.log(data)
        }
    }

    // 处理编辑商品，修改数量价格
    handleToEditGoods = async (gid) => {
        const {data: {status , data: { data: goodsList}}} = await reqGoodInfo(gid)
        const {name, price, count} = goodsList[0]
        this.setState({
            goodsOperation: true,
            shouldDialogVisible: true,
            shouldAddGoods: {...this.state.shouldAddGoods, ...{name, price, count}},
            gid
        })
    }

    handleUpdateGoods = async (gid) => {
        const {name, price, count} = this.state.shouldAddGoods
        const {data: {status, data: {data}}} = await updGoodsInfo(gid,{name, price, count, gid: gid})
        if(status === 0 && data === 1){
            alert("更新商品信息成功")
            window.location.reload()
        }
    }

    // 处理删除商品
    handleToDeleteGoods = async (gid) => {
        const {data: {status, data: {data}}} = await delGoodsInfo(gid)
        if(status === 0 && data === 1){
            alert("删除商品成功")
            window.location.reload()
        }
    }

    render() {
        // 坑 刚注册的商家还没添加商品
        /*if (!this.props.productList || this.props.productList.length <= 0) {
            return null
        }*/
        const {shopId} = this.props.match.params
        const {fileList} = this.state
        const isShopperSelf = localStorage.getItem("shopId") === this.props.match.params.shopId
        return (
            <div>
                <div className="m-detail-list">
                    <ul>
                        <div className="add-goods">
                            <Button
                                type="primary"
                                onClick={() => this.setState({shouldDialogVisible: true})}
                                style={{display: isShopperSelf ? "inline-block" : "none"}}
                            >
                                添加商品
                            </Button>
                        </div>
                        <li>共{this.props.productList.length && this.props.productList.length}款商品</li>
                        {
                            this.props.productList.map((product, index) => (
                                <ProductItem
                                    key={index}
                                    gid={product.gid}
                                    name={product.name}
                                    price={product.price}
                                    count={product.count}
                                    img={product.img}
                                    sell_count={product.sell_count}
                                    good_rating={product.good_rating}
                                    handleToAddCart={() => this.handleToAddCart(product)}
                                    handleToBuy={() => this.handleToBuy(shopId, product.gid)}
                                    handleToEditGoods={() => this.handleToEditGoods(product.gid)}
                                    handleToDeleteGoods={() => this.handleToDeleteGoods(product.gid)}
                                    isShopperSelf={this.props.match.params.shopId === localStorage.getItem("shopId")}
                                />
                            ))
                        }
                    </ul>
                </div>
                <Dialog
                    title="商品信息"
                    visible={this.state.shouldDialogVisible}
                    top="30px"
                    size="small"
                    onCancel={() => this.setState({shouldDialogVisible: false})}
                >
                    <Dialog.Body>
                        <Form model={this.state.shouldAddGoods}>
                            <Form.Item label="商品名称" labelWidth="120">
                                <Input value={this.state.shouldAddGoods.name} onChange={(val) =>this.handleInputChange(val, 'name')}/>
                            </Form.Item>
                            <Form.Item label="商品数量" labelWidth="120">
                                <Input value={this.state.shouldAddGoods.count} onChange={(val) =>this.handleInputChange(val, 'count')}/>
                            </Form.Item>
                            <Form.Item label="商品价格" labelWidth="120">
                                <Input value={this.state.shouldAddGoods.price} onChange={(val) =>this.handleInputChange(val, 'price')}/>
                            </Form.Item>
                            {
                                !this.state.goodsOperation ? <Form.Item label="图片上传" labelWidth="120">
                                    <Upload
                                        className="upload-demo"
                                        action="//jsonplaceholder.typicode.com/posts/"
                                        onChange={(file, fileList) => this.handleChange(file, fileList)}
                                        fileList={fileList}
                                        listType="picture"
                                        limit={2}
                                        onExceed={(files, fileList) => {
                                            Message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                                        }}
                                        tip={<div className="el-upload__tip">只能上传一张jpg/png文件，且不超过500kb</div>}
                                    >
                                        <Button size="small" type="primary">点击上传</Button>
                                    </Upload>
                                </Form.Item> : null
                            }
                        </Form>

                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({shouldDialogVisible: false})}>取 消</Button>
                        <Button onClick={ !this.state.goodsOperation ? this.handleAddShopGoods : () => this.handleUpdateGoods(this.state.gid)}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
            </div>
        )
    }
}

export default withRouter(
    connect(
        state => ({shoppingCart: state.shoppingCart}),
        {
            reqCart,
            updateCart
        }
    )(Product)
)