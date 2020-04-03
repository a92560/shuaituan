import React, {Component} from 'react';
import {
    Button,
    Layout,
    Input,
    Notification
} from 'element-react';
import {
    withRouter
} from 'react-router-dom'
import {
    reqHotShopList,
    reqShopsByName,
    reqSuggestShopList
} from '../../api'
import './search-bar.css'
import logo from '../../assets/images/shuaituan_logo_1.png'

class SearchBar extends Component {

    constructor(props){
        super(props)
        this.state = {
            isShowSearchList: false,
            isShowHotSearchList: false,
            searchContent: '',
            hotSearchList: [],
            searchList: [],
            suggestList: [],
        }
    }

    async componentDidMount() {
        // 热门商家默认是选择评分由高到低
        const {data: {status, data: {data: hotSearchList}}} = await reqHotShopList(5)
        if(status === 0){
            const {data: {suggestStatus, data: {data: suggestList}}} = await reqSuggestShopList(5)
            this.setState({
                hotSearchList,
                suggestList
            })
        }
    }


    handleInput = (val) => {
        this.setState({
            searchContent: val !== undefined ? val : this.state.searchContent
        },  (async() => {
            // 输入框无内容
            if(!this.state.searchContent){
                this.handleFocus()
                return
            }
            const {data: {status, data: {data: searchList}}} = await reqShopsByName(this.state.searchContent)
            console.log(status)
            console.log(searchList)
            if(status === 0){
                this.setState({
                    searchList
                })
            }else{
                Notification({
                    type: 'info',
                    message: '暂无数据'
                })
            }

        }))
        // 输入框有内容
        this.setState({
            isShowSearchList: true,
            isShowHotSearchList: false
        })
    }

    handleFocus = () => {
        // 输入框有内容
        if(this.state.searchContent){
            this.handleInput()
            return
        }
        // 输入框无内容
        this.setState({
            isShowHotSearchList: true,
            isShowSearchList: false
        })
    }

    handleBlur = () => {
        setTimeout(() => {
            this.setState({
                isShowHotSearchList: false,
                isShowSearchList: false
            })
        }, 500)

    }

    //点击跳转首页
    handleToIndex = () => {
        this.props.history.push('/')
    }

    // 点击跳转商家详情
    handleToDetail = (sid) => {
        this.props.history.push(`/detail/${sid}`);
        this.setState({
            searchContent: ''
        })
    }

    render() {

        return (
            <div className="m-header">
                <Layout.Row className="m-header-searchbar">
                    <Layout.Col
                        span="6"
                        className="left">
                        <img
                            src={logo}
                            className="autoImage"
                            alt="美团"
                            onClick={this.handleToIndex}/>
                    </Layout.Col>
                    <Layout.Col
                        span="12"
                        className="center">
                        <div className="wrapper">
                            <Input
                                onFocus={this.handleFocus}
                                onBlur={this.handleBlur}
                                onChange={this.handleInput}
                                value={this.state.searchContent}
                                placeholder="搜索商家或地点"
                            />
                            <Button type="primary" icon="search">搜索</Button>
                            {
                                this.state.isShowSearchList ?
                                    <dl className="searchList">
                                        {
                                            this.state.searchList.map(search => (
                                                <dd
                                                    key={search.sid}
                                                    onClick={() =>this.handleToDetail(search.sid)}
                                                >{search.name}
                                                </dd>
                                            ))
                                        }
                                    </dl> : null
                            }
                            {
                                this.state.isShowHotSearchList ?
                                    <dl
                                        className="hotPlace">
                                        <dt>热门搜索</dt>
                                        {
                                            this.state.hotSearchList.map(hot => (
                                                <dd
                                                    key={hot.sid}
                                                    onClick={() =>this.handleToDetail(hot.sid)}
                                                >{hot.name}
                                                </dd>
                                            ))
                                        }
                                    </dl> : null
                            }
                        </div>
                        <p className="suggest">
                            {
                                this.state.suggestList.map(suggest => (<span
                                    key={suggest.sid}
                                    onClick={() =>this.handleToDetail(suggest.sid)}
                                >
                                    {suggest.name}
                                </span>))
                            }
                        </p>
                    </Layout.Col>
                    <Layout.Col
                        span="5"
                        className="right">
                        <ul className="security">
                            <li><i className="el-icon-check" style={{color: '#13D1BE'}}/><p className="txt" style={{marginTop: 4}}>随时退</p></li>
                            <li><i className="el-icon-circle-close" style={{color: '#13D1BE'}}/><p className="txt" style={{marginTop: 4}}>不满意免单</p></li>
                            <li><i className="el-icon-circle-check" style={{color: '#13D1BE'}}/><p className="txt" style={{marginTop: 4}}>过期退</p></li>
                        </ul>
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}
export default withRouter(SearchBar)