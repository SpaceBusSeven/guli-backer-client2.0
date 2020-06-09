import React,{PureComponent} from 'react'
import {Form, Input, Tree} from 'antd'
import PropTypes from 'prop-types'
import menuList from '../../config/menuConfig'

const TreeNode = Tree.TreeNode
const Item = Form.Item

export default class AuthForm extends PureComponent{

  static propTypes = {
    role: PropTypes.object.isRequired
  }
  constructor(props){
    super(props)
    const {menus} = this.props.role
    this.state = { checkedKeys:menus }
  }
  getTreeNodes = (menuList) => {
    return menuList.reduce((pre, item) => {
      pre.push(
        <TreeNode key={item.key} title={item.title}>
          {item.children?this.getTreeNodes(item.children):null}
        </TreeNode>
      )
      return pre
    }, [])
  }
  onCheck = checkedKeys => this.setState({ checkedKeys })
  getMenus = () => this.state.checkedKeys
  componentWillMount() {
    this.treeNodes = this.getTreeNodes(menuList)
  }
  componentWillReceiveProps(nextProps, nextContext) {
    const menus = nextProps.role.menu
    this.setState({ checkedKeys: menus })
  }

  render() {
    const checkedKeys = this.state.checkedKeys
    const role = this.props.role

    return (
      <Form>
        <Item label="角色名称：" labelCol={{span:4}} wrapperCol={{span:16}}>
          <Input value={role.name} disabled/>
        </Item>
        <Item>
          <Tree
            checkable
            defaultExpandAll={true}
            checkedKeys={checkedKeys}
            onCheck={this.onCheck}
          >
            <TreeNode title='平台权限' key='all'>{this.treeNodes}</TreeNode>
          </Tree>
        </Item>
      </Form>
    )
  }
}
