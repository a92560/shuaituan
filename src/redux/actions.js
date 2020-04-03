import {
  reqLogin,
  reqShopDetail,
  reqShoppingCart,
  reqShops,
  reqUserInfo,
  reqUserOrders,
  updShoppingCart
} from '../api'

import { Notification } from 'element-react'

import {
  ERROR_MSG,
  RECEIVE_SELECTED_INDEX,
  RECEIVE_SHOP_LIST,
  RECEIVE_TAB_NAME,
  RECEIVE_SHOP_DETAIL,
  RECEIVE_SHOPPING_CART,
  UPDATE_SHOPPING_CART,
  RECEIVE_USER_INFO,
  RECEIVE_ORDERS
} from './action-types'

// 同步获取商家列表
const receiveShopList = shops => ({ type: RECEIVE_SHOP_LIST, data: shops })

// 同步获取商家详情
const receiveShopDetail = shop => ({ type: RECEIVE_SHOP_DETAIL, data: shop })

// 同步获取用户购物车数据
const receiveUserCart = cart => ({ type: RECEIVE_SHOPPING_CART, data: cart })

// 同步更新购物车数据
const updateUserCart = newCart => ({
  type: UPDATE_SHOPPING_CART,
  data: newCart
})

// 同步接受用户信息
const receiveUserInfo = userInfo => ({
  type: RECEIVE_USER_INFO,
  data: userInfo
})

// 错误提示
const receiveError = msg => ({ type: ERROR_MSG, data: msg })

// 获取选中的subMenu的index值
export const receiveSelectedIndex = selectedIndex => ({
  type: RECEIVE_SELECTED_INDEX,
  data: selectedIndex
})

//获取选中的tab栏的tabName
export const receiveTabName = tabName => ({
  type: RECEIVE_TAB_NAME,
  data: tabName
})

// 同步获取订单
const receiveOrders = orders => ({ type: RECEIVE_ORDERS, data: orders })

// 发送异步请求获取商家列表数组
export const reqShopList = () => {
    return async dispatch => {
      const {
        data: {
          status,
          data: { data: shopList }
        }
      } = await reqShops()
      if (status === 0) {
        dispatch(receiveShopList(shopList))
      }
    }
  }
  // 发送异步请求获取商家详情
export const reqShop = shopId => {
    return async dispatch => {
      const {
        data: {
          status,
          data: { data: shopDetail }
        }
      } = await reqShopDetail(shopId)
      if (status === 0) {
        dispatch(receiveShopDetail(shopDetail))
      }
    }
  }
  // 发送异步请求获取购物车数据
export const reqCart = userId => {
  return async dispatch => {
    const {
      data: {
        status,
        data: { data: shoppingCart }
      }
    } = await reqShoppingCart(userId)
    if (status === 0) {
      dispatch(receiveUserCart(shoppingCart))
    }
  }
}

// 发送异步请求更新购物车数据
export const updateCart = (userId, cartList) => {
  return async dispatch => {
    const {
      data: {
        status,
        data: { data: shoppingCart }
      }
    } = await updShoppingCart(userId, cartList)
    if (status === 0) {
      console.log(shoppingCart)
    }
  }
}

// 异步登录请求
export const login = (username, password) => {
  return async dispatch => {
    const {
      data: {
        status,
        data: { data: userInfo },
        message
      }
    } = await reqLogin({ username, password })
    if (status === 0) {
      dispatch(receiveUserInfo(userInfo))
    } else {
      Notification({
        type: 'error',
        message
      })
    }
  }
}

// 异步获取订单请求
export const reqOrders = userId => {
  return async dispatch => {
    const {
      data: {
        status,
        message,
        data: { data: orderList }
      }
    } = await reqUserOrders(userId)
    if (status === 0 && message === '成功') {
      dispatch(receiveOrders(orderList))
    }
  }
}

// 异步获取用户信息请求
export const reqUserInformation = (r_id, roleId) => {
  return async dispatch => {
    const {
      data: {
        status,
        data: { data: userInfo }
      }
    } = await reqUserInfo(r_id, roleId)
    if (status === 0) {
      dispatch(receiveUserInfo(userInfo))
    }
  }
}