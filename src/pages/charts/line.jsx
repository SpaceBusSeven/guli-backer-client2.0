import React,{Component} from 'react'
import ReactEcharts from 'echarts-for-react'
import {Card, Button} from 'antd'

export default class Line extends Component{

  state = {
    sales: [5, 20, 36, 10, 10, 20],
    inventories:  [15, 30, 46, 20, 20, 40]
  }
  getOptions = () => {
    const {sales, inventories} = this.state
    return {
      title: {
        text: 'ECharts 入门示例'
      },
      tooltip: {},
      legend: {
        data:['销量','库存']
      },
      xAxis: {
        data: ["衬衫","羊毛衫","雪纺衫","裤子","高跟鞋","袜子"]
      },
      yAxis: {},
      series: [{
        name: '销量',
        type: 'line',
        data: sales
      },
        {
          name: '库存',
          type: 'line',
          data: inventories
        }]
    }
  }
  updateOption = () => {
    const sales = this.state.sales.map(sale => sale+1)
    const inventories = this.state.inventories.map(inventory => inventory-1)
    this.setState({ sales, inventories })
  }

  getOptions2 = () => {
    return {
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: [820, 932, 901, 934, 1290, 1330, 1320],
        type: 'line',
        areaStyle: {}
      }]
    }
  }
  render() {
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.updateOption}>更新</Button>
        </Card>
        <Card title='线形图一'>
          <ReactEcharts option={this.getOptions()} style={{height:300}}></ReactEcharts>
        </Card>
        <Card title='线形图二'>
          <ReactEcharts option={this.getOptions2()} style={{height:300}}></ReactEcharts>
        </Card>
      </div>
    )
  }
}
