/*
 * 包含n个请求接口的函数
 * 函数返回值 为promise
 */
import ajax from './ajax'
// 商家列表数据
export const reqShops = () => ajax('/api/shop/')

// 获取服务器后台生成的验证码 文字！用于校验
export const reqVerification = () => ajax('/api/b-user/text/verification')

// 用户用户登录
export const reqLogin = (user) => ajax('/api/b-user/login', user, 'POST')

// 获取手机验证码
export const reqPhoneCode = (phone) => ajax(`/api/b-user/phone/${phone}`)

// 注册普通用户
export const reqRegister = (user) => ajax('/api/b-user/register', user, 'POST')

// 获取商家详情
export const reqShopDetail = (shopId) => ajax(`/api/shop/${shopId}`)

// 获取商家商品详情
export const reqShopGoods = (shopId) => ajax(`/api/goods/shop/${shopId}`)

// 获取用户购物车数据
export const reqShoppingCart = (userId) => ajax(`/api/cart/${userId}`)

// 修改用户购物车数据
export const updShoppingCart = (userId, cartList) => ajax(`/api/cart/${userId}`, cartList, 'PATCH')

// 用户添加购物车数据
export const addShoppingCart = (userId, cartList) => ajax(`/api/cart/${userId}`, cartList, 'POST')

// 获取商家单件商品详情
export const reqShopGoodsDetail = (shopId, goodsId) => ajax(`/api/goods/${goodsId}/shop/${shopId}`)

// 获取商家评论列表
export const reqShopComments = (shopId) => ajax(`/api/comment/${shopId}`)

// 商家添加商品
export const addShopGoods = (shopId, goods) => ajax(`/api/shop/${shopId}/goods`, goods, 'POST')


// 上传单张图片
export const reqUploadPic = (shopId, pic) => ajax(`/api/shop/${shopId}/goods/images`, pic, 'POST', true)

// 上传多张图片
export const reqUploadPics = (pics) => ajax('/api/user/images/many', pics, 'POST', true)

// 用户删除购物车商品
export const delShopCart = (userId, cids) => ajax(`/api/cart/${userId}`, {data: {"cids": cids}}, 'DELETE')


// 用户购买商品
export const reqBuyGoods = (userId, data) => ajax(`/api/order/user/${userId}`, data, "POST")


// 获取用户订单
export const reqUserOrders = (userId) => ajax(`/api/order/user/${userId}`)

// 用户发表评论商家
export const postShopComment = (shopId, data) => ajax(`/api/comment/shop/${shopId}`, data, 'POST')


// 用户发表评论配送员
export const postDeliComment = (deliId, data) => ajax(`/api/comment/deli/${deliId}`, data, "POST")


// 获取用户信息
export const reqUserInfo = (r_id, roleId) => ajax(`/api/b-user/${r_id}/${roleId}`)

// 商家修改商品信息
export const updGoodsInfo = (gid, data) => ajax(`/api/goods/${gid}`, data, "PATCH")

// 商家删除商品信息
export const delGoodsInfo = (gid) => ajax(`/api/goods/${gid}`, {}, "DELETE")

// 获取单个商品信息
export const reqGoodInfo = (gid) => ajax(`/api/goods/${gid}`)

// 获取商家订单信息
export const reqShopOrders = (sid) => ajax(`/api/order/shop/${sid}`)


// 商家接单之后生成挂单表
export const postHangUpOrders = (oid, data) => ajax(`api/hang-order/${oid}`, data, "POST")

// 修改商家与普通用户之间的订单表的状态为待配送
export const postOrderStatus = (oid) => ajax(`/api/order/${oid}`, {}, "PATCH")

// 获取挂单表
export const reqHangUpOrders = () => ajax(`/api/hang-order/`)

// 获取挂单表status = 0
export const reqHangUpOrdersStatus = () => ajax(`/api/hang-order/?status=0`)

// 获取配送员的订单
export const reqDeliOrders = (deliId) => ajax(`/api/order/delivery/${deliId}`)

// 更新挂单表中的状态
export const patchHangOrderStatus = (oid, status, did) => ajax(`/api/hang-order/${oid}/${status} ${did ? `?did=${did}` : '?did=10086'}`, {}, "PATCH")


// 查看关于配送员的评论
export const reqOrderDeliComment = (oid, did) => ajax(`/api/comment/order/${oid}/deli/${did}`)

// 查看关于商家的评论
export const reqOrderShopComment = (oid, sid) => ajax(`/api/comment/order/${oid}/shop/${sid}`)

// 查看用户自己的评论
export const reqOrderUserComment = (oid, uid) => ajax(`/api/comment/order/${oid}/user/${uid}`)


// 获取用户银行卡信息
export const reqUserBankCard = (r_id) => ajax(`/api/bankcard/user/${r_id}`)

// 用户添加银行卡
export const postBankCard = (r_id, data) => ajax(`/api/bankcard/user/${r_id}`, data, "POST")

// 注册用户
export const reqUserRegister = (r_id, data) => ajax(`/api/user/${r_id}`, data, "POST")

// 注册商家
export const reqShopRegister = (r_id, data) => ajax(`/api/shop/${r_id}`, data, "POST")

// 注册配送员
export const reqDeliRegister = (r_id, data) => ajax(`/api/deli/${r_id}`, data, "POST")

// 商家更新图片列表
export const postShopImgList = (shopId, data) => ajax(`/api/shop/${shopId}/images/list`, data, "POST", true)

// 修改商家信息
export const updateShopInfo = (shopId, data) => ajax(`/api/shop/${shopId}`, data, "PATCH")

// 修改用户信息
export const updateUserInfo = (userId, data) => ajax(`/api/user/${userId}`, data, "PATCH")

// 修改配送员信息
export const updateDeliInfo = (did, data) => ajax(`/api/deli/${did}`, data, "PATCH")


// 获取与自己有关的挂单表
export const reqDeliHangOrder = (did) => ajax(`/api/hang-order/${did}`)

// 获取热门商家列表
export const reqHotShopList = (number) => ajax(`/api/shop/hot/${number}`)

// 获取建议商家列表
export const reqSuggestShopList = (number) => ajax(`/api/shop/suggest/${number}`)

// 通过关键词搜索商家
export const reqShopsByName = (name) => ajax(`/api/shop/search?k=${name}`)

// 获取热门城市
export const reqHotCityList = () => ajax(`/api/cities/hot`)

// 获取所有省份
export const reqProvinces = () => ajax(`/api/provinces/`)

// 获取特定省份下的所有城市
export const reqCities = (proID) => ajax(`/api/cities/${proID}`)

// 获取配送员信息
export const reqDeliInfo = (deliId) => ajax(`/api/deli/${deliId}`)

