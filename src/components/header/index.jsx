import React,{Component} from 'react'
import {reqWeather} from "../../api";
import {withRouter} from 'react-router-dom'
import {Modal} from "antd";
import LinkButton from '../link-button'
import formatDate from '../../utils/formatDateUtil'
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import menuList from '../../config/menuConfig'

import './index.less'

class Header extends Component{

  state = {
    sysTime: formatDate(Date.now()),
    dayPictureUrl: '',
    weather: ''
  }

  getWeather = async () => {
    const {dayPictureUrl, weather} = await reqWeather('岳阳')
    this.setState({ dayPictureUrl, weather })
  }

  getSysTime = () => {
    this.timer = setInterval(() => {
      this.setState({ sysTime: formatDate(Date.now()) })
    }, 1000)
  }
  getTitle = () => {
    const path = this.props.location.pathname
    let title
    menuList.forEach(item => {
      if(item.key === path){
        title = item.title
      } else if (item.children) {
        const cItem = item.children.find(cItem => path.indexOf(cItem.key)===0)
        // 如果有值才说明有匹配的
        if(cItem) {
          // 取出它的title
          title = cItem.title
        }
      }
    })
    return title
  }
  logout = () => {
    Modal.confirm({
      content:'really logout ?',
      onOk: () => {
        storageUtil.removeUser()
        memoryUtil.user = {}
        this.props.history.replace('/login')
      },
      onCancel: () => {
        console.log('quit logout')
      }
    })
  }
  componentDidMount() {
    this.getWeather()
    this.getSysTime()
  }
  componentWillUnmount() {
    clearInterval(this.timer)
  }

  render() {
    const path = this.props.location.pathname
    const {sysTime, dayPictureUrl, weather} = this.state
    const {username} = memoryUtil.user
    const title = this.getTitle()

    return (
      <div className='header'>
        <div className='header-top'>
          <span>welcome&nbsp;{username}</span>
          &nbsp;&nbsp;
          <LinkButton onClick={this.logout}>logout</LinkButton>
        </div>
        <div className='header-bottom'>
          <div className='header-bottom-left'>{title}</div>
          <div className='header-bottom-right'>
            <span>{sysTime}</span>
            <img src={dayPictureUrl} alt="weather-img"/>
            <span>{weather}</span>
          </div>
        </div>
      </div>
    )
  }
}
export default withRouter(Header)
