<template>
  <a-table
      :columns="columns"
      :data="goodList"
      on-row-click="{{x}}">
    <template #name-filter="{ filterValue, setFilterValue, handleFilterConfirm, handleFilterReset}">
      <div class="custom-filter">
        <a-space direction="vertical">
          <a-input :model-value="filterValue[0]" @input="(value)=>setFilterValue([value])"/>
          <div class="custom-filter-footer">
            <a-button @click="handleFilterConfirm">搜索</a-button>
            <a-button @click="handleFilterReset">重置</a-button>
          </div>
        </a-space>
      </div>
    </template>
  </a-table>
</template>

<script>
import {defineComponent, ref, h} from "vue";
import * as UserApi from "../uitls/UserApi";
import * as GoodApi from "../uitls/GoodApi";

import {IconSearch} from '@arco-design/web-vue/es/icon';


let goodList = ref();
let token = ""
const columns = [
  {
    title: "ID",
    dataIndex: "id",
  },
  {
    title: "名字",
    dataIndex: "name",
    filterable: {
      filter: (value, record) => record.name.includes(value),
      slotName: 'name-filter',
      icon: () => h(IconSearch)
    }
  },
  {
    title: "数量",
    dataIndex: "size",
    sortable: {
      sortDirections: ["ascend"]
    },
  },
  {
    title: "所有者",
    dataIndex: "user_name",
  },
];

function showMessageErr(obj) {
  console.log(obj)
}

async function autoLogin() {
  if (window.localStorage.getItem("cookie") === null
      && window.sessionStorage.getItem("cookie") === null)
    this.$router.push('/login')
  else if (window.localStorage.getItem("cookie") !== null)
    await UserApi.getAutoLogin(window.localStorage.getItem("cookie")).then(
        (e) => {
          switch (e.data.errcode) {
            case 0 : {
              window.localStorage.setItem("cookie", e.data.token)
              token = window.localStorage.getItem("cookie")
              break;
            }
            default: {
              window.localStorage.removeItem("cookie")
              showMessageErr("登录失效，错误为：" + e.data.errmsg)
              this.$router.push('/login')
              break
            }
          }
        }
    )
  else token = window.sessionStorage.getItem("cookie")
}

async function getGoodList() {
  await GoodApi.getGoodList(token).then((e) => {
    switch (e.data.errcode) {
      case 0 : {
        console.log(e.data.good_list)
        goodList.value = e.data.good_list
        break;
      }
      case 2 : {
        window.localStorage.removeItem("cookie")
        showMessageErr("登录失效，错误为：" + e.data.errmsg)
        this.$router.push('/login')
        break;
      }
      default: {
        showMessageErr("获取货物发生错误，错误为：" + e.data.errmsg)
        break
      }
    }
  })
}

export default defineComponent({
  name: "Home",
  setup() {
    const x = () => {
      this.$message.error('测试')
    }
    return {
      x,
      columns,
      goodList
    }
  },
  async beforeCreate() {
    await autoLogin()
    await getGoodList()
  },
})

</script>

<style scoped>
.custom-filter {
  padding: 20px;
  background: var(--color-bg-5);
  border: 1px solid var(--color-neutral-3);
  border-radius: var(--border-radius-medium);
  box-shadow: 0 2px 5px rgb(0 0 0 / 10%);
}

.custom-filter-footer {
  display: flex;
  justify-content: space-between;
}
</style>
