<template>
  <div id="house" class="site-container">
    <app-header></app-header>
	  <main>
      <app-sideBar></app-sideBar>
      <app-documents v-bind:houseId="id"></app-documents>
    </main>
  	<app-footer></app-footer>
  </div>
</template>

<script>
export default {
  name: 'House',
  data() {
    return {
      id: '9a083ac2-43e3-419d-944d-5cc45ccd6302'
    }
  }
}
</script>

<style scoped>
  #main{
    padding-left: 6%;
    padding-right: 6%;
  }
</style>
