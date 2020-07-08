<template>
  <div>
    <Card>
      <Row>
        <Col span="6" offset="8">
          <Input search enter-button size="large" style="width: 400px;display: inline-table" v-model="searchValue"
                 placeholder="输入关键字搜索" @on-search="handleSearch"/>
        </Col>
        <Col span="6" offset="4" style="text-align: right;">
          <Upload
            style="display: inline-table;"
            type="drag"
            :show-upload-list="false"
            :action=UploadUrl
            :format="['docx']"
            :on-format-error="handleFormatError"
            :on-success="handleSuccess"
          >
            <div>
              <Icon type="ios-cloud-upload" size="50" style="color: #3399ff"></Icon>
              <p style="font-size: 12px">上传文档</p>
            </div>
          </Upload>
        </Col>
      </Row>
      <List item-layout="vertical">
        <ListItem v-for="item in data" :key="item.title">
          <ListItemMeta :title="item.title"/>
          <a @click="openUrl(item.url)">
            <span v-html="brightenKeyword(item.content, searchValue)"></span>
          </a>
          <!--{{ item.content }}-->
        </ListItem>
      </List>
      <div style="margin: 10px;overflow: hidden">
        <div style="float: left;">
          <Page :total="pageTotal" :current="pageNum" :page-size="pageSize"
                :page-size-opts=[10,15,25,35,50,100,150,200,300,500,800,1000,1500]
                show-sizer show-total @on-change="changePage" @on-page-size-change="handlePageSize"></Page>
        </div>
      </div>
    </Card>
  </div>
</template>

<script>
import {
  UploadUrl,
  getDocList
} from '@/api/doc'

export default {
  data () {
    return {
      keyword: '修改',
      UploadUrl: '',
      data: [
        {
          title: '',
          content: ''
        }
      ],
      tableData: [],
      pageTotal: 0, // 数据总数
      pageNum: 1, // 当前页码
      pageSize: 15, // 每页条数
      //
      searchKey: '',
      searchValue: ''
    }
  },
  methods: {
    openUrl (url) {
      window.open(url)
    },
    brightenKeyword (val, keyword) {
      if (keyword) {
        const Reg = new RegExp(keyword, 'gi')
        if (val) {
          const res = val.replace(Reg, `<span style="color: #f7d008;">${keyword}</span>`)
          // console.log(res);
          return res
        }
      } else {
        return val
      }
    },
    handleFormatError (file) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '文件:' + file.name + ' 格式不正确，请选择：docx 等格式类型 '
      })
    },
    handleSuccess (res, file) {
      if (res.code === 0) {
        this.$Message.success(`${res.msg}`)
      } else {
        this.$Message.error(`${res.msg}`)
      }
    },

    getDocList (page, limit, key, value, dateValue) {
      getDocList(page, limit, key, value, dateValue).then(res => {
        if (res.data.code === 0) {
          this.$Message.success(`${res.data.msg}`)
          this.data = res.data.data
          this.pageTotal = res.data.count
        } else {
          this.$Message.error(`${res.data.msg}`)
        }
      })
    },

    changePage (value) {
      this.pageNum = value
      this.getDocList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    // 每页条数
    handlePageSize (value) {
      this.pageSize = value
      this.getDocList(
        1,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    },
    handleReset (name) {
      this.$refs[name].resetFields()
    },
    handleClear (e) {
      if (e.target.value === '') this.tableData = this.value
    },
    handleSearch () {
      this.getDocList(
        this.pageNum,
        this.pageSize,
        this.searchKey,
        this.searchValue
      )
    }
  },
  watch: {
    // value(val) {
    //   this.handleSearch()
    // }
  },
  mounted () {
    this.UploadUrl = UploadUrl
    this.getDocList(this.pageNum, this.pageSize)
  }
}
</script>

<style lang="less" scoped>
  a {
    color: #17233d;
  }

  a:link {
    color: #000000
  }

  a:hover {
    color: #258cf9
  }

  .search-con {
    padding: 10px 0;
    text-align: center;

    .search {
      &-col {
        display: inline-block;
        width: 200px;
      }

      &-input {
        display: inline-block;
        width: 400px;
        margin-left: 2px;
      }

      &-btn {
        margin-left: 2px;
      }
    }
  }
</style>
