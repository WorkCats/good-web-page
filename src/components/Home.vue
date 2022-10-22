<template>
  <a-list :data="goodList" >
    <template #item="{ item, index }">
      <a-list-item :key="index">
          <a-tag color="gray">
            <template #icon>
              <icon-user />
            </template>
            Github
          </a-tag>
        <a-list-item-meta
            :title="item.name"
            :description="item.size.toString()">


          <template #avatar>
            <a-avatar shape="square">
              A
            </a-avatar>
          </template>

        </a-list-item-meta>
        <template #actions>
          <icon-edit />
          <icon-delete />
        </template>
      </a-list-item>
    </template>
  </a-list>
</template>

<script>
import {defineComponent, ref} from "vue";
import {IconUser, IconEdit, IconDelete} from '@arco-design/web-vue/es/icon';
import {Message} from "@arco-design/web-vue";

import * as UserApi from "../uitls/UserApi";
import * as GoodApi from "../uitls/GoodApi";

const message = Message;
let goodList = ref();
let token = ""


export default defineComponent({
  name: "Home",
  components: {
    IconEdit,
    IconDelete,
    IconUser
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
      goodList,
      visible,
      handleClick,
      handleOk,
      handleCancel
    }
  },
  async beforeCreate() {
    if (window.localStorage.getItem("cookie") === null
        && window.sessionStorage.getItem("cookie") === null){
      this.$router.push('/login')
    } else if (window.localStorage.getItem("cookie") !== null){
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

    await GoodApi.getGoodList(token).then((e) => {
      const {errcode, good_list, errmsg} = e.data
      switch (errcode) {
        case 0 : {
          console.log(good_list)
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

</style>
