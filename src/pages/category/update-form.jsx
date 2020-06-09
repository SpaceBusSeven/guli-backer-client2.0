import React,{Component} from 'react'
import {Form, Input} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item

class UpdateForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    categoryName: PropTypes.string.isRequired
  }
  componentDidMount() {
    console.log(this.props.categoryName)
    this.props.setForm(this.props.form)
  }

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    const {categoryName} = this.props
    return (
      <Form>
        <Item>
          {
            getFieldDecorator('categoryName', {
              initialValue: categoryName
            })(<Input placeholder='input category name'/>)
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(UpdateForm)
