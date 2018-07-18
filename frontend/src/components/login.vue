<template>
  <div id="login" data-styleguide="woningpas">
    <app-header></app-header>
    <section>
      <div class="m-img-overlay">
        <h1>Know your home</h1>
        <p>Please choose between the followings</p>
        <button v-on:click="login" class="a-button" title="Log in" >owner1@woningpas.be</button>
        <button v-on:click="login" class="a-button" title="Log in">owner2@woningpas.be</button>
        <button v-on:click="login" class="a-button" title="Log in">inspector@woningpas.be</button>
      </div>
      <img src="http://woningpas.brandplatform.be/img/images/kenuwwoning-x2.jpg" alt="">
    </section>
    <section class="section-padding">
      <div class="container">
        <div class="row row--flex">
          <div class="col-md-6 u-tac">

            <div class="row">
              <div class="col-md-10 col-md-push-1">
                <h2 class="section-title">A digital passport for your home</h2>
                <p class="section-intro">Thanks to a collaboration of the Flemish Energy Agency, Ruimte Vlaanderen, Wonen-Vlaanderen and OVAM, we are able to bundle all relevant information about your home at one central point</p>
              </div>
            </div>

            <div class="m-feature-grid">
              <div class="row u-mb-2">
                <div class="col-md-4 m-feature-grid__item">
                  <img src="http://woningpas.brandplatform.be/img/coloured-icons/home-isolatie.svg" alt="">
                  <strong>Insulation</strong>
                </div>
                <div class="col-md-4 m-feature-grid__item">
                  <img src="http://woningpas.brandplatform.be/img/coloured-icons/home-isolatie.svg" alt="">
                  <strong>Insulation</strong>
                </div>
                <div class="col-md-4 m-feature-grid__item">
                  <img src="http://woningpas.brandplatform.be/img/coloured-icons/home-isolatie.svg" alt="">
                  <strong>Insulation</strong>
                </div>
              </div>

              <div class="row">
                <div class="col-md-4 m-feature-grid__item">
                  <img src="http://woningpas.brandplatform.be/img/coloured-icons/home-isolatie.svg" alt="">
                  <strong>Insulation</strong>
                </div>
                <div class="col-md-4 m-feature-grid__item">
                  <img src="http://woningpas.brandplatform.be/img/coloured-icons/home-isolatie.svg" alt="">
                  <strong>Insulation</strong>
                </div>
                <div class="col-md-4 m-feature-grid__item">
                  <img src="http://woningpas.brandplatform.be/img/coloured-icons/home-isolatie.svg" alt="">
                  <strong>Insulation</strong>
                </div>
              </div>
            </div>

          </div>
          <div class="col-md-6 u-off-screen-img">
            <img src="http://woningpas.brandplatform.be/img/images/home-laptop.png" alt="">
          </div>
        </div>
      </div>
    </section>
    <app-footer></app-footer>
  </div>
</template>

<script>
import axios from 'axios'
import auth from '@/js/auth.js'
import api from '@/js/api.js'

export default {
  name: 'Login',
  data() {
      return {
          role: "",
          auth: auth
      }
  },
  methods: {
    login: function(event) {
      let email = event.target.textContent
      console.log(event);
      api.request('login', {account: email}, (data) => {
          var token = data.key
          auth.login(this.role, token)
          this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
button{
  margin-bottom: 3%;
}
button:last-child{
  margin-bottom: 0;
}
</style>
