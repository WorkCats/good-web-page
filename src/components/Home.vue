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

    </a-layout-content>
  </a-layout>
  <a-button size="large"
            class="add-bt"
            shape="circle">
    <icon-plus/>
  </a-button>
</template>

<script>
import {defineComponent, ref} from "vue";
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
  setup() {
    const visible = ref(false);

    const handleClick = () => {
      visible.value = true;
    };
    const handleOk = () => {
      visible.value = false;
    };
    const handleCancel = () => {
      visible.value = false;
    }

    return {
      isAdministrator,
      goodList,
      visible,
      ColorApi,
      handleClick,
      handleOk,
      handleCancel
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

  },
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
