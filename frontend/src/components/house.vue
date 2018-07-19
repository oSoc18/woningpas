<template>
  <div id="house" class="site-container">
    <app-header></app-header>
	  <main>
      <app-sideBar v-if="role == 'owner'"></app-sideBar>
      
  		<section class="content">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <h1>Your house documents</h1>
            </div>
          </div><hr>
          <div>
            <h2>Add a document</h2>
            <app-upload></app-upload>
          </div><hr>
      		<div class="row">
            <div class="col-md-12">
              <div class="m-page">
      					<!-- page -->
      					<div class="m-page__section">
      						<div class="m-permit row">
      							<h3 class="col-md-1">2009</h3>
      							<div class="m-permit__details col-md-11">
      								<div class="m-permit__section row">
      									<div class="m-permit__icon col-md-1">
      										<span class="icon icon-permit icon--primary icon--small"></span>
      									</div>
      									<div class="col-md-11">
      										<h4 class="m-permit__details__title">Application for urban planning permit 2009</h4>
      										<p class="m-permit__details__subtitle">Cutting tall trees in a forest</p>
      										<p>Some text if necessary</p>
      										<a href="#" class="icon-arrow-right">Details</a>
      									</div>
      								</div>
      								<div class="m-permit__section row">
      									<div class="m-permit__icon col-md-1">
      										<span class="icon icon-bouwmisdrijf icon--red icon--small"></span>
      									</div>
      									<div class="col-md-11">
      										<h4 class="m-permit__details__title">Construction crime</h4>
      										<p class="m-permit__details__subtitle">Inbreuk op informatieplicht</p>
      										<p>Aanbrengen van een lichtreclame.</p>
      										<div class="row">
      											<div class="col-md-2">
      												<p class="m-permit__label">Aanvraag op</p>
      												<p class="m-permit__value">13/11/2014</p>
      											</div>
      											<div class="col-md-2">
      												<p class="m-permit__label">Beslissing op</p>
      												<p class="m-permit__value">30/01/2014</p>
      											</div>
      											<div class="col-md-8">
      												<p class="m-permit__label">Aard van de beslissing</p>
      												<p class="m-permit__value">Vergund</p>
      											</div>
      										</div>
      										<br>
      										<a href="#" class="icon-arrow-right">Details</a>
      									</div>
      								</div>
      							</div>
      						</div>
      					</div>
      					<!-- /page -->
              </div>
      				<div class="m-page">
      					<!-- page -->
      					<div class="m-page__section">
      						<div class="m-permit row">
      							<h3 class="col-md-1">2007</h3>
      							<div class="m-permit__details col-md-11">
      								<div class="m-permit__section row">
      									<div class="m-permit__icon col-md-1">
      										<span class="icon icon-melding icon--small"></span>
      									</div>
      									<div class="col-md-11">
      										<h4 class="m-permit__details__title">Aanvraag voor stedenbouwkundige vergunning 2009</h4>
      										<p class="m-permit__details__subtitle">Kappen van hoogstammige bomen in een bos</p>
      										<p>Nullam id dolor id nibh ultricies vehicula ut id elit. Donec id elit non mi porta gravida at eget metus. Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Etiam porta sem malesuada magna mollis euismod.</p>
      										<div class="row">
      											<div class="col-md-2">
      												<p class="m-permit__label">Aanvraag op</p>
      												<p class="m-permit__value">13/11/2014</p>
      											</div>
      											<div class="col-md-2">
      												<p class="m-permit__label">Beslissing op</p>
      												<p class="m-permit__value">30/01/2014</p>
      											</div>
      											<div class="col-md-8">
      												<p class="m-permit__label">Aard van de beslissing</p>
      												<p class="m-permit__value">Vergund</p>
      											</div>
      										</div>
      										<a href="#" class="icon-arrow-right">Details</a>
      									</div>
      								</div>
      							</div>
      						</div>
      					</div>
      					<!-- /page -->
              </div>
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
import file from '@/js/file.js'

export default {
  name: 'House',
  data() {
    return {
      role: auth.getRole(),
      fileId: ''
    }
  },
  methods: {
    logout(){
      auth.logout(this)
    },
    download(){
      let data = {
        url: this.fileId,
        key: auth.getToken()
      }
      api.request('download', data, (data) => {
        file.download('file.pdf', atob(data.content));
      })
    },
    validate(){
      let data = {
        url: this.fileId,
        key: auth.getToken()
      }
      api.request('validate', data);
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
