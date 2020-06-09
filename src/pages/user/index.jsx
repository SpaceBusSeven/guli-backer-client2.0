import React,{Component} from 'react'
import {Button, message, Table, Card, Modal} from "antd";
import LinkButton from '../../components/link-button'
import formatDate from "../../utils/formatDateUtil";
import {reqUserAddUpdate, reqUserDel, reqUsers} from "../../api";
import UserForm from './user-form'
import {PAGE_SIZE} from "../../config/constants";

export default class User extends Component{

  state = {
    showUser:false,
    loading:false,
    users:[],
    roles:[]
  }

  initColumns = () => {
    this.columns = [
      {
        title:'用户名',
        dataIndex: 'username'
      },
      {
        title:'邮箱',
        dataIndex: 'email',
      },
      {
        title:'电话',
        dataIndex: 'phone',
      },
      {
        title:'注册时间',
        dataIndex: 'create_time',
        render: formatDate
      },
      {
        title:'所属角色',
        dataIndex: 'role_id',
        render: role_id => this.roleNames[role_id]
      },
      {
        title:'操作',
        render: user => (
          <span>
            <LinkButton onClick={() => this.userUpdate(user)}>修改</LinkButton>
            &nbsp;&nbsp;
            <LinkButton onClick={() => this.userDel(user)}>删除</LinkButton>
          </span>
        )
      },
    ]
  }
  initRoleNames = (roles) => {
    this.roleNames = roles.reduce((pre, item) => {
      pre[item._id] = item.name
      return pre
    }, {})
  }
  getUsers = async () => {
    this.setState({loading: true})
    const result = await reqUsers()
    this.setState({loading: false})
    if(result.status===0) {
      const {users, roles} = result.data
      this.initRoleNames(roles)
      this.setState({ users, roles })
    } else {
      message.error('获取角色列表失败')
    }
  }
  userAdd = () => {
    this.setState({ showUser:true })
    this.user = null
  }
  userUpdate = (user) => {
    this.setState({ showUser:true })
    this.user = user
  }
  userAddUpdate = async () => {
    const user = this.form.getFieldsValue()
    this.userCancel()
    if (this.user) {
      user._id = this.user._id
    }
    const result = await reqUserAddUpdate(user)
    if (result.status === 0) {
      message.success('save user success')
      this.getUsers()
    } else {
      message.error('save failed')
    }
  }
  userCancel = () => {
    this.form.resetFields()
    this.setState({ showUser:false })
  }
  userDel = (user) => {
    Modal.confirm({
      content:'del user: '+user.username+' ?',
      onOk:async () => {
        const result = await reqUserDel(user._id)
        if (result.status === 0) {
          message.success('del user success')
          this.getUsers()
        } else {
          message.error('del failed')
        }
      }
    })
  }

  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getUsers()
  }

  render() {
    const {showUser, roles, users, loading} = this.state
    const columns = this.columns
    const user = this.user || {}

    const title = (
      <Button type='primary' onClick={this.userAdd}>创建用户</Button>
    )
    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          columns={columns}
          dataSource={users}
          pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper:true}}
        ></Table>
        <Modal
          visible={showUser}
          title={user._id?'修改用户':'添加用户'}
          onOk={this.userAddUpdate}
          onCancel={this.userCancel}
        >
          <UserForm setForm={form => this.form = form} user={user} roles={roles}></UserForm>
        </Modal>
      </Card>
    )
  }
}
