import React, {Component} from 'react';
import {
    Rate,
    Carousel,
    Button,
    Dialog,
    Input,
    Upload,
    Form,
    Message,
    TimeSelect
} from "element-react";
import {
    formatDate
} from "../../utils/localStorage";
import {
    connect
} from 'react-redux'
import {
    withRouter
} from 'react-router-dom'

import './shop-info.css'
import {postShopImgList, updateShopInfo} from "../../api";

class ShopInfo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
            shouldDialogVisible: false,
            shop: {
                name: '',
                address: '',
                phone: '',
                open_time: '',
                end_time: '',
                img_list: '',
            },
        }
    }


    componentWillReceiveProps(nextProps, nextContext) {
        console.log(nextProps)
        const {name, rating, average_cost, address, phone, open_time, end_time, img_list} = nextProps.shopDetail
        this.setState({
            shop:{name, address, phone, open_time, end_time, img_list}
        })
    }

    // 更新商家信息
    handleConfirmUpdate = async () => {
        // 先上传图片，返回img_list的值
        if(this.state.fileList.length <= 0){
            let {img_list, name, address, open_time, end_time, phone} = this.state.shop
            const {data: {status, data: {data: updateCount}}} = await updateShopInfo(localStorage.getItem("shopId"), {img_list, name, address, open_time, end_time, phone})
            if(status === 0 && updateCount === 1){
                alert("更新成功")
                window.location.reload()
            }else{
                alert("fail")
            }
            return
        }
        let formData = new FormData()
        this.state.fileList.forEach(file => formData.append("file", file.raw))
        const {data: {msg, imgListStr}} = await postShopImgList(localStorage.getItem("shopId"), formData)
        if(msg === 'success'){
            this.setState({
                shop: {...this.state.shop, ...{img_list: imgListStr.substring(0 ,imgListStr.length - 1)}}
            }, async () => {
                let {img_list, name, address, open_time, end_time, phone} = this.state.shop
                const {data: {status, data: {data: updateCount}}} = await updateShopInfo(localStorage.getItem("shopId"), {img_list, name, address, open_time, end_time, phone})
                if(status === 0 && updateCount === 1){
                    alert("更新成功")
                    window.location.reload()
                }else{
                    alert("fail")
                }
            })
        }
    }

    // 输入框改变值
    async handleChange(file, fileList) {
        this.setState({
            fileList
        })
    }

    // 输入框输入
    handleInputChange = (val, name) => {
        this.setState({
            shop: {...this.state.shop, ...{[name]: val}}
        })
    }

    // 显示弹窗
    handleUpdateShop = () => {
        this.setState({
            shouldDialogVisible: true
        })
    }


    render() {
        if (Object.keys(this.props.shopDetail).length <= 0) {
            return null
        }
        const {fileList} = this.state
        const {name, rating, average_cost, address, phone, open_time, end_time, img_list} = this.props.shopDetail
        return (
            <dl className="m-sum-card">
                <dt>
                    <h1>{name}</h1>
                    <Button type="primary"
                            style={{float: "right", display: localStorage.getItem("shopId") === this.props.match.params.shopId ? "inline-block" : "none"}}
                            onClick={this.handleUpdateShop}

                    >
                        编辑资料
                    </Button>
                    <Rate disabled={true} value={rating} showText={true}/>
                    <span>人均￥{average_cost}元</span>
                    <ul>
                        <li>地址： {address}</li>
                        <li>电话： {phone}</li>
                        <li>营业时间： {open_time} - {end_time}</li>
                    </ul>
                </dt>
                <dd>
                    {
                        img_list ?
                            <Carousel interval="3000" arrow="always" style={{height: 214}}>
                                {
                                    img_list.split(',').map((img, index) => {
                                        return (
                                            <Carousel.Item key={index}>
                                                <h3>
                                                    <img src={require(`../../assets/images/${img}`)} alt="商家展示"
                                                         className="autoImage"/>
                                                </h3>
                                            </Carousel.Item>
                                        )
                                    })
                                }
                            </Carousel>
                            :
                            null
                    }

                </dd>
                <Dialog
                    title="商品信息"
                    visible={this.state.shouldDialogVisible}
                    top="30px"
                    size="small"
                    onCancel={() => this.setState({shouldDialogVisible: false})}
                >
                    <Dialog.Body>
                    <Form model={this.state.shop}>
                        <Form.Item label="商家名称" labelWidth="120">
                            <Input value={this.state.shop.name} onChange={(val) =>this.handleInputChange(val, 'name')}/>
                        </Form.Item>
                        <Form.Item label="商家地址" labelWidth="120">
                            <Input value={this.state.shop.address} onChange={(val) =>this.handleInputChange(val, 'address')}/>
                        </Form.Item>
                        <Form.Item label="商家手机号" labelWidth="120">
                            <Input value={this.state.shop.phone} onChange={(val) =>this.handleInputChange(val, 'phone')}/>
                        </Form.Item>
                        {
                            !img_list ? <Form.Item label="商家图片展示" labelWidth="120">
                                <Upload
                                    className="upload-demo"
                                    action="//jsonplaceholder.typicode.com/posts/"
                                    onChange={(file, fileList) => this.handleChange(file, fileList)}
                                    fileList={fileList}
                                    listType="picture"
                                    limit={4}
                                    multiple={true}
                                    onExceed={(files, fileList) => {
                                        Message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                                    }}
                                    tip={<div className="el-upload__tip">只能上传四张jpg/png文件，且不超过500kb</div>}
                                >
                                    <Button size="small" type="primary">点击上传</Button>
                                </Upload>
                            </Form.Item> : null
                        }
                        <Form.Item label="营业时间" labelWidth="120">
                            <Input value={this.state.shop.open_time}
                                   style={{display: "inline-block", width: 120}}
                                   onChange={(val) =>this.handleInputChange(val, 'open_time')}
                                   placeholder="00:00:00"
                            />--
                            <Input value={this.state.shop.end_time}
                                   style={{display: "inline-block", width: 120}}
                                   onChange={(val) =>this.handleInputChange(val, 'end_time')}
                                   placeholder="00:00:00"
                            />
                        </Form.Item>
                    </Form>

                </Dialog.Body>
                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={() => this.setState({shouldDialogVisible: false})}>取 消</Button>
                        <Button onClick={()=> this.handleConfirmUpdate(name,address, phone, open_time, end_time, img_list)}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
            </dl>
        )
    }
}

export default withRouter(
    connect(
        state => ({shopDetail: state.shopDetail})
    )(ShopInfo)
)