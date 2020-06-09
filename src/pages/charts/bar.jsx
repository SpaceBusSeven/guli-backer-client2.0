import React,{Component} from 'react'
import ReactEcharts from 'echarts-for-react'
import {Card, Button} from 'antd'

export default class Bar extends Component{

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
        type: 'bar',
        data: sales
      },
        {
          name: '库存',
          type: 'bar',
          data: inventories
        }]
    }
  }
  updateOption = () => {
    const sales = this.state.sales.map(sale => sale+1)
    const inventories = this.state.inventories.map(inventory => inventory-1)
    this.setState({ sales, inventories })
  }
  render() {
    return (
      <div>
        <Card>
          <Button type='primary' onClick={this.updateOption}>更新</Button>
        </Card>
        <Card title='柱状图一'>
          <ReactEcharts option={this.getOptions()} style={{height:300}}></ReactEcharts>
        </Card>
      </div>
    )
  }
}
