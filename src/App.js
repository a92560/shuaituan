import React, {Component} from 'react';
import Shops from './containers/shops/shops'
import {
    Route,
    Switch,
    withRouter
} from 'react-router-dom'
import {
    Layout
} from 'element-react'
import Detail from './containers/detail/detail'
import Aside from './components/aside/aside.jsx'
import Order from './components/order/order'
import Personal from "./containers/personal/personal";
import Wallet from "./components/wallet/wallet";
import Cart from "./containers/cart/cart";
import Buy from './containers/buy/buy'
import Delivery from "./components/delivery/delivery";

class App extends Component{
  render (){
    return (
        <Switch>
            <Route path='/' exact component={Shops}/>
            <Route path='/detail/:shopId' exact component={Detail} key={this.props.location.pathname}/>
            <Route path='/personal' exact render={() => (
                <Layout.Row style={{backgroundColor: '#F8F8F8'}}>
                    <Aside/>
                    <Personal/>
                </Layout.Row>
            )}/>
            <Route path='/order' render={() => (
                <Order/>
            )}/>
            <Route path="/wallet" exact render={ () => (
                <Layout.Row style={{backgroundColor: '#F8F8F8'}}>
                    <Aside/>
                    <Wallet/>
                </Layout.Row>
            )}/>
            <Route path="/cart" exact render={ () => (
                <Layout.Row style={{backgroundColor: '#F8F8F8'}}>
                    <Aside/>
                    <Cart/>
                </Layout.Row>
            )}/>
            <Route path="/shop/:shopId/buy/:goodsId" component={Buy}/>
            <Route path="/delivery" component={Delivery}/>
            <Route component={Shops}/>
        </Switch>
    )
  }
}

export default withRouter(App);
