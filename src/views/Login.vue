<template>
  <div class="ac-block m-auto align-middle ms-depth-64">
    <div>
      <img
        src="res/ico/icon-b.png"
        alt
        width="100px"
        height="100px"
      >
      <login-ask answer="" />
    </div>
  </div>
</template>
<script lang="ts">
import Vue from 'vue'
import LoginAsk from "@/components/Login/LoginAsk.vue";
export default Vue.extend({
  name: "Login",
  components:{
    LoginAsk
  }
})
</script>

<style lang="scss">
  $acrylic: blur(30px) saturate(125%);

  .ac-block {
    background-color: rgba(255, 255, 255, 0.3);
    backdrop-filter: $acrylic;
    width: 80%;
    padding: 2%;
    text-align: center;

    h1 {
      color: rgba(255, 255, 255, 0.9);
      font-size: large;
    }
    input {
      border: 0;
      padding: 5px;
      border-radius: 5px;
      width: 90%;
      vertical-align: middle;
      margin: 10px;

      &:focus {
        outline: none;
        box-shadow: 0 6.4px 14.4px 0 rgba(0, 0, 0, 0.22),
          0 4.8px 14.4px 0 rgba(0, 0, 0, 0.18);
      }
    }
    a {
      color: black;

      &:hover {
        color: black;
        text-decoration: none;
      }
    }
    button {
      border: 0;
      margin: 10px;
      padding: 5px;
      width: 50%;
      vertical-align: middle;

      &:focus {
        outline: none;
        box-shadow: 0 3.2px 7.2px 0 rgba(0, 0, 0, 0.132),
          0 0.6px 1.8px 0 rgba(0, 0, 0, 0.108);
      }
    }
  }
</style>
