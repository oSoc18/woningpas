<template>
  <div id="documentView" class="site-container">
    <app-header></app-header>
    <main>
      <app-sideBar v-if="role == 'owner'"></app-sideBar>
      <section class="content">
        <div class="container">
          <div class="row">
            <div class="col-md-12" v-if="!error">
              <app-document v-bind:document="document" :houseId="houseId"></app-document>
              <!-- /col -->
            </div>
            <div v-else>Error, the house id or the document id is not correct.</div>
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
import file from '@/js/file.js'

export default {
  name: 'DocumentView',
  data() {
    return {
      role: auth.getRole(),
      error: true,
      document: {},
      houseId: this.$route.params.houseId,
      documentId: this.$route.params.documentId
    }
  },
  created() {
    this.getDocument()
  },
  methods: {
    getDocument(){
      let data = {
        key: auth.getToken(),
        houseId: this.houseId,
        documentId: this.documentId
      }
      api.request('getDocument', data, data => {
        this.document = data
        this.error = false
      }, callback => {

      })
    }
  }
}
</script>
