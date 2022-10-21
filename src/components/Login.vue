<template>
  <a-layout class="layout">
    <a-layout>
      <a-layout-sider
          default-collapsed
          hide-trigger
          width="30vw"
          :collapsed-width="0"
          collapsible
          breakpoint="md">
        <a-layout class="side-layout">
          <a-layout-header>
            <a-typography>
              <a-typography-title :bold="true" :heading="5">
                GOODS MANAGER
              </a-typography-title>

              <a-typography-title :heading="3">
                Start your<br>
                journey with us.
              </a-typography-title>
              I know you can't read it, so here's a piece of crap.
            </a-typography>
          </a-layout-header>
        </a-layout>
      </a-layout-sider>
      <a-layout style="padding: 24px 36px;">
        <a-layout-content>
          <a-card class="login-card" title="Login">
            <a-input
                class="login-card-input"
                placeholder="输入账号"
                v-model="userText"
                :error="userError">
              <template #prefix>
                <icon-user/>
              </template>
            </a-input>
            <a-input-password
                class="login-card-input"
                placeholder="输入密码"
                v-model="passWordText"
                :error="passWordError">
              <template #prefix>
                <icon-lock/>
              </template>
            </a-input-password>
            <a-row style="width: 100%">
              <a-col :span="20">
                <a-typography-text style="flex-grow: 1">是否自动登录</a-typography-text>
              </a-col>
              <a-col :span="4">
                <a-switch v-model="isAutologin"/>
              </a-col>
            </a-row>
            <a-button
                class="login-card-button"
                type="primary"
                size="large"
                @click="loginClick">
              登录
            </a-button>
          </a-card>
        </a-layout-content>
      </a-layout>
    </a-layout>
  </a-layout>
</template>
<script>
import {defineComponent, ref} from 'vue';
import {IconUser, IconLock} from '@arco-design/web-vue/es/icon';

import * as UserApi from "../uitls/UserApi";

let userText = ref("")
let passWordText = ref("")
let isAutologin = ref(false)
let userError = ref(false)
let passWordError = ref(false)

export default defineComponent({
  name: "Login",
  components: {
    IconUser,
    IconLock
  },
  beforeCreate() {
    if (window.localStorage.getItem("cookie") !== null || window.sessionStorage.getItem("cookie") !== null) {
      this.$router.push('/')
    }
  },

  setup() {
    return {
      userText,
      userError,
      passWordText,
      passWordError,
      isAutologin,
    }
  },
  methods: {
    async loginClick() {
      userError.value = userText.value === ""
      passWordError.value = passWordText.value === ""
      if (!passWordError.value && !passWordError.value) {
        await UserApi.login(
            {
              username: userText.value,
              password: passWordText.value,
              autoLogin: isAutologin.value
            }
        ).then((e) => {
          switch (e.data.errcode) {
            case 0: {
              if (isAutologin.value) {
                window.localStorage.setItem("username", passWordText.value)
                window.localStorage.setItem("cookie", e.data.token)
              } else {
                window.sessionStorage.setItem("username", passWordText.value)
                window.sessionStorage.setItem("cookie", e.data.token)
              }
              this.$router.push('/')
              break;
            }
            case 6: {
              this.$message.error(e.data.errmsg)
              userError.value = true
              passWordError.value = true
              break;
            }
            case 7: {
              this.$message.error(e.data.errmsg)
              userError.value = true
              break;
            }
            default: {
              this.$message.error(e.data.error)
            }
          }

        })
      } else {
        if (passWordError.value) this.$message.error("密码不可以为空")
        if (userError.value) this.$message.error("账号不可以为空")
      }

    }
  }
})
;
</script>
<style scoped>
.layout {
  height: 100vh;
  background: var(--color-fill-2);
}

.layout :deep(.arco-layout-sider) {
  background: var(--color-bg-1);
}

.layout :deep(.arco-layout-content), .login-card, .login-card :deep(.arco-card-body) {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column;
}

.login-card {
  margin: 24px;
  padding: 24px;
  border-radius: 10px;
}

.login-card-input, .login-card-button {
  margin: 12px 24px;
  width: 100%;
  height: 48px;
}


.side-layout {
  padding: 16px 24px;
}

</style>
