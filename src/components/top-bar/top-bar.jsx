import React, {Component} from 'react';
import {
    Layout,
    Dialog,
    Select,
    Button
} from 'element-react'
import {
    withRouter
} from 'react-router-dom'
import {
    connect
} from 'react-redux'

import {
    reqCities,
    reqHotCityList,
    reqProvinces
} from '../../api'

import {
    receiveSelectedIndex
} from '../../redux/actions'

import './top-bar.css'

class TopBar extends Component {
    constructor(props) {
        super(props)
        this.state = {
            hotCityList: [],
            selectCityDialog: false,
            provinces: [],
            cities: [],
            proID: -1,
            city: '广州市'
        }
    }

    async componentDidMount() {
        const {data: {status, data: {data: hotCityList}}} = await reqHotCityList();

        this.setState({
            hotCityList
        })
    }

    // 处理跳转页面
    handleToForward = (url) => {
        if (url === '/personal') {
            this.props.receiveSelectedIndex({selectedIndex: '3'})
        } else if (url === '/order') {
            this.props.receiveSelectedIndex({selectedIndex: '1-1'})
        } else if (url === '/cart') {
            this.props.receiveSelectedIndex({selectedIndex: '2'})
        } else if (url === '/wallet') {
            this.props.receiveSelectedIndex({selectedIndex: '4'})
        }
        this.props.history.push(url)
    }

    // 处理登出
    handleToLogout = () => {
        // 清理localStorage中的值
        localStorage.removeItem('userId')
        localStorage.removeItem('shopId')
        localStorage.removeItem('deliId')
        localStorage.removeItem('roleId')
        localStorage.removeItem('r_id')
        localStorage.removeItem('username')
        this.props.history.replace('/login');
    }

    // 切换城市
    handleSwitchCity = async () => {
        this.setState({
            selectCityDialog: true
        })
        const {data: {status, data: {data: provinces}}} = await reqProvinces()
        this.setState({
            provinces
        })
    }

    // 处理select变化
    handleSelectChange = (val) => {
        this.setState({
            proID: val,
            city: ''
        }, async () => {
            const {data: {status, data: {data: cities}}} = await reqCities(this.state.proID)
            if(status === 0){
                this.setState({
                    cities
                })
            }
        } )
    }

    // 处理选中城市
    handleCityChange = (val) => {
        this.setState({
            city: val
        })
    }


    render() {
        return (
            <div className="m-header">
                <Layout.Row>
                    <Layout.Col span={7}>
                        <div className="m-geo">
                            <i className='iconfont-location'/> {this.state.city.substring(0, this.state.city.length - 1)}
                            <span
                                style={{marginLeft: 5, cursor: "pointer"}}
                                onClick={this.handleSwitchCity}
                            >切换城市</span>
                            [
                            {
                                this.state.hotCityList.length > 0 && this.state.hotCityList.map(city => "    " +(city.name.substring(0, city.name.length - 1)))
                            }
                            ]
                        </div>
                    </Layout.Col>
                    <Layout.Col span={7}>
                        <div className="m-user">
                            {
                                localStorage.getItem("username")
                                    ? <span className="should-login">欢迎您<span
                                        className="username">{localStorage.getItem("username")}</span><span
                                        className="logout" onClick={this.handleToLogout}>退出</span></span>
                                    : <span>
                                        <span className="login"
                                              onClick={() => this.handleToForward('/login')}>立即登录</span>
                                        <span className="register"
                                              onClick={() => this.handleToForward('/register')}>注册</span>
                                    </span>
                            }
                        </div>

                    </Layout.Col>
                    <Layout.Col span={10}>
                        <div className="m-nav">
                            <ul className="nav">
                                <li><span onClick={() => this.handleToForward('/personal')}>信息</span></li>
                                <li><span onClick={() => this.handleToForward('/order')}>订单</span></li>
                                <li><span onClick={() => this.handleToForward('/cart')}>购物车</span></li>
                                <li><span onClick={() => this.handleToForward('/wallet')}>钱包</span></li>
                                <li><span onClick={() => this.handleToForward('/about')}>帅团</span></li>
                            </ul>
                        </div>
                    </Layout.Col>
                    <Dialog
                        title="选择城市"
                        visible={ this.state.selectCityDialog }
                        onCancel={ () => this.setState({ selectCityDialog: false }) }
                    >
                        <Dialog.Body>
                            <Select
                                value={this.state.proID}
                                placeholder="请选择省份"
                                onChange={(val) => this.handleSelectChange(val)}
                                style={{marginRight: 10}}
                            >
                                {
                                    this.state.provinces.map(province => {
                                        return <Select.Option key={province.id} value={province.id} label={province.name}/>
                                    })
                                }
                            </Select>

                            <Select value={this.state.city} placeholder="请选择城市" onChange={(val) => this.handleCityChange(val)}>
                                {
                                    this.state.cities.map(province => {
                                        return <Select.Option key={province.id} value={province.name} label={province.name}/>
                                    })
                                }
                            </Select>
                        </Dialog.Body>

                        <Dialog.Footer className="dialog-footer">
                            <Button onClick={ () => this.setState({ selectCityDialog: false }) }>取 消</Button>
                            <Button type="primary" onClick={ () => this.setState({ selectCityDialog: false }) }>确 定</Button>
                        </Dialog.Footer>
                    </Dialog>
                </Layout.Row>
            </div>
        )
    }
}

export default withRouter(
    connect(
        state => ({asideTab: state.asideTab}),
        {receiveSelectedIndex}
    )(TopBar)
)