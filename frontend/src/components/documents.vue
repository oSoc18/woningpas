<template>
  <section class="content">
    <div class="container">
      <div class="row">
        <div class="col-md-12">
          <h1>Your house documents</h1>
        </div>
      </div>
      <hr>
      <app-upload :houseId="id" @uploaded="updateDocuments"></app-upload>
      <hr>
        <div class="row">
        <div class="col-md-12">
          <div v-if="loading" class="is-loading is-loading--big is-loading--before">
            <p class="u-tac">Loading documents ...</p>
          </div>
          <h1 v-else-if="documents.length == 0">No document</h1>
          <app-document v-for="document in documents" v-bind:document="document" :key="document.id" :houseId="id">
          </app-document>
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
      loading: true,
      documents: []
    }
  },
  created() {
    this.updateDocuments();
  },
  methods: {
    updateDocuments(){
      console.log('upadting documents')
      this.documents = [];
      this.loading = true;
      let data = {
        key: auth.getToken(),
        houseId: this.id
      }
      api.request('getDocuments', data, data => {
        console.log('updated');
        data.sort(this.sortLastFirst);
        this.documents = data;
        this.loading = false;
      })
    },
    sortLastFirst(d1, d2) {
      if (d1.addedAt > d2.addedAt) {
        return -1;
      } else if(d1.addedAt === d2.addedAt) {
        return 0;
      } else {
        return 1;
      }
    }
  }
}
</script>
