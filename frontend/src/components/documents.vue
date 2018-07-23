<template>
  <section class="content">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1>Your house documents</h1>
        </div>
      </div>
      <hr>
      <app-upload :houseId="id"></app-upload>
      <hr>
  		<div class="row">
        <div class="col-md-12">
          <app-document v-for="document in documents" v-bind:document="document" :key="document.fileId"></app-document>
          <h1 v-if="documents.length == 0">No document</h1>
  				<!-- /col -->
        </div>
  		<!-- /row -->
      </div>
  		<!-- /container -->
    </div>
  	<!-- /content -->
  </section>
</template>

<script>
import auth from '@/js/auth.js'
import api from '@/js/api.js'

export default {
    name: 'Upload',
    props: ['id'],
    data() {
        return {
            documents: []
        }
    },
    created() {
      this.getDocuments();
    },
    methods: {
        getDocuments(){
          console.log('houseId='+this.id);
          let data = {
            key: auth.getToken(),
            houseId: this.id
          }
          api.request('getDocuments', data, data => {
            this.documents = data.result
          })
        }
    }
}
</script>
