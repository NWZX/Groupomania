<template>
  <div class="container-flex">
    <h1 class="text-dark">
      Groupomania
    </h1>
    <div class="row justify-content-center">
      <button
        class="col-8 bg-light ms-depth-8"
      >
        Connexion
      </button>
    </div>
    <div class="row justify-content-center">
      <button
        class="col-8 bg-light ms-depth-8"
      >
        Crée un compte
      </button>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component
export default class LoginAsk extends Vue {
    @Prop() public answer!:string;
}
</script>