<!--
 * @FilePath: \vue3-element\src\page\dishes-upload\upload.vue
-->
<template>
  <div class="ordering">
    <el-breadcrumb :separator-icon="ArrowRight">
      <el-breadcrumb-item :to="{ path: '/dishes' }">菜品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加/修改菜品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content-view-ten">
      <!-- 菜品类目 -->
      <div class="image-view-title">
        <div class="image-list">菜品类目</div>
        <div>
          <el-select v-model="selectedCategory" placeholder="请选择菜品类目" clearable>
            <el-option v-for="item in categorys" :key="item.id" :label="item.category" :value="item.id" />
          </el-select>
        </div>
      </div>
      <!-- 菜品名称 -->
      <div class="image-view-title">
        <div class="image-list">菜品名称</div>
        <div>
          <el-input v-model="dishName" placeholder="请输入菜品名称" clearable />
        </div>
      </div>
      <!-- 菜品规格 -->
      <div class="image-view-title">
        <div class="image-list">菜品规格</div>
        <div>
          <el-input v-model="dishSpecification" placeholder="请输入菜品规格" clearable />
        </div>
      </div>
      <!-- 菜品价格 -->
      <div class="image-view-title">
        <div class="image-list">菜品价格(元)</div>
        <div class="dish-flex">
          <el-input v-model="dishPrice" type="number" placeholder="请输入菜品价格" clearable />
          <el-select v-model="selectedUnit" placeholder="请选择菜品单位" clearable>
            <el-option v-for="item in units" :key="item.id" :label="item.unit" :value="item.id" />
          </el-select>
          <el-input v-if="selectedUnit == '0'" v-model="newUnit" placeholder="请输入自定义单位" clearable />
          <div v-if="selectedUnit == '0'">
            <el-button type="success" style="width: 100%" @click="addUnit" :loading="unitLoading"
              >添加自定义单位</el-button
            >
          </div>
        </div>
      </div>
      <!-- 菜品图片，上传图片 -->
      <div class="image-view-title">
        <div class="image-list">菜品图片</div>
        <div>
          <el-upload
            v-model:file-list="fileList"
            :action="dishImageUploadApi"
            list-type="picture-card"
            accept=".jpg,.png,.jpeg,.webp,.jfif"
            :on-preview="onPreview"
            :on-remove="onRemove"
            :on-success="onSuccess"
            :on-error="onError"
            :on-progress="onProgress"
            :before-upload="beforeUpload"
            :limit="1"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
          <el-dialog v-model="dialogVisible">
            <img style="width: 100%" w-full :src="dialogImageUrl" alt="Preview Image" />
          </el-dialog>
        </div>
      </div>
      <!-- 提交按钮 -->
      <div class="sub-button">
        <el-button type="success" @click="submit" :loading="submitLoading" v-if="id === ''">添加</el-button>
        <el-button type="success" @click="submit" :loading="submitLoading" v-else>修改</el-button>
      </div>
    </div>
  </div>
</template>

<script>
  import { ArrowRight, Plus } from '@element-plus/icons-vue'
  import { reactive, toRefs, onMounted, inject, ref } from 'vue'
  import { useRouter, useRoute } from 'vue-router'
  import tips from '/config/tips'
  export default {
    components: {
      ArrowRight,
      Plus,
    },
    setup() {
      const state = reactive({
        selectedCategory: '', // 选中的菜品类目
        categorys: [], // 接口请求的菜品类目数据
        selectedUnit: '', // 选中的菜品单位
        units: [], // 接口请求的菜品单位数据
        dishName: '', // 菜品名称
        dishSpecification: '', // 菜品规格
        dishPrice: '', // 菜品价格
        newUnit: '', // 自定义菜品单位
        unitLoading: false, // 菜品单位是否正在添加中
        fileList: [], // 上传接收的菜品图片列表
        dialogVisible: false, // 图片预览(大图)对话框是否显示
        dialogImageUrl: '', // 图片预览(大图)对话框中图片的地址
        submitLoading: false, // 提交按钮是否正在提交中
        id: '', // 菜品id, 通过菜单id是否为空来判断是添加还是修改
      })

      // 使用 inject 函数获取的全局注入的对象，包含了后端接口的地址和封装的请求方法
      const urls = inject('$urls')
      const Request = inject('$Request')

      // 使用 useRouter 函数获取路由实例，用于跳转页面
      const router = useRouter()

      // 使用 useRoute 函数获取路由实例，用于获取路由参数
      const route = useRoute()

      // 接收编辑菜品传来的数据
      // console.log('to query:', history.state.params)
      const dish = history.state.params
      if (dish) {
        state.selectedCategory = dish.category
        state.dishName = dish.name
        state.dishSpecification = dish.specification
        state.dishPrice = dish.price
        state.selectedUnit = dish.unit
        state.fileList = ref([{ name: dish.name, url: dish.dish_url, response: { id: dish.file } }]) // 设置上传的图片列表
        state.id = dish.id
      }

      // 菜品图片上传接口
      const dishImageUploadApi = urls.m().dishImageUpload

      // 异步菜品类目数据，调用后端接口
      const getCategorys = async () => {
        try {
          const res = await new Request(urls.m().categoryList).get()
          console.log(res)
          state.categorys = res //获取数据
        } catch (err) {
          console.log(err)
        }
      }

      // 异步菜品单位数据，调用后端接口
      const getUnits = async () => {
        try {
          const res = await new Request(urls.m().unitList).get()
          console.log(res)
          state.units = res //获取数据
          state.units.push({ id: '0', unit: '自定义单位' }) // 自定义单位选项，id唯一为'0'
        } catch (err) {
          console.log(err)
        }
      }

      // 添加自定义单位
      const addUnit = async () => {
        state.unitLoading = true // 加载中
        const obj = {
          unit: state.newUnit, // 自定义单位
        }
        try {
          const res = await new Request(urls.m().unitList, obj).post() // 调用后端接口
          tips('添加自定义单位成功', 'success')
          state.newUnit = '' // 清空自定义单位输入框内容
          state.selectedUnit = '' // 清空菜品单位选择框内容
          getUnits()
          state.unitLoading = false
        } catch (err) {
          console.log(err)
          state.unitLoading = false
        }
      }

      // 点击文件列表中已上传的文件时的钩子:点击展开大图时触发
      const onPreview = (file) => {
        console.log('onPreview', file)
        if (file.url) {
          state.dialogVisible = true
          state.dialogImageUrl = file.url
        }
      }

      // 文件列表移除文件时的钩子
      const onRemove = (file, fileList) => {
        console.log('onRemove', file, fileList)
        if (file.status === 'removed') {
          state.fileList = []
        }
      }

      // 文件上传成功时的钩子
      const onSuccess = (res, file, fileList) => {
        console.log('onSuccess', res, file, fileList)
      }

      // 文件上传失败时的钩子
      const onError = (err, file, fileList) => {
        console.log('onError', err, file, fileList)
      }

      // 文件上传时的钩子
      const onProgress = (event, file, fileList) => {
        console.log('onProgress', event, file, fileList)
      }

      // 上传文件之前的钩子，参数为上传的文件， 若返回false或者返回 Promise 且被 reject，则停止上传
      const beforeUpload = (file) => {
        console.log('beforeUpload', file)
      }

      // 提交按钮点击时的钩子
      const submit = async () => {
        state.submitLoading = true // 提交按钮正在提交中
        const obj = {
          category: state.selectedCategory, // 菜品类别
          name: state.dishName, // 菜品名称
          specification: state.dishSpecification, // 菜品规格
          price: state.dishPrice, // 菜品价格
          unit: state.selectedUnit, // 菜品单位
          file: state.fileList.length > 0 ? state.fileList[0].response.id : '', // 菜品图片
        }
        try {
          if (state.id === '') {
            const res = await new Request(urls.m().dishList, obj).post()
            tips('添加菜品成功', 'success')
          }
          else {
            const res = await new Request(urls.m().dishList + state.id + '/', obj).put()
            tips('修改菜品成功', 'success')
          }
          // 使用router跳转到index页面
          router.push({ name: 'dishes' })
        } catch (err) {
          console.log(err)
          state.submitLoading = false
        }
      }

      // 页面加载时调用，获取表格数据
      onMounted(() => {
        getCategorys()
        getUnits()
      })

      return {
        ...toRefs(state),
        ArrowRight,
        Plus,
        dishImageUploadApi,
        getCategorys,
        getUnits,
        addUnit,
        onPreview,
        onRemove,
        onSuccess,
        onError,
        onProgress,
        beforeUpload,
        submit,
      }
    },
  }
</script>

<style scoped>
  .dish-flex {
    display: flex;
    align-items: center;
    justify-content: left;
  }
  .dish-flex div {
    width: 25% !important;
    margin-right: 5px;
  }
  .el-button--success {
    width: 150px;
  }
</style>
