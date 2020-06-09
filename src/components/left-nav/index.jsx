import React,{Component} from 'react'
import { Link, withRouter } from "react-router-dom";
import { Menu, Icon } from 'antd'
import menuList from '../../config/menuConfig'
import memoryUtil from '../../utils/memoryUtil'
import Logo from '../../assets/images/logo.png'

import './index.less'
const { Item, SubMenu } = Menu
class LeftNav extends Component{

  hasAuth = (menuItem) => {
    const { isPublic, key } = menuItem
    const { username } = memoryUtil.user
    const { menus } = memoryUtil.user.role
    if (isPublic || username === 'admin' || menus.indexOf(key) !== -1) {
      return true
    } else if (menuItem.children) {
      return !!menuItem.children.find(child => menus.indexOf(child.key) !== -1)
    }
    return false
  }

  getMenuNodes = (menuList) => {
    const path = this.props.location.pathname
    return menuList.reduce((pre, item) => {
      if (this.hasAuth(item)) {
        if (!item.children) {
          pre.push(
            <Item key={item.key}>
              <Link to={item.key}>
                <Icon type={item.icon}></Icon>
                <span>{item.title}</span>
              </Link>
            </Item>
          )
        } else {
          if (item.children.find(child => path.indexOf(child.key) === 0)) {
            this.openKey = item.key
          }
          pre.push(
            <SubMenu
              key={item.key}
              title={
                <span>
                <Icon type={item.icon}></Icon>
                <span>{item.title}</span>
              </span>
              }
            >
              { this.getMenuNodes(item.children) }
            </SubMenu>
          )
        }
      }
      return pre
    }, [])
  }
  componentWillMount() {
    this.menuNodes = this.getMenuNodes(menuList)
  }

  render() {
    let path = this.props.location.pathname
    if(path.indexOf('/product') === 0){
      path = '/product'
    }
    const { menuNodes, openKey } = this
    return (
      <div className='left-nav'>
        <Link className='logo-link' to='/'>
          <img src={Logo} alt="logo"/>
          <h1>硅谷后台</h1>
        </Link>
        <Menu
          // defaultSelectedKeys={[path]}
          selectedKeys={[path]}
          defaultOpenKeys={[openKey]}
          mode="inline"
          theme="dark"
        >
          { menuNodes }
        </Menu>
      </div>
    )
  }
}
export default withRouter(LeftNav)
