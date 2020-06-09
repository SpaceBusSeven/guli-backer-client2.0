import React,{Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class AddForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired,
  }
  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator

    return (
      <Form labelCol={{span:4}} wrapperCol={{span:16}}>
        <Item label="分类名称">
          {
            getFieldDecorator('roleName', {
              initialValue: '',
              rules:[{required:true, message:'must input role name'}]
            })(<Input placeholder='input role name'/>)
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)
