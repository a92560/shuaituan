import React, {Component} from 'react';
import {
    Layout,
    Card,
    Form,
    Input,
    Button,
    DatePicker,
    MessageBox,
    Message,
    Rate
} from 'element-react'
import {
    connect
} from 'react-redux'
import {
    reqUserInformation
} from '../../redux/actions'
import {
    updateDeliInfo,
    updateShopInfo, updateUserInfo
} from "../../api";
import './personal.css'

class Personal extends Component {

    constructor(props) {
        super(props);

        this.state = {
            user: {
                r_name: '',
                phone: '',
                address: '',
                birthday: new Date(),
                payPassword: '',
                rating: '', // 评分
            },
            rules: {
                phone: [
                    {
                        required: true,
                        message: '请输入手机号',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入手机号'));
                            } else if (!/^\d{11}$/.test(value)) {
                                callback(new Error('请输入11位数字的手机号'));
                            } else {
                                callback()
                            }
                        }
                        , trigger: 'change'
                    }
                ],
                address: [
                    {
                        required: true,
                        message: '请输入地址',
                        trigger: 'blur'
                    }
                ],
                payPassword: [
                    {
                        required: true,
                        message: '请输入支付密码',
                        trigger: 'blur'
                    },
                    {
                        validator: (rule, value, callback) => {
                            if (value === '') {
                                callback(new Error('请输入支付密码'));
                            } else if (!/^\d{6}$/.test(value)) {
                                callback(new Error('请输入6位数字的支付密码'));
                            } else {
                                callback()
                            }
                        }
                        , trigger: 'change'
                    }
                ],
            }
        };
    }

    async componentDidMount() {
        const {user} = this.props
        console.log(user)
        if(!user.username){
            this.props.reqUserInformation(localStorage.getItem("r_id"), localStorage.getItem("roleId"))
            return
        }
        this.handleUserInfo(user)
    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.handleUserInfo(nextProps.user)
    }

    handleUserInfo = (user) => {
        const roleId = localStorage.getItem("roleId")
        if(parseInt(roleId) === 0){
            // 普通用户
            const {u_name, phone, pay_password, u_address, birthday} = user.user
            this.setState({
                user: {...{r_name: u_name}, ...{address: u_address}, ...{payPassword: pay_password}, ...{birthday}, ...{phone}}
            })
        }else if(parseInt(roleId) === 1){
            // 商家用户
            const {phone} = user
            const {name, address, rating, pay_password} = user.shop
            this.setState({
                user: {...{r_name: name}, ...{address: address}, ...{payPassword: pay_password}, ...{rating}, ...{phone}}
            })
        }else if(parseInt(roleId) === 2){
            // 配送员用户
            const {phone} = user
            const {r_name, birthday, d_rating, pay_password} = user.delivery
            this.setState({
                user: {...{r_name}, ...{birthday}, ...{payPassword: pay_password}, ...{rating: d_rating}, ...{phone}}
            })
        }
    }

    onChange = (key, value) => {
        this.setState({
            user: {...this.state.user, ...{[key]: value}}
        });
    }

    formatTime = (time) => {
        // 2019/7/3 12:00:00
        try {
            time = time.split(' ')[0]  // 2019/7/3
            time = time.replace(/\/+/g, '-')
            // console.log(time) // 2019-7-3
            return time
        }catch (e) {
            console.log(e.message)
        }

    }

    // 处理提交表单
    handleSubmit = async (e) => {
        e.preventDefault()
        console.log(this.state.user)
        const roleId = parseInt(localStorage.getItem("roleId"))
        const {address, phone, r_name, payPassword, birthday} = this.state.user
        const {data: {status, data: {data: count}}} = roleId === 1
                                                    ?
                                                    await updateShopInfo(localStorage.getItem("shopId"), {address, pay_password: payPassword, phone})
                                                    : (roleId === 0 ?
                                                    await updateUserInfo(localStorage.getItem("userId"), {u_address: address, birthday, pay_password: payPassword, phone})
                                                    :
                                                    await updateDeliInfo(localStorage.getItem("deliId"), {birthday, pay_password: payPassword, phone})
                                                    )
        if(status === 0 && count === 1){
            alert("更新成功")
        }else{
            alert("Internal Server Error")
        }
    }

    render() {
        return (
            <Layout.Col span={12} push={5}>
                <Card>
                    <Form labelPosition="top" labelWidth="100" rules={this.state.rules} model={this.state.user}
                          className="demo-form-stacked">
                        <Form.Item label="真实姓名">
                            <Input value={this.state.user.r_name}
                                   onChange={(val) => this.onChange('r_name', val)} readOnly={true}/>
                        </Form.Item>
                        <Form.Item label="手机号码" prop="phone">
                            <Input value={this.state.user.phone} onChange={(val) => this.onChange('phone', val)}/>
                        </Form.Item>
                        {
                            !this.state.user.address ?
                                <Form.Item label="生日">
                                    <DatePicker
                                        value={new Date(this.state.user.birthday)}
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        onChange={(date) => this.onChange('birthday', this.formatTime(date.toLocaleString()))}
                                    />
                                </Form.Item> :
                                <Form.Item label="地址" prop="address">
                                    <Input value={this.state.user.address}
                                           onChange={(val) => this.onChange('address', val)}/>
                                </Form.Item>
                        }
                        {
                            (this.state.user.rating === 0 || this.state.user.rating) ?
                                <Form.Item label="评分">
                                    <Rate value={this.state.user.rating} showText={true} disabled={true}/>
                                </Form.Item>
                                :
                                <Form.Item label="生日">
                                    <DatePicker
                                        value={new Date(this.state.user.birthday)}
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        onChange={(date) => this.onChange('birthday', this.formatTime(date.toLocaleString()))}
                                    />
                                </Form.Item>
                        }
                        <Form.Item label="支付密码" prop="payPassword">
                            <Input type="password" value={this.state.user.payPassword}
                                   onChange={(val) => this.onChange('payPassword', val)}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary" nativeType="submit" onClick={this.handleSubmit}>保存</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </Layout.Col>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {
        reqUserInformation
    }
)(Personal)