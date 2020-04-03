import React, { Component } from 'react';
import {
  Button,
  Table,
  Layout,
  InputNumber,
  Card
} from "element-react";
import {
  connect
} from 'react-redux'
import {
  withRouter
} from 'react-router-dom'
import {
  reqShopGoodsDetail,
  reqBuyGoods
} from "../../api";
import './buy.css'

class Buy extends Component {
  constructor(props) {
    super(props);

    this.state = {
      columns: [
        {
          label: '项目',
          prop: "name",
          width: 340,
          align: 'center',
          height: 80,
          render: function (data) {
            return (
              <span style={{ textAlign: 'left' }}>
                <Card>
                  <img src={require(`../../assets/images/${data.img}`)} className="autoImage"
                    alt="picture" />
                  <div style={{ padding: 14 }}>
                    <span style={{
                      marginLeft: '50px',
                      paddingTop: '15px',
                      display: 'inline-block'
                    }}>{data.name}</span>
                  </div>
                </Card>
              </span>
            )
          }
        },
        {
          label: "单价",
          align: 'center',
          prop: "price",
          width: 120,
          height: 80,
        },
        {
          label: "数量",
          prop: "count",
          align: 'center',
          height: 80,
          width: 360,
          render: (data) => {
            return <InputNumber defaultValue={data.count} onChange={this.onChange} min="1" />
          }
        },
        {
          label: "总价",
          align: 'center',
          width: 190,
          height: 80,
          render: (data) => {
            return (
              <span>{data.count * data.price}</span>
            )
          }
        }
      ],
      data: [],
      totalPrice: 0
    }
  }

  async componentDidMount () {
    // 发送请求获取该商品信息
    const { shopId, goodsId } = this.props.match.params
    const { data: { status, data: { data: goods } } } = await reqShopGoodsDetail(shopId, goodsId)
    if (status === 0) {
      this.setState({
        data: [{ ...goods[0], count: 1 }],
        totalPrice: goods[0].price
      })
    }
  }

  onChange = (val) => {
    let newData = [{ ...this.state.data[0], count: val }]
    this.setState({
      data: newData,
      totalPrice: val * newData[0].price
    })
  }

  handleSubmit = async () => {
    // 提交订单
    const { shopId, goodsId } = this.props.match.params;
    if (!shopId || !goodsId) {
      this.props.history.replace('/')
    }
    console.log(this.state.data[0])
    const { data = [] } = this.state
    if (data.length <= 0) {
      this.props.history.replace('/')
    }
    const { count, price, img, name } = data[0]

    const { u_name, phone, u_address } = this.props.user.user
    let shouldSubmitOrder = {
      g_name: name,
      img,
      count,
      price,
      total: this.state.totalPrice,
      u_name,
      u_phone: phone,
      u_address,
      sid: shopId,
      gid: goodsId
    }
    const { data: { status, data: number } } = await reqBuyGoods(localStorage.getItem('userId'), shouldSubmitOrder);
    if (status === 0 && number.data === 1) {
      alert("购买成功")
      this.props.history.replace(`/detail/${shopId}`)
    }
  }

  render () {
    /*if(!this.state.data[0] ||Object.keys(this.state.data[0]).length <= 0){
        return null
    }*/
    return (
      <Layout.Row>
        <Layout.Col offset={4} span={16} className="m-cart">
          <div>
            <Table
              style={{ marginTop: 50, marginBottom: 100 }}
              columns={this.state.columns}
              data={this.state.data}
            />
            <p>
              应付金额：<em className="money">￥{this.state.totalPrice}元</em>
            </p>
            <div className="footer-wrapper">
              <div className="back">
                <Button
                  type="primary"
                  onClick={() => this.props.history.goBack()}
                >
                  返回商家
                                </Button>
              </div>
              <div className="post">
                <Button
                  type="primary"
                  onClick={this.handleSubmit}>
                  提交订单
                                </Button>
              </div>
            </div>
          </div>
        </Layout.Col>
      </Layout.Row>

    )
  }
}

export default withRouter(
  connect(
    state => ({ user: state.user })
  )(Buy)
)