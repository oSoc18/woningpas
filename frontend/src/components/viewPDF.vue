<template>
  <div id="viewPDF">
    <app-header></app-header>
    <main>
      <embed :src="url">
      <button v-on:click="validate" class="btn btn-success">Validate</button>
    </main>
    <app-footer></app-footer>
  </div>
</template>

<script>
export default{
  name: 'ViewPDF',
  data() {
    return {
      url: 'https://bitcoin.org/bitcoin.pdf'
    }
  }
}
</script>

<style scoped>
embed{
  width: 100%;
  height: 600px;
}
</style>
