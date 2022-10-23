<template>
  <a-layout class="layout-home">
    <a-layout-header>
      <a-page-header
          title="货物管理系统"
          @back="this.$router.back()">
        <template #subtitle>
          <a-space>
            <span>这里展示的所有用户</span>
          </a-space>
        </template>
      </a-page-header>
    </a-layout-header>
    <a-layout-content>
      <a-table style="width: 94vw" :columns="columns" :data="userList" >
        <template #optional="{ record }">
          <a-button>
            <template #icon>
              <icon-edit/>
            </template>
          </a-button>
          <a-button>
            <template #icon>
              <icon-delete/>
            </template>
          </a-button>
        </template>
      </a-table>
    </a-layout-content>
  </a-layout>
  <a-button size="large"
            class="add-bt"
            shape="circle">
    <icon-plus/>
  </a-button>
</template>

<script>
import {IconEdit, IconDelete, IconPlus} from '@arco-design/web-vue/es/icon';
import * as UserApi from "../utils/UserApi";
import {Message} from "@arco-design/web-vue";
import {ref} from "vue";

let token = ""
const message = Message;
let userList = ref();
const columns = [
  {
    title: '名字',
    dataIndex: 'username',
  },
  {
    title: 'Salary',
    dataIndex: 'password',
  },
  {
    title: '是否是管理员',
    align:'center',
    dataIndex: 'is_administrator',
    ellipsis: true,
  },
  {
    title: '编辑功能',
    align:'center',
    slotName: 'optional'
  }
];



export default {
  name: "Admin",
  async beforeCreate() {
    if (window.localStorage.getItem("cookie") === null
        && window.sessionStorage.getItem("cookie") === null) {
      this.$router.push('/login')
    } else if (window.localStorage.getItem("cookie") !== null) {
      await UserApi.getAutoLogin(window.localStorage.getItem("cookie")).then(
          (e) => {
            const {errcode, errmsg} = e.data
            switch (errcode) {
              case 0 : {
                window.localStorage.setItem("cookie", e.data.token)
                token = window.localStorage.getItem("cookie")
                break;
              }
              default: {
                window.localStorage.removeItem("cookie")
                message.error("登录失效，错误为：" + errmsg)
                this.$router.push('/login')
                break
              }
            }
          }
      )
    } else {
      token = window.sessionStorage.getItem("cookie")
    }
    await UserApi.isAdministrator(token).then(
        (e) => {
          const {errcode, is_administrator, errmsg} = e.data
          switch (errcode) {
            case 0 : {
              if (!is_administrator) {
                message.error("你不是管理员")
                this.$router.back()
              }
              break;
            }
            case 2 : {
              window.localStorage.removeItem("cookie")
              message.error("登录失效，错误为：" + errmsg)
              this.$router.push('/login')
              break;
            }
            default: {
              message.error("获取货物发生错误，错误为：" + errmsg)
              break
            }
          }
        }
    )
    await UserApi.getUserList(token).then((e) => {
      const {errcode, user_list, errmsg} = e.data
      switch (errcode) {
        case 0 : {
          userList.value = user_list
          break;
        }
        case 2 : {
          window.localStorage.removeItem("cookie")
          message.error("登录失效，错误为：" + errmsg)
          this.$router.push('/login')
          break;
        }
        default: {
          message.error("获取货物发生错误，错误为：" + errmsg)
          break
        }
      }
    })
  },
  components: {
    IconPlus,
    IconEdit,
    IconDelete
  },
  setup() {
    return {
      columns,
      userList
    }
  }
}
</script>

<style scoped>
.layout-home {
  height: 100vh;
  background: var(--color-fill-2);
}

.layout-home :deep(.arco-layout-header) {
  height: 64px;
  line-height: 64px;
  background: var(--color-bg-3);
}

.layout-home :deep(.arco-layout-content) {
  color: var(--color-text-2);
  font-weight: 400;
  font-size: 14px;
  background: var(--color-bg-3);
}

.layout-home :deep(.arco-layout-content) {
  display: flex;
  flex-direction: column;
  color: var(--color-white);
  font-size: 16px;
}
.layout-home :deep(.arco-layout-content) {
  display: flex;
  align-items: center;
  flex-flow: column;
}
.add-bt {
  position: fixed;
  background: var(--color-bg-5) !important;
  border: 1px solid var(--color-fill-3) !important;
  box-shadow: 0 2px 12px var(--color-neutral-3);
  right: 60px;
  bottom: 80px;
}
</style>
