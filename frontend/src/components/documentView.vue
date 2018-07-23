<template>
  <div id="documentView" class="site-container">
    <app-header></app-header>
	  <main>
      <app-sideBar v-if="role == 'owner'"></app-sideBar>
      <section class="content">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <app-document v-bind:document="document"></app-document>
      				<!-- /col -->
            </div>
      		<!-- /row -->
          </div>
      		<!-- /container -->
        </div>
      	<!-- /content -->
      </section>
    </main>
  	<app-footer></app-footer>
  </div>
</template>

<script>
import auth from '@/js/auth.js'
import api from '@/js/api.js'

export default {
  name: 'DocumentView',
  data() {
    return {
      role: auth.getRole(),
      houseId: this.$route.params.houseId,
      documentId: this.$route.params.documentId,
      document: {}
    }
  },
  created() {
    this.getDocument();
  },
  methods: {
      getDocument(){
        console.log('houseId='+this.houseId)
        console.log('documentId='+this.documentId)
        let data = {
          key: auth.getToken(),
          houseId: this.houseId,
          documentId: this.documentId
        }
        api.request('getDocument', data, data => {
          this.document = data
        })
      }
  }
}
</script>
