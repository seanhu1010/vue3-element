<template>
  <div>
    <el-row>
      <el-col :span="24">
        <div class="grid-content">
          <div class="grid-title">菜品销量统计</div>
          <el-tabs v-model="activeTab" tab-position="bottom" @tab-click="handleTabClick">
            <el-tab-pane v-for="(item, index) in lineData" :key="index" :label="item.category" :name="item.category">
              <div :id="item.category"></div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import { Line } from '@antv/g2plot'
  import { onMounted, ref, reactive, toRefs, inject, nextTick } from 'vue'
  export default {
    setup() {
      const state = reactive({
        activeTab: '', // 选择的tab
        period: 'week', // 统计间隔，’day’，‘week’或’month’
        lineData: [], //折线图数据,
      })

      // 使用 inject 函数获取的全局注入的对象，包含了后端接口的地址和封装的请求方法
      const urls = inject('$urls')
      const Request = inject('$Request')

      // 异步获取菜品按分类销量统计表格数据，调用后端接口
      const getLineData = async () => {
        try {
          const res = await new Request(urls.m().dishCategorySalesRank + '?period=' + state.period).get()
          state.lineData = res //获取数据
          if (state.lineData.length > 0) {
            state.activeTab = state.lineData[0].category
            lineChart(state.activeTab, state.lineData[0].data)
          }
        } catch (err) {
          console.log(err)
        }
      }

      function lineChart(name, data) {
        nextTick(() => {
          console.log('call lineChart', name, data)
          let container = document.getElementById(name)
          if (container) {
            container.innerHTML = '' // 清除 DOM 元素中的内容
          }

          const line = new Line(container, {
            data,
            xField: 'date',
            yField: 'total_sales',
            label: {},
            point: {
              size: 5,
              shape: 'diamond',
              style: {
                fill: 'white',
                stroke: '#5B8FF9',
                lineWidth: 2,
              },
            },
            tooltip: { showMarkers: false },
            state: {
              active: {
                style: {
                  shadowBlur: 4,
                  stroke: '#000',
                  fill: 'red',
                },
              },
            },
            interactions: [{ type: 'marker-active' }],
          })

          line.render()
        })
      }

      function handleTabClick(tab) {
        const chartData = state.lineData.find((item) => item.category === tab.props.name)
        if (chartData) {
          lineChart(tab.props.name, chartData.data)
        }
      }

      onMounted(() => {
        getLineData()
      })

      return {
        ...toRefs(state),
        handleTabClick,
      }
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
  .el-tabs__nav {
    float: none;
    justify-content: center;
  }
</style>
