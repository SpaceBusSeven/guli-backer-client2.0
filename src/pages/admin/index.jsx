import React,{Component} from 'react'
import { Switch, Route, Redirect } from "react-router-dom"
import { Layout } from 'antd'
import storageUtil from '../../utils/storageUtil'

import Header from '../../components/header'
import LeftNav from '../../components/left-nav'
import Home from '../home'
import Category from '../category'
import Product from '../product'
import Role from '../role'
import User from '../user'
import Line from '../charts/line'
import Bar from '../charts/bar'
import Pie from '../charts/pie'
import NotFound from '../not-found'
import './index.less'
const { Footer, Sider, Content } = Layout

export default class Admin extends Component{

  render() {

    if (!storageUtil.getUser()._id) {
      return <Redirect to='/login'></Redirect>
    }

    return (
      <Layout className='admin'>
        <Sider>
          <LeftNav></LeftNav>
        </Sider>
        <Layout>
          <Header>Header</Header>
          <Content className='admin-content'>
            <Switch>
              <Redirect from='/' exact to='/home'></Redirect>
              <Route path='/home' component={Home}></Route>
              <Route path='/category' component={Category}></Route>
              <Route path='/role' component={Role}></Route>
              <Route path='/product' component={Product}></Route>
              <Route path='/user' component={User}></Route>
              <Route path='/charts/line' component={Line}></Route>
              <Route path='/charts/bar' component={Bar}></Route>
              <Route path='/charts/pie' component={Pie}></Route>
              <Route component={NotFound}></Route>
            </Switch>
          </Content>
          <Footer className='admin-footer'>推荐使用谷歌浏览器，可以获得更佳页面操作体验</Footer>
        </Layout>
      </Layout>
    )
  }
}
