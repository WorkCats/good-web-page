<template>
  <a-layout class="layout-home">
    <a-layout-header>
      <a-page-header
          title="货物管理系统"
          :show-back="false">
        <template #subtitle>
          <a-space>
            <span>这里展示的所有货物</span>
            <a-tag :color="isAdministrator? 'red':''" size="small">
              {{ isAdministrator ? '管理员' : '普通用户' }}
            </a-tag>
          </a-space>
        </template>
        <template #extra>
          <a-space>
            <a-link v-show="isAdministrator" href="#/admin" icon>管理页面</a-link>
          </a-space>
        </template>
      </a-page-header>
    </a-layout-header>
    <a-layout-content>
      <a-list :data="goodList"
              :gridProps="{ gutter: { gutter: 0, span: 6 }, sm: 24, md: 12, lg: 8, xl: 6 }">
        <template #item="{ item, index }">
          <a-list-item :key="index" action-layout="vertical">
            <template #actions>
              <a-tag color="gray">
                <template #icon>
                  <icon-user/>
                </template>
                {{ item.user_name }}
              </a-tag>
              <a-button-group size="mini">
                <a-button @click="updateItemClick(item)">
                  <template #icon>
                    <icon-edit/>
                  </template>
                </a-button>
                <a-button @click="deleteItemClick(item.id)">
                  <template #icon>
                    <icon-delete/>
                  </template>
                </a-button>
              </a-button-group>
            </template>
            <a-list-item-meta
                :title="item.name"
                :description="'数量：' + item.size">
              <template #avatar>
                <a-avatar :style="{
                  marginRight: '24px',
                  verticalAlign: 'middle',
                  backgroundColor: ColorApi.stringToColor(item.id)
                  }" shape="square">
                  {{ item.name }}
                </a-avatar>
              </template>
            </a-list-item-meta>
          </a-list-item>
        </template>

      </a-list>
      <a-modal
          width="auto"
          v-model:visible="addVisible"
          title="添加货物"
          @cancel="handleAddCancel"
          @before-ok="handleAddOk(() =>{
            return $refs.formRef.validate()
          })">
        <a-form ref="formRef" :model="addForm">

          <a-form-item field="id" label="ID"
                       :rules="[{required:true,message:'id 也有要求哦，主人'},
                       {minLength:5, message:'最少为5位数'}]"
                       :validate-trigger="['change','input']">
            <a-input v-model="addForm.id" size="large" placeholder="输入对应的 ID" allow-clear>
            </a-input>
          </a-form-item>
          <a-form-item field="name" label="名字"
                       :rules="[{required:true,message:'名字可以为空哦，喵'}]"
                       :validate-trigger="['change','input']">
            <a-input v-model="addForm.name" size="large" placeholder="输入货物的名字" allow-clear>
            </a-input>
          </a-form-item>
          <a-form-item field="size" label="数量"
                       :rules="[{required:true,message:'需要输入数字'}]"
                       :validate-trigger="['change','input']">
            <a-input-number
                v-model="addForm.size"
                placeholder="输入数量" :min="1" :default-value="10" :step="1"
                class="input-demo"/>
          </a-form-item>
          <a-form-item
              field="user_name"
              label="用户所有者"
              :rules="[{required:true,message:'需要选择持有者'}]"
              :validate-trigger="['change','input']">
            <a-select v-model="addForm.user_name"
                      size="large"
                      placeholder="选择持有者"
                      :options="usernameList"
                      :loading="userLoading">
              <template #prefix>
                <icon-user/>
              </template>
            </a-select>
          </a-form-item>
        </a-form>
      </a-modal>
      <a-modal
          width="auto"
          v-model:visible="deleteVisible"
          title="删除货物"
          @cancel="handleDeleteCancel"
          @before-ok="handleDeleteOk()">
        <a-typography-text>
          是否删除当前货物
        </a-typography-text>
      </a-modal>
    </a-layout-content>
  </a-layout>
  <a-button size="large"
            class="add-bt"
            shape="circle"
            @click="handleAddClick">
    <icon-plus/>
  </a-button>

  <a-modal
      width="auto"
      v-model:visible="updateVisible"
      title="修改货物"
      @cancel="handleUpdateCancel"
      @before-ok="handleUpdateOk(() =>{
            return $refs.updateFormRef.validate()
          })">
    <a-form ref="updateFormRef" :model="updateForm">

      <a-form-item field="name" label="名字"
                   :rules="[{required:true,message:'名字可以为空哦，喵'}]"
                   :validate-trigger="['change','input']">
        <a-input
            v-model="updateForm.name"
            size="large"
            placeholder="输入货物的名字"
            allow-clear>
        </a-input>
      </a-form-item>
      <a-form-item field="size" label="数量"
                   :rules="[{required:true,message:'需要输入数字'}]"
                   :validate-trigger="['change','input']">
        <a-input-number
            v-model="updateForm.size"
            placeholder="输入数量" :min="1" :default-value="10" :step="1"
            class="input-demo"/>
      </a-form-item>
      <a-form-item
          field="user_name"
          label="用户所有者"
          :rules="[{required:true,message:'需要选择持有者'}]"
          :validate-trigger="['change','input']">
        <a-select
            v-model="updateForm.user_name"
            size="large"
            placeholder="选择持有者"
            :options="usernameList"
            :loading="userLoading">
          <template #prefix>
            <icon-user/>
          </template>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>

</template>

<script>
import {defineComponent, reactive, ref} from "vue";
import {IconUser, IconEdit, IconDelete, IconPlus} from '@arco-design/web-vue/es/icon';
import {Message} from "@arco-design/web-vue";

import * as UserApi from "../utils/UserApi";
import * as GoodApi from "../utils/GoodApi";
import * as ColorApi from "../utils/ColorUtils";

const message = Message;
let goodList = ref();
let isAdministrator = ref(false);
let token = ""

export default defineComponent({
  name: "Home",
  components: {
    IconEdit,
    IconDelete,
    IconUser,
    IconPlus
  },
  methods: {},
  setup() {
    const addVisible = ref(false);
    let usernameList = ref()
    let userLoading = ref(true)
    let deleteVisible = ref(false)
    let deleteGoodId = ref('')
    let updateVisible = ref(false)
    let updateGood = ref()

    async function getGoodList() {
      await GoodApi.getGoodList(token).then((e) => {
        const {errcode, good_list, errmsg} = e.data
        switch (errcode) {
          case 0 : {
            goodList.value = good_list
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
    }

    async function getNameList() {
      await UserApi.getUsernameList(token).then((e) => {
            const {errcode, username_list, errmsg} = e.data
            switch (errcode) {
              case 0 : {
                usernameList.value = username_list
                userLoading.value = false
                break
              }
              default: {
                message.error("登录失效，错误为：" + errmsg)
                this.$router.push('/login')
                break
              }
            }
          }
      )
    }

    const deleteItemClick = (id) => {
      deleteGoodId.value = id
      deleteVisible.value = true;
    }
    const handleDeleteOk = async () => {
      await GoodApi.delGood(token, deleteGoodId.value).finally(
          await getGoodList().finally(
              deleteVisible.value = false
          )
      )
    }
    const handleDeleteCancel = () => {
      deleteVisible.value = false;
    }

    const handleAddClick = async () => {
      addVisible.value = true;
      await getNameList()
    };

    const handleAddOk = async (done) => {
      await done().then(
          async (union) => {
            if (union === undefined) {
              await GoodApi.addGood(token, {
                id: addForm.id,
                name: addForm.name,
                size: addForm.size,
                user_name: addForm.user_name
              }).finally(
                  await getGoodList().finally(
                      addVisible.value = false
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
      id: '',
      name: '',
      size: 10,
      user_name: ''
    });

    const handleUpdateOk = async (done) => {
      await done().then(
          async (union) => {
            if (union === undefined) {
              await GoodApi.updateGood(token, {
                id: updateForm.id,
                name: updateForm.name,
                size: updateForm.size,
                user_name: updateForm.user_name
              }).finally(
                  await getGoodList().finally(
                      updateVisible.value = false
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
      id: "",
      name: "",
      size: 10,
      user_name: ""
    });

    const updateItemClick = async (good) => {
      updateGood.value = good
      updateVisible.value = true;

      updateForm.id = updateGood.value.id
      updateForm.name = updateGood.value.name
      updateForm.size = updateGood.value.size
      updateForm.user_name = updateGood.value.user_name
      await getNameList()
    }

    return {
      isAdministrator,
      goodList,
      addVisible,
      ColorApi,
      addForm,
      handleAddClick,
      handleAddOk,
      handleAddCancel,
      usernameList,
      userLoading,
      getGoodList,
      deleteItemClick,
      deleteVisible,
      deleteGoodId,
      handleDeleteCancel,
      handleDeleteOk,
      updateForm,
      updateGood,
      updateVisible,
      updateItemClick,
      handleUpdateOk,
      handleUpdateCancel
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
              isAdministrator.value = is_administrator
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
    await this.getGoodList()
  }
  ,
})

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

.add-bt {
  position: fixed;
  background: var(--color-bg-5) !important;
  border: 1px solid var(--color-fill-3) !important;
  box-shadow: 0 2px 12px var(--color-neutral-3);
  right: 60px;
  bottom: 80px;
}
</style>
