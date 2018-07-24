<template>
  <div class="m-page">
    <!-- page -->
    <div class="m-page__section">
      <div class="m-permit row">
        <h3 class="col-md-1">{{year}}</h3>
        <div class="m-permit__details col-md-11">
          <div class="m-permit__section row">
            <div class="m-permit__icon col-md-1">
              <span class="icon icon-permit icon--primary icon--small"></span>
            </div>
            <div class="col-md-11">
              <h4 class="m-permit__details__title">{{this.document.id}}</h4>
            </div>
          </div>
          <div class="m-permit__section row">
            <div class="m-permit__icon col-md-1">
              <span v-if="this.document.isVerified" class="icon icon-checkmark icon--primary icon--small"></span>
              <span v-else class="icon icon-cross icon--red icon--small"></span>
            </div>
            <div class="col-md-11">
              <h4 class="m-permit__details__title">{{verified}}</h4>
              <p></p>
              <p v-if="role == 'owner' && !this.document.isVerified" class="m-permit__details__subtitle">
                Link for the inspector:<br>
                <input v-model="inspectorLink" id="inspectorLink">
                <button @click="copyToClipboard" class="is-hyperlink" title="Copy to clipboard">Copy to clipboard</button>
              </p><br>
              <p></p>
              <div class="row">
                <div class="col-md-4">
                  <p class="m-permit__label">Added on</p>
                  <p class="m-permit__value">{{localeDate}}</p>
                </div>
                <div class="col-md-2"></div>
                <div class="col-md-2">
                  <a v-if="validating" class="a-button styleguide__button" disabled>Validating...</a>
                  <a v-else-if="role == 'inspector' && !this.document.isVerified" class="a-button styleguide__button" @click="validate">Validate</a>
                </div>
                <div class="col-md-1"></div>
                <div class="col-md-2">
                  <a class="a-button styleguide__button" @click="download">Download</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- /page -->
  </div>
</template>

<script>
import auth from '@/js/auth.js'
import api from '@/js/api.js'
import file from '@/js/file.js'

export default {
  props: ['document', 'houseId', 'owner'],
  data(){
    return {
      role: auth.getRole(),
      validating: false
    }
  },
  computed: {
    inspectorLink() {
      let page = document.location.href
      let end = page.indexOf('house')
      let host = page.substr(0, end)
      console.log(host)
      return host
        + 'owner/' + auth.getToken()
        + '/house/' + this.houseId
        + '/document/' + this.document.id
    },
    date() {
      return new Date(this.document.addedAt*1000)
    },
    year() {
      return this.date.getFullYear()
    },
    localeDate() {
      return this.date.toLocaleString()
    },
    verified() {
      return this.document.isVerified ? "Verified" : "Not verified"
    }
  },
  methods: {
    validate(){
      this.validating = true;
      let data = {
        owner: this.owner,
        houseId: this.houseId,
        url: this.document.id,
        key: auth.getToken()
      }
      let self = this;
      api.request('validate', data, function() {
        self.validating = false;
        self.$emit('validated');
      })
    },
    download(){
      let data = {
        url: this.document.id,
        key: auth.getToken()
      }
      api.request('download', data, (data) => {
        file.download('file.pdf', atob(data.content))
      })
    },
    copyToClipboard() {
      let copyText = $('#inspectorLink')
      copyText.select()
      document.execCommand("copy")
      alert("Copied the text: " + copyText.val())
    }
  }
}
</script>
<style scoped>
input{
  width: 100%;
}
</style>
