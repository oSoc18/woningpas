<template>
  <div class="m-page">
    <!-- page -->
    <div class="m-page__section">
      <div class="m-permit row">
        <h3 class="col-md-1">{{this.document.year}}</h3>
        <div class="m-permit__details col-md-11">
          <div class="m-permit__section row">
            <div class="m-permit__icon col-md-1">
              <span class="icon icon-permit icon--primary icon--small"></span>
            </div>
            <div class="col-md-11">
              <router-link :to="{ name: 'DocumentView', params: {houseId: this.houseId, documentId: this.document.id} }">
                <h4 class="m-permit__details__title">{{this.document.id}}</h4>
              </router-link>
            </div>
          </div>
          <div class="m-permit__section row">
            <div class="m-permit__icon col-md-1">
              <span v-if="this.document.isVerified" class="icon icon-checkmark icon--primary icon--small"></span>
              <span v-else class="icon icon-cross icon--red icon--small"></span>
            </div>
            <div class="col-md-11">
              <h4 class="m-permit__details__title">{{this.document.verified}}</h4>
              <p class="m-permit__details__subtitle"></p>
              <p></p>
              <div class="row">
                <div class="col-md-2">
                  <p class="m-permit__label">Added on</p>
                  <p class="m-permit__value">{{this.document.date}}</p>
                </div>
                <div class="col-md-4"></div>
                <div class="col-md-2">
                  <a v-if="role == 'inspector'" class="a-button styleguide__button" @click="validate">Validate</a>
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

export default {
  props: ['document', 'houseId'],
  created: function() {
    let doc = this.document;
    doc.year = doc.addedAt.substr(6, 4);
    doc.date = doc.addedAt.substr(0, 10);
    doc.verified = doc.isVerified ? "Verified" : "Not verified";
  }
}
</script>
