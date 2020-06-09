import React,{Component} from 'react'
import { Card, Table, message, Modal, Icon, Button} from "antd";
import LinkButton from '../../components/link-button'
import {reqCategorys, reqCategoryUpdate, reqCategoryAdd} from "../../api";
import AddForm from './add-form'
import UpdateForm from './update-form'

export default class Category extends Component{

  state = {
    showStatus: 0,
    categorys: [],
    subCategorys: [],
    parentId: '0',
    parentName: '',
    loading: false
  }

  initColumns = () => {
    this.columns = [
      {
        title:'分类的名称',
        dataIndex: 'name'
      },
      {
        title: '操作',
        width: 300,
        render: (category) => ( // 返回需要显示的界面标签
          <span>
            <LinkButton onClick={() => this.showUpdate(category)}>修改分类</LinkButton>
            {/*如何向事件回调函数传递参数: 先定义一个匿名函数, 在函数调用处理的函数并传入数据*/}
            {this.state.parentId==='0' ?
              <LinkButton onClick={() => this.showSubCategorys(category)}>查看子分类</LinkButton> : null}

          </span>
        )
      }
    ]
  }
  getCategorys = async (parentId) => {

    this.setState({loading: true})
    parentId = parentId || this.state.parentId
    const result = await reqCategorys(parentId)
    this.setState({loading: false})

    if(result.status===0) {
      if(parentId==='0') {
        this.setState({
          categorys: result.data
        })
      } else {
        // 更新二级分类状态
        this.setState({
          subCategorys: result.data
        })
      }
    } else {
      message.error('获取分类列表失败')
    }
  }

  showSubCategorys = (category) => {
    // 更新状态
    this.setState({
      parentId: category._id,
      parentName: category.name
    }, () => {
      this.getCategorys()
    })
  }

  showCategorys = () => {
    this.setState({
      subCategorys: [],
      parentId: '0',
      parentName: '',
    })
  }
  showAdd = () => {
    this.setState({ showStatus:1 })
  }
  showUpdate = (category) => {
    this.category = category
    this.setState({ showStatus:2 })
  }
  handleCancel = () => {
    this.setState({ showStatus:0 })
    this.form.resetFields()
  }
  addCategory = async () => {
    const {parentId, categoryName} = this.form.getFieldsValue()
    this.handleCancel()
    const result = await reqCategoryAdd(parentId, categoryName)
    if (result.status === 0) {
      if(parentId === this.state.parentId) {
        this.getCategorys()
      } else if(parentId === '0'){
        this.getCategorys('0')
      }
    } else {
      message.error('add category failed')
    }
  }
  updateCategory = async () => {
    const {categoryName} = this.form.getFieldsValue()
    const categoryId = this.category._id
    this.handleCancel()
    const result = await reqCategoryUpdate(categoryId, categoryName)
    if (result.status === 0) {
      this.getCategorys()
    } else {
      message.error('update category failed')
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getCategorys()
  }

  render() {
    const {loading, categorys, subCategorys, showStatus, parentId, parentName} = this.state
    const {columns} = this
    const category = this.category || {}
    const title =
      parentId === '0' ?
        <span>一级分类列表</span>:
        <span>
          <LinkButton onClick={this.showCategorys}>一级分类列表</LinkButton>&nbsp;
          <Icon type='arrow-right'></Icon>&nbsp;
          <span>{parentName}</span>
        </span>

    const extra = (
      <Button type='primary' onClick={this.showAdd}>
        <Icon type='plus'></Icon>
        <span>添加分类</span>
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={parentId==='0' ? categorys : subCategorys}
          columns={columns}
          pagination={{defaultPageSize: 5, showQuickJumper: true}}
        />
        <Modal
          title='添加分类'
          visible={showStatus===1}
          onOk={this.addCategory}
          onCancel={this.handleCancel}
        >
          <AddForm setForm={form => this.form = form} parentId={parentId} categorys={categorys}></AddForm>
        </Modal>
        <Modal
          title='更新分类'
          visible={showStatus===2}
          onOk={this.updateCategory}
          onCancel={this.handleCancel}
        >
          <UpdateForm setForm={form => this.form = form} categoryName={category.name}/>
        </Modal>
      </Card>
    )
  }
}
