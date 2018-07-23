<template>
  <div id="home">
    <app-header></app-header>
    <main>
      <app-houseList v-if="role == 'owner'"></app-houseList>
      <section v-if="role == 'inspector'" class="grey-bg leafes-bg">
      	<div class="container">
      		<div class="row">
      			<div class="col-md-6 col-md-push-3 u-tac">
      				<h2 class="section-title">Instructions</h2>
      				<p class="section-intro">An inspector can view, download and validate documents. In order to do one of these actions please please copy and paste the link you received (the link should be pointing to a document).</p>
      			</div>
      		</div>

          <div class="row home-illustrations">
            <div class="col-md-5 u-tar">
              <img src="http://woningpas.brandplatform.be/img/coloured-icons/home-illustratie-PART1.svg" alt="">
            </div>
            <div class="col-md-2 u-tac">
              <img src="http://woningpas.brandplatform.be/img/coloured-icons/home-illustratie-PART2.svg" alt="">
            </div>
            <div class="col-md-5 u-tal">
              <img src="http://woningpas.brandplatform.be/img/coloured-icons/home-illustratie-PART3.svg" alt="">
            </div>
          </div>
      	</div>
      </section>
  	</main>
  	<app-footer></app-footer>
  </div>
</template>

<script>
import auth from '@/js/auth.js'

export default {
  name: 'Home',
  data() {
    return {
      role: auth.getRole()
    }
  }
}
</script>
