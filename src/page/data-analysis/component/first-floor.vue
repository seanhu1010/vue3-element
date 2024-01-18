<!--
 * @FilePath: \vue3-element\src\page\data-analysis\component\first-floor.vue
-->
<template>
  <!-- 饼图，柱状图 -->
  <div>
    <el-row>
      <el-col :span="12">
        <div class="grid-content">
          <div class="grid-title">菜品销量排行榜</div>
          <div id="PieChart"></div>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="grid-content">
          <div class="grid-title">订单销售总价区间分布</div>
          <div id="ColumnChart"></div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Pie, Column } from '@antv/g2plot'
  import { reactive, onMounted, toRefs, inject } from 'vue'
  export default {
    setup() {
      const state = reactive({
        period: 'week', // 统计间隔，’day’，‘week’或’month’
        pieData: [], //饼图数据
        columnData: [], //柱状图数据,
      })

      // 使用 inject 函数获取的全局注入的对象，包含了后端接口的地址和封装的请求方法
      const urls = inject('$urls')
      const Request = inject('$Request')

      // 异步获取菜品销量排行榜表格数据，调用后端接口
      const getPieData = async () => {
        try {
          const res = await new Request(urls.m().dishSalesRank + '?period=' + state.period).get()
          state.pieData = res //获取数据
          pieChart()
        } catch (err) {
          console.log(err)
        }
      }

      // 异步获取订单销售总价区间统计表格数据，调用后端接口
      const getcolumnData = async () => {
        try {
          const res = await new Request(urls.m().orderStatistics + '?period=' + state.period).get()
          state.columnData = res //获取数据
          columnChart()
        } catch (err) {
          console.log(err)
        }
      }

      // 饼图
      function pieChart() {
        const piePlot = new Pie('PieChart', {
          appendPadding: 10,
          data: state.pieData,
          angleField: 'total_sales',
          colorField: 'name',
          radius: 0.8,
          label: {
            type: 'outer',
            content: '{name},{percentage}',
          },
          interactions: [{ type: 'element-active' }],
        })

        // 执行渲染在div视图层上
        piePlot.render()
      }

      // 柱状图
      function columnChart() {
        const columnPlot = new Column('ColumnChart', {
          data: state.columnData,
          xField: 'ranges',
          yField: 'statistics',
          label: {
            // 可手动配置 label 数据标签位置
            position: 'middle', // 'top', 'bottom', 'middle',
            // 配置样式
            style: {
              fill: '#FFFFFF',
              opacity: 0.6,
            },
          },
          xAxis: {
            label: {
              autoHide: true,
              autoRotate: false,
            },
          },
          meta: {
            ranges: {
              alias: '价格区间',
            },
            sales: {
              statistics: '订单数',
            },
          },
        })

        columnPlot.render()
      }

      // 页面加载时调用
      onMounted(() => {
        getPieData()
        getcolumnData()
      })

      return { ...toRefs(state) }
    },
  }
</script>

<style scope="scoped">
  .el-row {
    padding: 20px 0;
  }
  .grid-content {
    padding: 20px;
    background-color: #fff;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }
  .grid-title {
    font-size: 16px;
    color: #333;
    font-weight: bold;
    padding-bottom: 10px;
    border-bottom: 1px solid #e8e8e8;
  }
</style>
