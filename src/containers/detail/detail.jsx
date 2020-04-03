import React, {Component} from 'react';
import {
    connect
} from 'react-redux'
import {
    Layout,
    Button
} from 'element-react'
import {
    withRouter
} from 'react-router-dom'
import {
    reqShop
} from "../../redux/actions";
import {
    reqShopGoods,
    reqShopComments
} from '../../api'


import ShopInfo from '../../components/shop-info/shop-info'
import Product from '../../components/product/product'
import Comment from '../../components/comment/comment.jsx'
import Loading from '../../components/loading/loading'
import './detail.css'

class Detail extends Component {
    constructor(props){
        super(props)
        this.state = {
            productList: [],
            commentList: []
        }
    }

    async componentDidMount() {
        const {shopId = '100000'} = this.props.match.params
        // 获取商家详情
        this.props.reqShop(shopId)
        // 获取商家商品详情
        const { data: {status, data: {data: productList}}} = await reqShopGoods(shopId)
        if(status === 0){
            this.setState({
                productList
            })
        }
        // 获取商家评论
        const { data: {status: statusCode, data: {data: commentList}}} = await reqShopComments(shopId)
        if(statusCode === 0){
            console.log(commentList)
            this.setState({
                commentList: commentList,
                commentLength: commentList.length
            })
        }

    }

    render() {
        /*if((this.state.commentList.length <= 0) || (this.state.productList.length <= 0)){
            return <Loading/>
        }*/
        return (
            <div style={{backgroundColor: '#F8F8F8'}}>
                <div className="page-detail">
                    <Layout.Row>
                        <Layout.Col>
                            <ShopInfo shopDetail={this.props.shopDetail}/>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row>
                        <Layout.Col>
                            <h3>商家商品列表</h3>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row>
                        <Layout.Col>
                            <Product productList={this.state.productList}/>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row>
                        <Layout.Col>
                            <h3>{this.state.commentLength}条网友点评</h3>
                        </Layout.Col>
                    </Layout.Row>
                    <Layout.Row>
                        <Layout.Col>
                            <div>
                                <Comment commentList={this.state.commentList}/>
                            </div>
                        </Layout.Col>
                    </Layout.Row>
                </div>
            </div>
        )
    }
}
export default withRouter(
    connect(
        state => ({shopDetail: state.shopDetail}),
        {
            reqShop
        }
    )(Detail)
)