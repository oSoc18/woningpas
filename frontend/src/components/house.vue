<template>
  <div id="house" class="site-container">
    <app-header></app-header>
	  <main>
      <app-sideBar v-if="role == 'owner'"></app-sideBar>
      <app-documents v-bind:id="houseId"></app-documents>
    </main>
  	<app-footer></app-footer>
  </div>
</template>

<script>
import auth from '@/js/auth.js'
import api from '@/js/api.js'

export default {
  name: 'House',
  data() {
    return {
      role: auth.getRole(),
      houseId: this.$route.params.houseId
    }
  },
}
</script>

<style scoped>
  #main{
    padding-left: 6%;
    padding-right: 6%;
  }
</style>
