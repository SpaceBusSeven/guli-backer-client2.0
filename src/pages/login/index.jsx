import React,{ Component } from 'react'
import { Redirect } from 'react-router-dom'
import { Form, Input, Button, Icon, message } from 'antd'
import { reqLogin } from "../../api";
import memoryUtil from '../../utils/memoryUtil'
import storageUtil from '../../utils/storageUtil'
import Logo from '../../assets/images/logo.png'
import './index.less'

const Item = Form.Item

class Login extends Component{

  pwdValidator = (rule, value, callback) => {
    if (value.length < 4) {
      callback('length > 4')
    } else if (value.length > 12) {
      callback('length > 12')
    } else if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      callback('a-z A-Z 0-9 _')
    } else {
      callback()
    }
  }
  login = () => {
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        const { username, password } = values
        const result = await reqLogin(username, password)
        if (result.status === 0) {
          message.success('login success')
          const user = result.data
          storageUtil.saveUser(user)
          memoryUtil.user = user
          this.props.history.replace('/')
        } else {
          message.error('login failed:'+result.msg)
        }
      }
    })
  }

  render() {
    if (memoryUtil.user && memoryUtil.user._id) {
      return <Redirect to='/'/>
    }
    const { getFieldDecorator } = this.props.form

    return (
      <div className='login'>
        <header className='login-header'>
          <img src={Logo} alt="logo"/>
          <h1>React项目: 后台管理系统</h1>
        </header>
        <section className='login-content'>
          <h3>用户登录</h3>
          <Form className='login-form' onSubmit={this.login}>
            <Item>
              {
                getFieldDecorator('username', {
                  rules: [
                    {required: true, whiteSpace: true, message: 'input must'},
                    {min: 4, message: 'length > 4'},
                    {max: 12, message: 'length < 12'},
                    {pattern: /^[a-zA-Z0-9_]+$/, message: 'a-z A-Z 0-9 _'}
                  ]
                })(
                  <Input
                    placeholder='input your username'
                    prefix={<Icon type='user' style={{color: 'rgba(0,0,0,.25)'}}/>}
                  />)
              }
            </Item>
            <Item>
              {
                getFieldDecorator('password', {
                  rules: [
                    {validator: this.pwdValidator}
                  ]
                })(
                  <Input
                    type='password'
                    placeholder='input your password'
                    prefix={<Icon type='lock' style={{color: 'rgba(0,0,0,.25)'}}/>}
                  />)
              }
            </Item>
            <Item>
              <Button type='primary' className='login-form-button' htmlType="submit">登录</Button>
            </Item>
          </Form>
        </section>
      </div>
    )
  }
}
export default Form.create()(Login)
