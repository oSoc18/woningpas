<template>
  <section class="content">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1>Your house documents {{houseId}}</h1>
        </div>
      </div>
      <hr>
      <app-upload></app-upload>
      <hr>
  		<div class="row">
        <div class="col-md-12">
          <app-document v-for="document in documents" v-bind:document="document" :key="document.id"></app-document>
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
    props: ['houseId'],
    data() {
        return {
            documents: [
              {'name': 'ok', id: 0},
              {'name': 'nok', id: 1}
            ]
        }
    },
    methods: {
        getDocuments(){
          //api.request()
        }
    }
}
</script>
