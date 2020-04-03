import React, {Component} from 'react';
import {
    Layout,
    Card,
    Button,
    Dialog,
    Input,
    Form,
    Select,
    Notification
} from 'element-react'
import {
    connect
} from 'react-redux'
import {
    reqUserInformation
} from "../../redux/actions";
import {
    postBankCard,
    reqUserBankCard
} from '../../api'
import './wallet.css'

class Wallet extends Component {
    constructor(props){
        super(props)
        this.state = {
            bankCardList: [], // 银行卡信息
            balance: 0, // 余额信息
            r_id: '', // 注册ID
            showAddCardDialog: false, // 是否显示添加银行卡弹窗
            bankCard: {
                card_no: '', // 银行卡号
                card_name: '', // 所属银行
            },
            cardNameArr: [
                {
                    label: "中国农业银行",
                    value: "中国农业银行"
                },
                {
                    label: "中国工商银行",
                    value: "中国工商银行"
                },
                {
                    label: "中国银行",
                    value: "中国银行"
                },
                {
                    label: "中国建设银行",
                    value: "中国建设银行"
                }
            ],
            cardImageArr: {
                "中国工商银行": "ICBC.png",
                "中国银行": "CB.png",
                "中国建设银行": "CBC.png",
                "中国农业银行": "ABC.png",
            }
        }
    }


    async componentDidMount() {
        // 获取用户银行卡信息
        const {data: {status, data: {data: bankCardList}}} = await reqUserBankCard(localStorage.getItem("r_id"))
        if(status === 0){
            this.setState({
                bankCardList
            })
        }
        // 手动刷新之后
        if(!this.props.user.pay_password){
            this.props.reqUserInformation(localStorage.getItem("r_id"), localStorage.getItem("roleId"))
            return
        }
        this.handleUserBankCard(this.props.user)

    }

    componentWillReceiveProps(nextProps, nextContext) {
        this.handleUserBankCard(nextProps.user)
    }

    // 补全用户余额和银行卡信息
    handleUserBankCard = (user) => {
        const {balance, r_id} = user
        this.setState({
            balance,
            r_id
        })
    }

    // 处理添加银行卡
    handleAddBankCard = async () => {
        // 需要收集的信息
        const {data: {status, data: {data: count}}} = await postBankCard(localStorage.getItem("r_id"), this.state.bankCard)
        if(status === 0 && count === 1){
            Notification({
                type: 'success',
                message: "添加银行卡成功"
            })
            window.location.reload()
        }
        // 1. 真实姓名  手机号  银行卡号 银行类型
    }

    // 处理输入框输入
    handleInputChange = (val, name) => {
        this.setState({
            bankCard: {...this.state.bankCard, ...{[name]: val}}
        })
    }

    // 提现
    handleUseBalance = () => {

    }

    // 充值
    handleAddBalance = () =>{

    }


    render() {
        return (
            <Layout.Col span={10} push={5}>
                <Card
                    className="box-card"
                    header={
                        <div className="clearfix">
                            <span style={{"lineHeight": "36px",}}>我的银行卡</span>
                            <Button type="primary" size="small" style={{marginLeft: '10px'}} onClick={() => this.setState({ showAddCardDialog: true })}>添加银行卡</Button>
                            <Button type="primary" size="small" style={{marginLeft: '10px'}} onClick={this.handleUseBalance}>提现</Button>
                            <Button type="primary" size="small" style={{marginLeft: '10px'}} onClick={this.handleAddBalance}>充值</Button>
                            <span style={{"float": "right"}}>
                                <span style={{"lineHeight": "36px", fontSize: '14px'}}>我的余额：{this.state.balance}</span>
                            </span>
                        </div>
                    }
                >
                    {
                        this.state.bankCardList.map(bankCard => (
                            <div className="text item" key={bankCard.id}>
                                <Layout.Col span={ 11 }>
                                    <Card bodyStyle={{ padding: 0 , height: 218}}>
                                        <img src={require(`../../assets/images/${this.state.cardImageArr[bankCard.card_name]}`)} className="autoImage" alt="银行图片" style={{float: 'left'}}/>
                                        <div style={{textAlign: 'center'}}>卡号：<span style={{fontSize: 11, fontWeight: 'bold'}}>{bankCard.card_no}</span></div>
                                        <div style={{textAlign: 'center'}}>余额：<span style={{fontSize: 11, fontWeight: 'bold'}}>{bankCard.balance}</span></div>
                                    </Card>
                                </Layout.Col>
                            </div>
                        ))
                    }

                </Card>
                <Dialog
                    title="添加银行卡"
                    visible={ this.state.showAddCardDialog }
                    onCancel={ () => this.setState({ showAddCardDialog: false }) }
                >
                    <Dialog.Body>
                        <Form model={this.state.bankCard}>
                            <Form.Item label="银行卡号" labelWidth="120">
                                <Input value={this.state.bankCard.card_no} onChange={val => this.handleInputChange(val, 'card_no')}/>
                            </Form.Item>
                            <Form.Item label="所属银行" labelWidth="120">
                                <Select value={this.state.bankCard.card_name} placeholder="请选择所属银行" onChange={val => this.handleInputChange(val, 'card_name')}>
                                    {
                                        this.state.cardNameArr.map(cardName => (
                                            <Select.Option key={cardName.value} label={cardName.label} value={cardName.value}/>
                                        ))
                                    }
                                </Select>
                            </Form.Item>
                        </Form>
                    </Dialog.Body>

                    <Dialog.Footer className="dialog-footer">
                        <Button onClick={ () => this.setState({ showAddCardDialog: false }) }>取 消</Button>
                        <Button type="primary" onClick={this.handleAddBankCard}>确 定</Button>
                    </Dialog.Footer>
                </Dialog>
            </Layout.Col>
        )
    }
}
export default connect(
    state => ({user: state.user}),
    {
        reqUserInformation
    }
)(Wallet)