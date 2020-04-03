import React, {Component, Fragment} from 'react';
import {
    Button,
    Form,
    Input,
    Radio,
    Notification,
    Message,
    Upload
} from 'element-react'

import {
    reqPhoneCode,
    reqRegister,
    reqUserRegister,
    reqShopRegister,
    reqDeliRegister, reqUploadPics, reqUploadPic
} from '../../api'
import {
    withRouter
} from 'react-router-dom'
import './register.css'

class Register extends Component {
    constructor(props) {
        super(props)
        this.state = {
            pwdLevel_1: false, // 密码强度弱
            pwdLevel_2: false, // 密码强度中
            pwdLevel_3: false, // 密码强度高
            rightPhoneCode: '', // 从服务端获取的手机验证码
            computeNumber: 0, // 倒数的秒数
            couldSendCode: true, // 手机号是否正确
            errorMsg: '', // 错误消息提示
            user: {
                username: '', // 用户名
                password: '', // 密码
                checkPassword: '', // 确认密码
                phone: '', // 手机号
                phoneCode: '', // 手机验证码
                payPassword: '', // 支付密码
                roleName: '用户', // 身份ID
                r_name: '', // 真实姓名
                address: '', // 地址
            },
            rules: {
                username: [
                    {required: true, message: '请输入用户名', trigger: 'blur'},
                    {
                        validator: (rule, value, callback) => {
                            if (!/^[a-zA-Z0-9_-]{6,16}$/.test(value)) {
                                callback(new Error("用户名为6-16位字母，下划线和数字组成"))
                            } else {
                                callback()
                            }
                        }
                    }
                ],
                password: [
                    {required: true, message: '请输入密码', trigger: 'blur'},
                    {
                        validator: (rule, value, callback) => {
                            if (/^[0-9]{6,16}$|^[a-zA-Z]{6,16}$/.test(value)) {
                                // 全是数字或者字母
                                callback()
                                this.setState({
                                    pwdLevel_1: true,
                                    pwdLevel_2: false,
                                    pwdLevel_3: false
                                })
                            } else if (/^[A-Za-z0-9]{6,16}$/.test(value)) {
                                // 数字和字母组成的
                                callback()
                                this.setState({
                                    pwdLevel_1: true,
                                    pwdLevel_2: true,
                                    pwdLevel_3: false
                                })
                            } else if (/^.*(?=.{6,16})(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[_]).*$/.test(value)) {
                                callback()
                                this.setState({
                                    pwdLevel_1: true,
                                    pwdLevel_2: true,
                                    pwdLevel_3: true
                                })
                            } else if (value === "" || /^.{0,6}$/.test(value)) {
                                /*if (this.state.form.checkPassword !== '') {
                                    this.refs.form.validateField('checkPassword');
                                }*/
                                callback(new Error('密码由6-16个字符组成，包括字母，数字和下划线等字符'));
                                this.setState({
                                    pwdLevel_1: false,
                                    pwdLevel_2: false,
                                    pwdLevel_3: false
                                })
                            } else {
                                callback()
                            }
                        }
                    }
                ],
                checkPassword: [
                    {required: true, message: '请输入确认密码', trigger: 'blur'},
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入确认密码'));
                            } else if (value !== this.state.user.password) {
                                callback(new Error('两次输入密码不一致!'));
                            } else {
                                callback();
                            }
                        }
                    }
                ],
                phone: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (!/\d{11}/.test(value)) {
                                callback(new Error('请输入11位数字的手机号'));
                                this.setState({
                                    couldSendCode: true
                                })
                            } else {
                                this.setState({
                                    couldSendCode: false
                                })
                                callback()
                            }
                        }

                    }
                ],
                phoneCode: [
                    {
                        required: true,
                        message: '请输入验证码',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (!value) {
                                callback(new Error('请输入验证码'));
                            } else if (value !== this.state.rightPhoneCode) {
                                callback(new Error('验证码不正确'))
                            } else{
                                callback()
                            }
                        }

                    }
                ]

            },
            roleArr: [
                {
                    name: '用户',
                    no: 0
                }, {
                    name: '商家',
                    no: 1
                }, {
                    name: '配送员',
                    no: 2
                },
            ],
            fileList: [],
        }
    }

    // 文件改变
    async handleChange(file, fileList) {
        console.log(fileList)
        console.log(file)
        this.setState({
            raw: fileList[0].raw
        })
        if(fileList.length>=3){
            let formData = new FormData()
            const shouldSendPics = fileList.map(file => file.raw)
            console.log(shouldSendPics)
            formData.append('file',shouldSendPics)
            const {data: {status, data}} = await reqUploadPics(formData)
        }
    }


    // 处理注册事件
    handleSubmit = async (e) => {
        e.preventDefault()
        e.stopPropagation()
        this.refs.form.validate(async (valid) => {
            if (valid) {
                const roleId = this.state.roleArr.filter(role => (
                        role.name === this.state.user.roleName
                    )
                )[0].no
                const {username, password, phone, r_name, address, img_cover, payPassword} = this.state.user
                const {data: {status, message, data: {data: r_id}}} = await reqRegister({username, password, phone, roleId})
                if (status === 0) {
                    // 根据roleId 插入对应的新数据
                    let imgName = ''
                    if(roleId === 1){
                        let formData = new FormData()
                        const shouldSendPic = this.state.raw
                        formData.append("file", shouldSendPic)
                        let {data: {status, img}} = await reqUploadPic(r_id, formData)
                        imgName = img
                        if(!imgName){
                            this.notification("商家封面图片为必填项")
                            return
                        }
                        if(parseInt(status) !== 0){
                            this.notification("商家封面图片为必填项")
                            return
                        }
                    }
                    this.setState({
                        img_cover: imgName.substring(7)
                    }, async () => {
                        const {data: {status, message, data: {data: count}}} = roleId === 0 ?
                            await reqUserRegister(r_id, {u_name: r_name, u_address: address, pay_password: payPassword})
                            :
                            (roleId === 1 ?
                                    await reqShopRegister(r_id, {name: r_name, address: address, pay_password: payPassword, phone: phone, img_cover: this.state.img_cover})
                                    :
                                    await reqDeliRegister(r_id, {r_name: r_name, pay_password: payPassword})
                            )
                        if(status === 0 && count === 1){
                            alert("注册成功")
                            this.props.history.replace("/login")
                        }else{
                            this.notification(message)
                        }
                    })

                } else {
                    // 用户名已存在
                    this.notification(message)
                }
            } else {
                this.notification("请填写必填字段")
            }
        });
        // 发请求注册
        // 收集roleId

    }

    // 处理重置表单事件
    handleReset = (e) => {

    }

    // 错误提示
    notification = (message, type = "error") => {
        Notification({
            type,
            message
        })
    }

    // input 输入框收集数据
    onChange = (value, name) => {
        /*if(name === 'phone'){
            this.setState({
                form: {...this.state.form, ...{[name]: value}},
            })
        }*/
        this.setState({
            user: {...this.state.user, ...{[name]: value}}
        })
    }

    handleGetPhoneCode = async () => {
        const {data: {status, strData}} = await reqPhoneCode(!this.state.couldSendCode ? this.state.user.phone : '')
        if (status === 0) {
            this.setState({
                rightPhoneCode: strData.code
            })
        }
    }


    // 改变用户身份ID
    changeRole = (value) => {

    }

    render() {
        const {fileList} = this.state
        return (
            <div className="page-register">
                <article className="header">
                    <header>
                        <div className="site-logo"/>
                        <span className="login">
                            <em className="bold">已有帅团账号？</em>
                            <Button onClick={() => this.props.history.push('/login')}>登录</Button>
                        </span>
                    </header>
                </article>
                <section>
                    <Form ref="form" model={this.state.user} rules={this.state.rules} labelWidth="100"
                          className="demo-ruleForm">
                        <Form.Item label="用户名" prop="username">
                            <Input type="text" value={this.state.user.username}
                                   onChange={value => this.onChange(value, 'username')}/>
                        </Form.Item>
                        <Form.Item label="密码" prop="password">
                            <Input type="password" value={this.state.user.password}
                                   onChange={value => this.onChange(value, 'password')}/>
                            <div
                                className={this.state.pwdLevel_1 ? "ywz_zhuce_huixian ywz_zhuce_hongxian" : "ywz_zhuce_huixian"}
                                id='pwdLevel_1'/>
                            <div
                                className={this.state.pwdLevel_2 ? "ywz_zhuce_huixian ywz_zhuce_hongxian2" : "ywz_zhuce_huixian"}
                                id='pwdLevel_2'/>
                            <div
                                className={this.state.pwdLevel_3 ? "ywz_zhuce_huixian ywz_zhuce_hongxian3" : "ywz_zhuce_huixian"}
                                id='pwdLevel_3'/>
                            <div className="ywz_zhuce_hongxianwenzi"> 弱</div>
                            <div className="ywz_zhuce_hongxianwenzi"> 中</div>
                            <div className="ywz_zhuce_hongxianwenzi"> 强</div>
                        </Form.Item>
                        <Form.Item label="确认密码" prop="checkPassword">
                            <Input type="password" value={this.state.user.checkPassword}
                                   onChange={value => this.onChange(value, 'checkPassword')}/>
                        </Form.Item>
                        <Form.Item label="手机号" prop="phone" className="phone-item">
                            <Input value={this.state.user.phone} onChange={value => this.onChange(value, 'phone')}/>
                            <Button className="getCode" type="info" onClick={this.handleGetPhoneCode}
                                    disabled={this.state.couldSendCode}>获取验证码</Button>
                        </Form.Item>
                        <Form.Item label="身份" prop="roleName">
                            <Radio.Group value={this.state.user.roleName} onChange={value => this.onChange(value, 'roleName')}>
                                <Radio.Button value="用户"/>
                                <Radio.Button value="商家"/>
                                <Radio.Button value="配送员"/>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="验证码" prop="phoneCode" className="code-item">
                            <Input value={this.state.user.phoneCode}
                                   onChange={value => this.onChange(value, 'phoneCode')}/>
                        </Form.Item>
                        <Form.Item label="支付密码" prop="payPassword" className="code-item">
                            <Input value={this.state.user.payPassword}
                                   type="password"
                                   onChange={value => this.onChange(value, 'payPassword')}/>
                        </Form.Item>
                        {
                            this.state.user.roleName === '配送员' ?
                                <Form.Item label="真实姓名" prop="r_name" className="code-item">
                                    <Input value={this.state.user.r_name}
                                           onChange={value => this.onChange(value, 'r_name')}/>
                                </Form.Item> : (this.state.user.roleName === '商家' ?
                                <Fragment>
                                    <Form.Item label="商家名称" prop="r_name" className="code-item">
                                        <Input value={this.state.user.r_name}
                                               onChange={value => this.onChange(value, 'r_name')}/>
                                    </Form.Item>
                                    <Form.Item label="商家地址" prop="address" className="code-item">
                                        <Input value={this.state.user.address}
                                               onChange={value => this.onChange(value, 'address')}/>
                                    </Form.Item>
                                    <Form.Item label="商家封面">
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
                                    </Form.Item>

                                </Fragment> :
                                    <Fragment>
                                        <Form.Item label="真实姓名" prop="r_name" className="code-item">
                                            <Input value={this.state.user.r_name}
                                                   onChange={value => this.onChange(value, 'r_name')}/>
                                        </Form.Item>
                                        <Form.Item label="配送地址" prop="address" className="code-item">
                                            <Input value={this.state.user.address}
                                                   onChange={value => this.onChange(value, 'address')}/>
                                        </Form.Item>
                                    </Fragment>
                                )

                            //    roleId === 0  需添加 真实姓名 name 和 地址address
                            //    roleId === 1 商家 img_cover 封面图片 和 name , address
                            //    roleId === 2 配送员 name
                        }
                        <Form.Item>
                            {
                                this.state.errorMsg ?
                                    <div className="error">{this.state.errorMsg}</div>
                                    :
                                    null
                            }

                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" onClick={this.handleSubmit}>注册</Button>
                            <Button onClick={this.handleReset}>重置</Button>
                        </Form.Item>
                    </Form>
                </section>
            </div>
        )
    }
}

export default withRouter(Register)

