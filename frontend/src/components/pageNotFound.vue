<template>
  <div id="pageNotFound" class="u-bg-pattern u-bg-pattern--rectangles" data-styleguide="woningpas">
    <div class="site-container">
      <app-header></app-header>
      <main>
          <section>
            <div class="o-overlay">
              <div class="o-overlay__inner-wrapper">
                <div class="o-overlay__illustration u-margin-bottom">
                  <img src="http://woningpas.brandplatform.be/img/illustrations/fail.svg"
                    width="100%" height="auto" alt="Loading Page Illustration"/>
                </div>
                <h1 class="text-center">This page was not found</h1>
                <div class="row row--flex row--flexCenter row--margin">
                  <router-link :to="{ name: 'Home', params: {} }" class="a-button">Go back to home page</router-link>
                </div>
              </div>
            </div>
          </section>
      </main>
      <app-footer></app-footer>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'PageNotFound'
  }
</script>
