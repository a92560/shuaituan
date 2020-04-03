import React, {Component} from 'react';
import SearchBar from '../../components/search-bar/search-bar'
import TopBar from '../../components/top-bar/top-bar'
import {
    withRouter
} from 'react-router-dom'
import {
    Layout
} from 'element-react'

class Header extends Component {
    componentDidMount() {
        console.log('header-------',/\/detail\/\d+/.test(this.props.location.pathname))
    }

    render() {
        return (
            <div>
                <Layout.Row>
                    <Layout.Col>
                        <TopBar/>
                    </Layout.Col>
                </Layout.Row>
                <Layout.Row>
                    <Layout.Col>
                        <SearchBar/>
                        {/*{
                            /\/detail\/\d+/.test(this.props.location.pathname) ? null : <SearchBar/>
                        }*/}
                    </Layout.Col>
                </Layout.Row>
            </div>
        )
    }
}
export default withRouter(Header)