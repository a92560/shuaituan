import React, {Component} from 'react';
import {
    Layout,
    Menu
} from 'element-react'
import {
    connect
} from 'react-redux'
import {
    withRouter
} from 'react-router-dom'
import {
    receiveSelectedIndex,
    receiveTabName
} from '../../redux/actions'

import './aside.css'

class Aside extends Component {
    constructor(props) {
        super(props)
        this.state = {
            selectedIndex: '',
            tabArray: [{
                'name': '全部订单',
                'index': '1-1',
                'path': '/order'
            }, {
                'name': '配送中',
                'index': '1-2',
                'path': '/order?status=1'
            }, {
                'name': '待评价',
                'index': '1-3',
                'path': '/order?status=2'
            }, {
                'name': '已完成',
                'index': '1-4',
                'path': '/order?status=3'
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

        }
    }

    componentDidMount() {
        let {pathname, search} = this.props.history.location
        if(search){
            pathname += search
            search = ''
        }
        const shouldUpdateTabArray = [...this.state.tabArray]
        let willUpdateTabArray = shouldUpdateTabArray.filter(item => item.path === pathname || item.path === search)
        this.props.receiveSelectedIndex({selectedIndex: willUpdateTabArray[0].index})
        this.props.receiveTabName({tabName: willUpdateTabArray[0].name})
    }


    handleSelect = (index) => {
        this.setState({
            selectedIndex: index
        }, (() => {
            // 更新tabName
            // 1. 获取tabName
            const {name, path = '/'} = this.state.tabArray.filter((item) => item.index === this.state.selectedIndex)[0]
            this.props.history.push(path)
            this.props.receiveTabName({tabName: name})
            this.props.receiveSelectedIndex({selectedIndex: this.state.selectedIndex})
        }))
    }

    render() {
        const {selectedIndex} = this.props.asideTab

        return (
            <Layout.Col span={4} push={3} style={{marginLeft: -25}}>
                <Menu onSelect={this.handleSelect} defaultActive="1" defaultOpeneds={['1']}
                      className="el-menu-vertical-demo">
                    <Menu.SubMenu style={{height: 240}} index="1"
                                  title={<span><i className="el-icon-message"/>我的订单</span>}>
                        <Menu.ItemGroup title="订单类型">
                            <Menu.Item className={selectedIndex === '1-1' ? "is-active" : ''}
                                       index="1-1">全部订单</Menu.Item>
                            <Menu.Item className={selectedIndex === '1-2' ? "is-active" : ''}
                                       index="1-2">配送中</Menu.Item>
                            <Menu.Item className={selectedIndex === '1-3' ? "is-active" : ''}
                                       index="1-3">待评价</Menu.Item>
                        </Menu.ItemGroup>
                    </Menu.SubMenu>
                    <Menu.Item className={selectedIndex === '2' ? "is-active" : ''} index="2"><i
                        className="el-icon-setting"/>我的购物车</Menu.Item>
                    <Menu.Item className={selectedIndex === '3' ? "is-active" : ''} index="3"><i
                        className="el-icon-menu"/>个人信息</Menu.Item>
                    <Menu.Item className={selectedIndex === '4' ? "is-active" : ''} index="4"><i
                        className="el-icon-setting"/>钱包</Menu.Item>
                </Menu>
            </Layout.Col>
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
    )(Aside)
)