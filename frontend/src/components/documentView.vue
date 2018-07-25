<template>
  <div id="documentView" class="site-container">
    <app-header></app-header>
    <main>
      <section class="content">
        <div class="container">
          <div class="row">
            <div v-if="loading" class="is-loading is-loading--big is-loading--before">
              <p class="u-tac">Loading document ...</p>
            </div>
            <div v-else-if="error != ''"><h1>{{error}}</h1></div>
            <div v-else class="col-md-12">
              <app-document v-bind:document="document" :houseId="houseId" :owner="owner"></app-document>
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
      loading: true,
      houseId: this.$route.params.houseId,
      documentId: this.$route.params.documentId,
      owner: this.$route.params.owner,
      error: '',
      document: {}
    }
  },
  created() {
    this.updateDocument()
  },
  methods: {
    updateDocument(){
      this.loading = true
      this.error = ''
      let data = {
        key: auth.getToken(),
        houseId: this.houseId,
        documentId: this.documentId,
        owner: this.owner
      }
      api.request('getDocument', data, data => {
        this.loading = false
        this.document = data
      }, err => {
        this.loading = false
        this.error = err
      })
    }
  }
}
</script>
