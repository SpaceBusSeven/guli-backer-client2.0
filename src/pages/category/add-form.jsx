import React,{Component} from 'react'
import {Form, Input, Select} from 'antd'
import PropTypes from 'prop-types'

const Item = Form.Item
const Option = Select.Option

class AddForm extends Component{

  static propTypes = {
    setForm: PropTypes.func.isRequired,
    parentId: PropTypes.string.isRequired,
    categorys: PropTypes.array.isRequired
  }
  componentDidMount() {
    this.props.setForm(this.props.form)
  }

  render() {
    const getFieldDecorator = this.props.form.getFieldDecorator
    const {categorys, parentId} = this.props

    return (
      <Form>
        <Item label='所属分类'>
          {
            getFieldDecorator('parentId', {
              initialValue: parentId
            })(
              <Select>
                <Option key='0' value='0'>一级分类</Option>
                {
                  categorys.map(c => <Option key={c._id} value={c._id}>{c.name}</Option>)
                }
              </Select>
            )
          }
        </Item>
        <Item label="分类名称">
          {
            getFieldDecorator('categoryName', {
              initialValue: ''
            })(<Input placeholder='input category name'/>)
          }
        </Item>
      </Form>
    )
  }
}
export default Form.create()(AddForm)
