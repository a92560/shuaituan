import React, {Component} from 'react';
import {
    Input,
    Button
} from 'element-react'
import {
    throttle
} from '../../utils'
import {
    reqVerification
} from '../../api'
import {
    withRouter
} from "react-router-dom";
import {
    login
} from '../../redux/actions'
import {
    Notification
} from 'element-react'
import {
    connect
} from 'react-redux'

import './login.css'

class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            errorMessage: '', // 错误消息
            username: '', // 用户名
            password: '', // 密码
            code: '', // 图形验证码
            rightCode: '', //正确图形验证码
        }
        this.handleChangeCodeTr = throttle(e => this.handleChangeCode(e), 1000)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const { username: name, roleId, r_id} = nextProps.user
        // 本地存储用户数据
        localStorage.setItem("r_id", r_id)
        localStorage.setItem("username", name)
        localStorage.setItem("roleId", roleId)
        // 跳转到主页
        // 根据roleId
        if (roleId === 0) {
            // 用户
            const {user = {}} = nextProps.user
            localStorage.setItem("userId", user.id)
            this.props.history.push('/')
        } else if (roleId === 1) {
            // 商家  。。。。暂未实现
            // 跳转到商家详情页
            const {shop = {}} = nextProps.user
            localStorage.setItem("shopId", shop.sid)
            this.props.history.push(`/detail/${shop.sid}`)
        } else {
            // 配送员
            const {delivery = {}} = nextProps.user
            localStorage.setItem("deliId", delivery.did)
            this.props.history.push(`/`)
        }
    }

    async componentDidMount(e) {
        this.refs.imgCaptcha.click()
    }


    // 点击重新获取验证码
    handleChangeCode = async (e) => {
        // 加上一个节流 （后期优化）
        this.refs.imgCaptcha.src += '?date=' + (+new Date())
        // e.target.src += '?date=' + (+new Date())
        await this.handleGetImgCode()
    }

    // 获取输入框的值的方法
    handleInputChange = async (value, name) => {
        this.setState({
            [name]: value
        })
        if(!this.state.rightCode){
            // 获取图形验证码text
            await this.handleGetImgCode()
        }
    }

    // 处理登录的逻辑方法
    handleLogin = async (e) => {
        // 判断输入的验证码和后台生成的验证码是否相等
        if (!this.state.username || !this.state.password) {
            this.setState({
                errorMessage: '用户名或密码为必填项'
            })
        } else if (!this.state.code || !(this.state.code.toUpperCase() === this.state.rightCode)) {
            // 不相等
            Notification.error({
                title: '错误',
                message: '验证码错误'
            });
            // 刷新验证码
            this.refs.imgCaptcha.src += '?date=' + (+new Date())
            // 刷新验证码文本
            await this.handleGetImgCode()
        } else {
            // 相等
            // 1. 收集数据
            const {username, password} = this.state
            try {
                this.props.login(username, password)
            } catch (e) {
                alert(e.message)
            }

        }
    }

    // 获取验证码文本方法
    handleGetImgCode = async () => {
        const {data: {status, strData}} = await reqVerification();
        if (status === 0) {
            // 成功获取服务端生成的验证码
            this.setState({
                rightCode: strData.code
            })
        } else {
            // 错误
            Notification.error({
                title: '错误',
                message: '服务器错误，请稍后重试'
            });
        }
    }

    render() {

        const codeUrl = 'http://localhost:8088/api/b-user/verification'

        return (
            <div className="page-login">
                <div className="login-header">
                    <a href="/" className="logo"/>
                </div>
                <div className="login-panel">
                    <div className="banner">
                        <img
                            ref="imgCaptcha"
                            src="//s0.meituan.net/bs/file/?f=fe-sso-fs:build/page/static/banner/www.jpg"
                            style={{width: 480, height: 370}}
                            alt="美团网"/>
                    </div>
                    <div className="form">
                        {
                            this.state.errorMessage ? <h4 className="tips"><i/>{this.state.errorMessage}</h4> : null
                        }
                        <Input className="profile"
                               value={this.state.username}
                               onChange={(value) => this.handleInputChange(value,'username')}
                               placeholder="请输入用户名"
                        />
                        <Input className="password"
                               type="password"
                               value={this.state.password}
                               onChange={(value) => this.handleInputChange(value, 'password')}
                               placeholder="请输入密码"
                        />
                        <Input className="verification"
                               value={this.state.code}
                               onChange={(value) => this.handleInputChange(value, 'code')}
                        />
                        <div className="codeImg">
                            <img ref="imgCaptcha" src={codeUrl} alt="图片验证码"
                                 style={{fontSize: 12, verticalAlign: 'middle'}} onClick={this.handleChangeCodeTr}/>
                        </div>
                        <span style={{fontSize: 12, cursor: 'pointer', margin: "5px 0"}} onClick={() => this.props.history.push("/register")}>注册</span>
                        <Button type="info" className="btn-login" onClick={this.handleLogin}>登录</Button>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(
    connect(
        state => ({user: state.user}),
        {
            login
        }
    )(Login)
)