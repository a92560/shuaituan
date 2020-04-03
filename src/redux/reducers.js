import {combineReducers} from 'redux'
import {
    RECEIVE_SELECTED_INDEX,
    RECEIVE_SHOP_LIST,
    RECEIVE_TAB_NAME,
    RECEIVE_SHOP_DETAIL,
    RECEIVE_SHOPPING_CART,
    UPDATE_SHOPPING_CART,
    RECEIVE_USER_INFO,
    RECEIVE_ORDERS,
} from "./action-types";

// 初始化商家数组
const initShops = []

function shops(state = initShops, action) {
    switch (action.type) {
        case RECEIVE_SHOP_LIST:
            return action.data
        default:
            return state
    }
}


// 初始化aside选中的selectedIndex和tab 选项卡的 tabName
const initAsideTab = {
    selectedIndex: '1-1',
    tabName: '全部订单'
}

function asideTab(state = initAsideTab, action) {
    switch (action.type) {
        case RECEIVE_SELECTED_INDEX:
            return {...state, ...action.data}
        case RECEIVE_TAB_NAME:
            return {...state, ...action.data}
        default:
            return state
    }
}

// 初始化用户数据
const initUser = {
    username: '', // 用户名
    balance: '', // 余额
    user: {
        u_name: '', // 真实姓名
        phone: '', // 手机号码
        u_address: '', // 用户地址
        id: '', // 用户ID
        pay_password: '', // 支付密码
    },
    roleId: '', // 身份ID
}

function user(state = initUser, action) {
    switch (action.type) {
        case RECEIVE_USER_INFO:
            return action.data
        default:
            return state
    }
}

const initShopDetail = []

function shopDetail(state = initShopDetail, action) {
    switch (action.type) {
        case RECEIVE_SHOP_DETAIL:
            return action.data
        default:
            return state
    }
}

const initShoppingCart = []

function shoppingCart(state = initShoppingCart, action) {
    switch (action.type) {
        case RECEIVE_SHOPPING_CART:
            return action.data
        case UPDATE_SHOPPING_CART:
            return action.data
        default:
            return state
    }
}

const initOrders = []

function order(state = initOrders, action) {
    switch (action.type) {
        case RECEIVE_ORDERS:
            return action.data
        default:
            return state
    }
}

export default combineReducers({
        shops,
        asideTab,
        shopDetail,
        shoppingCart,
        user,
        order
    }
)

