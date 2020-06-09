import React,{Component} from 'react'
import {Route, Switch, Redirect} from "react-router-dom";
import Detail from './detail'
import Home from './home'
import AddUpdate from './add-update'
export default class Product extends Component{
  render() {
    return (
      <Switch>
        <Route path='/product' component={Home} exact></Route>
        <Route path='/product/detail' component={Detail}></Route>
        <Route path='/product/addupdate' component={AddUpdate}></Route>
        <Redirect to='/product'></Redirect>
      </Switch>
    )
  }
}
