import React,{Component} from 'react'
import {Form, Input, Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class UserForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    user:PropTypes.object,
    roles:PropTypes.array
  }
  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    const {user, roles} = this.props

    return (
      <Form labelCol={{span:4}} wrapperCol={{span:16}}>
        <Item label="用户名：">
          {
            getFieldDecorator('username', {
              initialValue: user.username,
              rules:[{required:true, message:'must input username'}]
            })(<Input placeholder='input username'/>)
          }
        </Item>
        {
          user._id?null:
            (<Item label="密码：">
              {
                getFieldDecorator('password', {
                  initialValue: "",
                  rules:[{required:true, message:'must input password'}]
                })(<Input type='password' placeholder='input password'/>)
              }
            </Item>)
        }
        <Item label="邮箱：">
          {
            getFieldDecorator('email', {
              initialValue: user.email,
              rules:[{required:true, message:'must input email'}]
            })(<Input placeholder='input email'/>)
          }
        </Item>
        <Item label="电话：">
          {
            getFieldDecorator('phone', {
              initialValue: user.phone,
              rules:[{required:true, message:'must input phone'}]
            })(<Input placeholder='input phone'/>)
          }
        </Item>
        <Item label="角色：">
          {
            getFieldDecorator('role_id', {
              initialValue: user.role_id
            })(
              <Select>
                {
                  roles.map(role => <Option key={role._id} value={role._id}>{role.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UserForm)
