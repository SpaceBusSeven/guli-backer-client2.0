import React,{Component} from 'react'
import {List, Icon, Card} from 'antd'
import {BASE_IMG_PATH} from "../../config/constants";
import LinkButton from '../../components/link-button'
import {reqCategoryInfo} from "../../api";
import './index.less'

const Item = List.Item

export default class Detail extends Component{

  state = {
    cName1: '',
    cName2: ''
  }

  getCategoryName = async () => {
    const {categoryId, pCategoryId} = this.props.location.state
    if (pCategoryId === '0') {
      const result = await reqCategoryInfo(categoryId)
      if (result.status === 0) {
        this.setState({ cName1:result.data.name })
      }
    } else {
      const results = await Promise.all([reqCategoryInfo(pCategoryId), reqCategoryInfo(categoryId)])
      this.setState({
        cName1: results[0].data.name,
        cName2: results[1].data.name
      })
    }
  }
  componentDidMount() {
    this.getCategoryName()
  }

  render() {
    const product = this.props.location.state
    const {cName1, cName2} = this.state
    const title = (
      <LinkButton onClick={() => this.props.history.goBack()}>
        <Icon type='arrow-left'></Icon>
        &nbsp;&nbsp;&nbsp;
        <span>商品详情</span>
      </LinkButton>
    )
    return (
      <Card title={title} className='product-detail' >
        <List>
          <Item>
            <span className='left'>商品名称：</span>
            <span>{product.name}</span>
          </Item>
          <Item>
            <span className='left'>商品描述：</span>
            <span>{product.desc}</span>
          </Item>
          <Item>
            <span className='left'>商品价格：</span>
            <span>{product.price}元</span>
          </Item>
          <Item>
            <span className='left'>所属分类：</span>
            <span>{cName1 + (cName2 ? ' --> '+cName2:'')}</span>
          </Item>
          <Item>
            <span className='left'>商品图片：</span>
            <span>{
              product.imgs.map(img => <img src={BASE_IMG_PATH+img} key={img} alt="img" className='img'/>)
            }</span>
          </Item>
          <Item>
            <span className='left'>商品详情：</span>
            <div dangerouslySetInnerHTML={{__html: product.detail}}></div>
          </Item>
        </List>
      </Card>
    )
  }
}
