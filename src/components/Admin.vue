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
      <a-table style="width: 94vw" :columns="columns" :data="userList">
        <template #optional="{ record }">
          <a-button @click="updateItemClick(record)">
            <template #icon>
              <icon-edit/>
            </template>
          </a-button>
          <a-button @click="deleteItemClick(record.username)">
            <template #icon>
              <icon-delete/>
            </template>
          </a-button>
        </template>
      </a-table>
      <a-modal
          width="auto"
          v-model:visible="updateVisible"
          title="修改用户"
          @cancel="handleUpdateCancel"
          @before-ok="handleUpdateOk(() =>{
            return $refs.updateFormRef.validate()
          })">
        <a-form ref="updateFormRef" :model="updateForm">
          <a-form-item field="password" label="密码"
                       :rules="[{required:true, message:'需要输入密码'}]"
                       :validate-trigger="['change','input']">
            <a-input
                v-model="updateForm.password"
                size="large"
                placeholder="密码"
                allow-clear/>
          </a-form-item>
          <a-form-item field="is_administrator" label="管理员">
            <a-switch v-model="updateForm.is_administrator"/>
          </a-form-item>
        </a-form>
      </a-modal>

      <a-modal
          width="auto"
          v-model:visible="deleteVisible"
          title="删除用户"
          @cancel="handleDeleteCancel"
          @before-ok="handleDeleteOk()">
        <a-typography-text>
          是否删除当前用户
        </a-typography-text>
      </a-modal>

      <a-modal
          width="auto"
          v-model:visible="addVisible"
          title="新增用户"
          @cancel="handleAddCancel"
          @before-ok="handleAddOk(() =>{
            return $refs.addFormRef.validate()
          })">
        <a-form ref="addFormRef" :model="addForm">
          <a-form-item field="username" label="账户"
                       :rules="[{required:true, message:'需要输入账户'}]"
                       :validate-trigger="['change','input']">
            <a-input
                v-model="addForm.username"
                size="large"
                placeholder="账户"
                allow-clear/>
          </a-form-item>
          <a-form-item field="password" label="密码"
                       :rules="[{required:true, message:'需要输入密码'}]"
                       :validate-trigger="['change','input']">
            <a-input
                v-model="addForm.password"
                size="large"
                placeholder="密码"
                allow-clear/>
          </a-form-item>
          <a-form-item field="is_administrator" label="管理员">
            <a-switch v-model="addForm.is_administrator"/>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-layout-content>
  </a-layout>
  <a-button
      size="large"
      @click="handleAddClick"
      class="add-bt"
      shape="circle">
    <icon-plus/>
  </a-button>
</template>

<script>
import {IconEdit, IconDelete, IconPlus} from '@arco-design/web-vue/es/icon';
import * as UserApi from "../utils/UserApi";
import {Message} from "@arco-design/web-vue";
import {reactive, ref} from "vue";

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
    align: 'center',
    dataIndex: 'is_administrator',
    ellipsis: true,
  },
  {
    title: '编辑功能',
    align: 'center',
    slotName: 'optional'
  }
];


export default {
  name: "Admin",

  setup() {
    let updateVisible = ref(false)
    let updateGood = ref()

    let deleteVisible = ref(false)
    let deleteUsername = ref('')

    let addVisible = ref(false)

    async function getUserList() {
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
            message.error("获取用户发生错误，错误为：" + errmsg)
            break
          }
        }
      })
    }

    const handleUpdateOk = async (done) => {
      await done().then(
          async (union) => {
            if (union === undefined) {
              await UserApi.updateUser(token, {
                username: updateForm.username,
                password: updateForm.password,
                is_administrator: updateForm.is_administrator
              }).finally(
                  await getUserList().finally(
                      () => {
                        updateVisible.value = false
                      }
                  )
              )
            }
          }
      )
    }

    const handleUpdateCancel = () => {
      updateVisible.value = false;
    }

    const updateForm = reactive({
      username: "",
      password: "",
      is_administrator: false
    });

    const updateItemClick = (user) => {
      updateGood.value = user

      updateForm.username = user.username
      updateForm.password = user.password
      updateForm.is_administrator = user.is_administrator
      updateVisible.value = true;
    }

    const deleteItemClick = (username) => {
      deleteUsername.value = username
      deleteVisible.value = true
    }

    const handleDeleteOk = async () => {
      await UserApi.delUser(token, deleteUsername.value).finally(
          await getUserList().finally(() => {
                deleteVisible.value = false
              }
          )
      )
    }
    const handleDeleteCancel = () => {
      deleteVisible.value = false;
    }


    const handleAddOk = async (done) => {
      await done().then(
          async (union) => {
            if (union === undefined) {
              await UserApi.signup(token, {
                username: updateForm.username,
                password: updateForm.password,
                is_administrator: updateForm.is_administrator
              }).finally(
                  await getUserList().finally(
                      () => {
                        updateVisible.value = false
                      }
                  )
              )
            }
          }
      )
    }

    const handleAddCancel = () => {
      addVisible.value = false;
    }

    const addForm = reactive({
      username: "",
      password: "",
      is_administrator: false
    });

    const handleAddClick = () => {
      addVisible.value = true;
    }

    return {
      columns,
      userList,
      getUserList,

      updateForm,
      updateGood,
      updateVisible,
      updateItemClick,
      handleUpdateOk,
      handleUpdateCancel,

      deleteVisible,
      deleteItemClick,
      handleDeleteOk,
      handleDeleteCancel,

      addVisible,
      addForm,
      handleAddClick,
      handleAddOk,
      handleAddCancel
    }
  },
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
              message.error("其他错误：" + errmsg)
              break
            }
          }
        }
    )
    await this.getUserList()

  },
  components: {
    IconPlus,
    IconEdit,
    IconDelete
  },

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
