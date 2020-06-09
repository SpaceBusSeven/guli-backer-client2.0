import React,{Component} from 'react'
import { Card, Table, message, Modal, Button} from "antd";
import {reqRoles, reqRoleUpdate, reqRoleAdd} from "../../api";
import {PAGE_SIZE} from "../../config/constants";
import formatDate from '../../utils/formatDateUtil'
import memoryUtil from '../../utils/memoryUtil'
import AddForm from './add-form'
import AuthForm from './auth-form'

export default class Role extends Component{

  state = {
    role:{},
    roles:[],
    showAuth:false,
    showAdd:false,
    loading:false
  }
  constructor(props) {
    super(props)
    this.auth = React.createRef()
  }

  initColumns = () => {
    this.columns = [
      {
        title:'角色名称',
        dataIndex: 'name'
      },
      {
        title:'创建时间',
        dataIndex: 'create_time',
        render: formatDate
      },
      {
        title:'授权时间',
        dataIndex: 'auth_time',
        render: formatDate
      },
      {
        title:'授权人',
        dataIndex: 'auth_name'
      }
    ]
  }
  getRoles = async () => {
    this.setState({loading: true})
    const result = await reqRoles()
    this.setState({loading: false})
    if(result.status===0) {
      this.setState({ roles:result.data })
    } else {
      message.error('获取角色列表失败')
    }
  }
  onRow = (role) => {
    return {
      onClick: event => this.setState({ role })
    }
  }
  addRole = () => {
    this.form.validateFields(async (error, values) => {
      if(!error) {
        const {roleName} = values

        this.setState({ showAdd:false})
        this.form.resetFields()

        const result = await reqRoleAdd(roleName)
        if (result.status === 0) {
          message.success('add role success')
          const role = result.data
          this.setState(state => ({roles:[...this.state.roles,role]}))
        } else {
          message.error('add failed')
        }
      }
    })
  }
  authSet = async () => {
    this.setState({ showAuth:false })
    const role = this.state.role
    role.menus = this.auth.current.getMenus()
    role.auth_time = Date.now()
    role.auth_name = memoryUtil.user.username
    const result = await reqRoleUpdate(role)
    if (result.status === 0) {
      message.success('set auth success')
      this.setState({ roles:[...this.state.roles]})
    } else {
      message.error('set auth error')
    }
  }
  componentWillMount() {
    this.initColumns()
  }
  componentDidMount() {
    this.getRoles()
  }

  render() {
    const {role, roles, showAdd, showAuth, loading} = this.state
    const {columns} = this
    const title = (
      <span>
        <Button type='primary' onClick={() => this.setState({showAdd:true})}>创建角色</Button>&nbsp;&nbsp;
        <Button
          type='primary'
          disabled={!role._id?true:false}
          onClick={() => this.setState({showAuth:true})}
        >设置角色权限</Button>
      </span>
    )

    return (
      <Card title={title}>
        <Table
          bordered
          rowKey='_id'
          loading={loading}
          dataSource={roles}
          columns={columns}
          rowSelection={{
            type:'radio',
            selectedRowKeys:[role._id],
            onSelect:role => this.setState({role})
          }}
          onRow={this.onRow}
          pagination={{defaultPageSize:PAGE_SIZE, showQuickJumper:true}}
        ></Table>
        <Modal
          visible={showAdd}
          title='添加角色'
          onOk={this.addRole}
          onCancel={() => {
            this.setState({ showAdd:false})
            this.form.resetFields()
          }}
        >
          <AddForm setForm={form => this.form = form}></AddForm>
        </Modal>
        <Modal
          visible={showAuth}
          title='设置角色权限'
          onOk={this.authSet}
          onCancel={() => {
            this.setState({ showAuth:false})
          }}
        >
          <AuthForm role={role} ref={this.auth}></AuthForm>
        </Modal>
      </Card>
    )
  }
}
