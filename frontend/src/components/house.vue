<template>
  <div id="house" class="site-container">
    <app-header></app-header>
	  <main>
      <app-sideBar></app-sideBar>
      <app-documents v-bind:id="id"></app-documents>
    </main>
  	<app-footer></app-footer>
  </div>
</template>

<script>
export default {
  name: 'House',
  data() {
    return {
      id: ''
    }
  },
  created() {
      this.id = this.$route.params.id;
  }
}
</script>

<style scoped>
  #main{
    padding-left: 6%;
    padding-right: 6%;
  }
</style>
