import React,{Component} from 'react'
import {reqProductSearch, reqProducts, reqProductUpdateStatus} from "../../api";
import { Card, Table, message, Icon, Button, Input, Select} from "antd";
import LinkButton from '../../components/link-button'
import {PAGE_SIZE} from "../../config/constants";

const Option = Select.Option

export default class Home extends Component{

  state = {
    productType:'productName',
    productName:'',
    products:[],
    total:1,
    loading: false
  }

  initColumns = () => {
    this.columns = [
      {
        title:'商品名称',
        dataIndex:'name'
      },
      {
        title:'商品描述',
        dataIndex:'desc'
      },
      {
        title:'商品价格',
        dataIndex:'price',
        render:price => <span>￥{price}</span>
      },
      {
        title:'状态',
        width:100,
        dataIndex:'status',
        render:(status, product) => {
          const btnText = status === 1?'下架':'上架'
          const text = status === 1?'在售':'已下架'
          status = status === 1?2:1
          return (
            <span>
              <Button type='primary' onClick={() => this.updateStatus(status, product)}>{btnText}</Button>
              <span>{text}</span>
            </span>
          )
        }
      },
      {
        title:'操作',
        width:100,
        render: product => (
          <span>
            <LinkButton onClick={() => this.props.history.push('/product/detail', product)}>详情</LinkButton>
            <LinkButton onClick={() => this.props.history.push('/product/addupdate', product)}>修改</LinkButton>
          </span>
        )
      },
    ]
  }
  updateStatus = async (status, product) => {
    const productId = product._id
    const result = await reqProductUpdateStatus(productId, status)
    if (result.status === 0) {
      message.success('update status success')
      this.getProducts(this.pageNum)
    } else {
      message.error('update status failed')
    }
  }
  getProducts = async (pageNum) => {
    this.setState({ loading: false })
    this.pageNum = pageNum
    const {productType, productName} = this.state
    let result
    if (!productName) {
      result = await reqProducts(pageNum, PAGE_SIZE)
    }else {
      result = await reqProductSearch({pageNum, pageSize:PAGE_SIZE, productName, productType})
    }
    this.setState({ loading:false })
    if (result.status === 0) {
      const {total, list} = result.data
      this.setState({ total, products:list})
    } else {
      message.error('get products error:'+result.msg)
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getProducts(1)
  }

  render() {
    const {productName, productType, products, total, loading} = this.state
    const {columns} = this

    const title = (
      <span>
        <Select value={productType} onChange={value => this.setState({ productType: value})}>
          <Option value='productName' key='productName'>按名称搜索</Option>
          <Option value='productDesc' key='productName'>按描述搜索</Option>
        </Select>
        <Input
          placeholder='关键字'
          value={productName}
          onChange={event => this.setState({ productName: event.target.value })}
          style={{width: 150, marginLeft: 10, marginRight: 10}}
        />
        <Button type='primary' onClick={() => this.getProducts(1)}>搜索</Button>
      </span>
    )
    const extra = (
      <Button type='primary' onClick={() => this.props.history.push('/product/addupdate')}>
        <Icon type='plus'></Icon>
        <span>添加商品</span>
      </Button>
    )
    return (
      <Card title={title} extra={extra}>
        <Table
          bordered
          rowKey='_id'
          dataSource={products}
          loading={loading}
          columns={columns}
          pagination={{
            current: this.pageNum,
            defaultPageSize:PAGE_SIZE,
            showQuickJumper:true,
            total,
            onChange:this.getProducts}}
        ></Table>
      </Card>
    )
  }
}
