import React, { Component } from 'react';
import { connect } from 'react-redux'
import Shop from '../../components/shop/shop.jsx'

import {
  reqShopList
} from '../../redux/actions'

import {
  reqHangUpOrdersStatus
} from "../../api";
import Delivery from "../../components/delivery/delivery";

class Shops extends Component {

  constructor(props) {
    super(props)
    this.state = {
      chooseArr: [
        {
          text: '默认',
          isChosen: true
        },
        {
          text: '评论数量',
          isChosen: false
        },
        {
          text: '评分',
          isChosen: false
        },
      ],
      hangUpOrderList: [], //挂单列表
      shops: [], // 商家列表
      desc: true
    }
  }

  static getDerivedStateFromProps (props, state) {
    // Any time the current user changes,
    // Reset any parts of state that are tied to that user.
    // In this simple example, that's just the email.
    if (props.shops.length !== state.shops.length) {
      return {
        shops: props.shops,
        originShops: props.shops
      };
    }
    return null;
  }

  async componentDidMount () {
    if (parseInt(localStorage.getItem("roleId")) === 2) {
      const { data: { status, data: { data: hangUpOrderList } } } = await reqHangUpOrdersStatus();
      if (status === 0) {
        console.log(hangUpOrderList)
        this.setState({
          hangUpOrderList
        })
      }

    }
    this.props.reqShopList()
  }

  // 为选中项添加active样式
  addChosenActive = (text) => {
    const newChooseArr = [...this.state.chooseArr]
    newChooseArr.map(item => {
      if (item.text === text) {
        item.isChosen = true
        this.setState({
          chooseArr: [...newChooseArr]
        })
      } else {
        item.isChosen = false
        this.setState({
          chooseArr: [...newChooseArr]
        })
      }
    })
  }

  // 排列数组 默认降序
  sortArr = (column, arr) => {
    return this.state.desc ? arr.sort((a, b) => (b[column] - a[column])) : arr.sort((a, b) => (a[column] - b[column]))
  }

  // 点击排序时逻辑处理
  handleChoose = (e) => {
    //  点击有两种情况
    // 一种是默认已经选中
    const text = e.target.innerHTML
    let isChosen = e.target.classList.contains('active')
    let newShops = [...this.state.shops]
    let { desc } = this.state
    if (text === '默认' && isChosen) {
      this.setState({
        shops: this.state.originShops,
      })
    } else if (text === '默认' && !isChosen) {
      // 按ID排序
      // 默认选项添加class active
      this.setState({
        shops: this.sortArr('sid', newShops, !desc),
        desc: !this.state.desc
      })
      this.addChosenActive(text)
    } else if (text === '评论数量' && isChosen) {
      // 默认是按销量降序 --> 变成升序
      this.setState({
        shops: this.sortArr('comment_count', newShops, desc),
        desc: !this.state.desc
      })
      isChosen = !isChosen
      // 把state中获取的商家信息按照评分重新排序哇
    } else if (text === '评论数量' && !isChosen) {
      // 销量降序
      // 销量选项添加class active
      this.setState({
        shops: this.sortArr('comment_count', newShops, !desc),
        desc: !this.state.desc
      })
      isChosen = !isChosen
      this.addChosenActive(text)
    } else if (text === '评分' && isChosen) {
      // 默认评分降序 -> 变成升序
      // 把state中获取的商家信息按照销量重新排序哇
      this.setState({
        shops: this.sortArr('rating', newShops, desc),
        desc: !this.state.desc
      })
    } else {
      this.setState({
        shops: this.sortArr('rating', newShops, !desc),
        desc: !this.state.desc
      })
      this.addChosenActive(text)
    }
  }

  // 获取当前年月日格式化后的时间
  handleGetYearMothDay = (date = new Date()) => {
    let year = date.getFullYear();
    let month = (date.getMonth() + 1) >= 10 ? (date.getMonth() + 1) : "0" + (date.getMonth() + 1);
    let day = date.getDate() >= 10 ? date.getDate() : "0" + date.getDate();
    let tempDate = year + "-" + month + "-" + day; //输出格式：xxxx-xx-xx
    return tempDate
  }

  // 处理正在营业或没有营业
  handleIsOpen = (open_time, end_time) => {
    let now = +Date.now()
    let start_time = +new Date(this.handleGetYearMothDay() + ' ' + open_time)
    let close_time = +new Date(this.handleGetYearMothDay() + ' ' + end_time)
    return start_time < now && now < close_time
    /*<Shop chooseArr={this.state.chooseArr}
handleChoose={this.handleChoose}
addChosenActive={this.addChosenActive}
shopList={this.props.shops}
handleIsOpen={this.handleIsOpen}*/
  }

  render () {
    if (parseInt(localStorage.getItem("roleId")) === 2) {
      return <Delivery
        hangUpOrderList={this.state.hangUpOrderList}
      />
    }
    return (
      <Shop chooseArr={this.state.chooseArr}
        handleChoose={this.handleChoose}
        addChosenActive={this.addChosenActive}
        shopList={this.state.shops}
        handleIsOpen={this.handleIsOpen}
      />
    )
  }
}

export default connect(
  state => ({ shops: state.shops }),
  { reqShopList }
)(Shops)