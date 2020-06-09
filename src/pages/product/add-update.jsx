import React,{Component} from 'react'
import {Card, Icon, Form, message, Cascader, Button, Input} from "antd";
import PictureWall from './picture-wall'
import RichTextEditor from './rich-text-editor'
import {reqProductAddUpdate, reqCategorys} from "../../api";
import LinkButton from "../../components/link-button";

const Item = Form.Item
const TextArea = Input.TextArea

class AddUpdate extends Component{

  state = { options: [] }
  constructor(props) {
    super(props)
    this.pw = React.createRef()
    this.rte = React.createRef()
  }
  loadData = async (selectedOptions) => {
    const targetOption = selectedOptions[selectedOptions.length - 1]
    targetOption.loading = true
    const subCategorys = await this.getCategorys(targetOption.value)
    targetOption.loading = false
    if (subCategorys && subCategorys.length > 0){
      const cOptions = subCategorys.map(child => ({
        value: child._id,
        label: child.name,
        isLeaf: true
      }))
      targetOption.children = cOptions
    } else {
      targetOption.isLeaf = true
    }
    this.setState({
      options: [...this.state.options]
    })
  }
  getCategorys = async (parentId) => {
    const result = await reqCategorys(parentId)
    if (result.status === 0) {
        const categorys = result.data
        if (parentId === '0') {
          this.initOptions(categorys)
        } else {
          return categorys
        }
    }
  }
  initOptions = async (categorys) => {
    const options = categorys.map(category => ({
      value: category._id,
      label: category.name,
      isLeaf: false
    }))
    const {product, isUpdate} = this
    if (isUpdate && product.pCategoryId !== '0') {
      const subCategorys = await this.getCategorys(product.pCategoryId)
      if (subCategorys && subCategorys.length > 0){
        const cOptions = subCategorys.map(child => ({
          value: child._id,
          label: child.name,
          isLeaf: true
        }))
        let targetOption = options.find(option => option.value === product.pCategoryId)
        targetOption.children = cOptions
      }
    }
    this.setState({ options })
  }
  validatePrice = (rule, value, callback) => {
    value = value * 1
    if (value > 0) {
      callback()
    } else {
      callback('price > 0')
    }
  }
  submit = () => {
    this.props.form.validateFields( async (error, values) => {
      if (!error) {
        const {name, desc, price, categoryIds } = values

        const imgs = this.pw.current.getImgs()
        const detail = this.rte.current.getDetail()

        let pCategoryId = '0'
        let categoryId = ''
        if(categoryIds.length > 1) {
          pCategoryId = categoryIds[0]
          categoryId = categoryIds[1]
        } else {
          categoryId = categoryIds[0]
        }
        let product = {name, desc, price, imgs, detail, pCategoryId, categoryId}
        if (this.isUpdate) {
          product._id = this.product._id
        }
        const result = await reqProductAddUpdate(product)
        if (result.status === 0) {
          message.success('save product success')
          this.props.history.goBack()
        } else {
          message.error('save product failed')
        }
      }
    })
  }
  componentWillMount() {
    const product = this.props.location.state
    this.product = product || {}
    this.isUpdate = !!product
  }
  componentDidMount() {
    this.getCategorys('0')
  }

  render() {
    const {product, isUpdate} = this
    const {pCategoryId, categoryId} = product
    const options = this.state.options
    const {getFieldDecorator} = this.props.form

    const categoryIds = []
    if(isUpdate){
      if(pCategoryId === '0'){
        categoryIds.push(categoryId)
      } else {
        categoryIds.push(pCategoryId)
        categoryIds.push(categoryId)
      }
    }


    const title = (
      <LinkButton onClick={() => this.props.history.goBack()}>
        <Icon type='arrow-left'></Icon>
        &nbsp;&nbsp;&nbsp;
        <span>{isUpdate ? '修改商品':'添加商品'}</span>
      </LinkButton>
    )

    return (
      <Card title={title}>
        <Form labelCol={{span:3}} wrapperCol={{span:9}}>
          <Item label='商品名称：'>
            {
              getFieldDecorator('name',{
                initialValue: product.name,
                rules: [{ required:true, message:'input name'}]
              })(<Input placeholder='input product name'/>)
            }
          </Item>
          <Item label='商品描述：'>
            {
              getFieldDecorator('desc',{
                initialValue: product.desc,
                rules: [{ required:true, message:'input desc'}]
              })(<TextArea placeholder='input product desc' autoSize/>)
            }
          </Item>
          <Item label='商品价格：'>
            {
              getFieldDecorator('price',{
                initialValue: product.price,
                rules: [{ validator: this.validatePrice }]
              })(<Input placeholder='input product price' addonAfter='元'/>)
            }
          </Item>
          <Item label='商品分类：'>
            {
              getFieldDecorator('categoryIds',{
                initialValue: categoryIds,
                rules: [{ required:true, message:'input categoryIds'}]
              })(<Cascader options={options} loadData={this.loadData}></Cascader>)
            }
          </Item>
          <Item label='商品图片：'>
            <PictureWall ref={this.pw} imgs={product.imgs} ></PictureWall>
          </Item>
          <Item label='商品名称：' labelCol={{span:3}} wrapperCol={{span:18}}>
            <RichTextEditor ref={this.rte} detail={product.detail} ></RichTextEditor>
          </Item>
          <Button type='primary' onClick={this.submit}>提交</Button>
        </Form>
      </Card>
    )
  }
}
export default Form.create()(AddUpdate)
