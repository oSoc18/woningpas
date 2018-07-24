<template>
  <section class="o-section u-mt-2">
    <div class="container">
      <div class="row">

        <h1 class="text-center">Choose one of your properties</h1>
        <div class="row row--flex row--flexCenter">
          <div class="col-md-6">
            <p class="text-center">
              Are you the owner of one or more houses in Flanders? Select the property you want to view. This data comes from the Federal Public Service, Finance, Patrimonial Documentation ...
            </p>
          </div>
        </div>
        <div v-if="loading" class="is-loading is-loading--big is-loading--before text-center">
            <p class="u-tac">Loading houses ...</p>
        </div>

        <section v-else-if="houses.length == 0" class="o-section u-mt-2 o-section--aqua">
          <div class="row row--flex row--flexCenter">
  					<div class="col-md-8">

  						<h2 class="text-center">We do not find any Flemish properties that you own</h2>
  						<br>
  						<div>
  								<p class="p--big">
  									The ownership data comes from the Federal Public Service Finance, Patrimony Documentation.
  		 							<ul class="ul--big">
  										<li>
  											Houses on Wallonia or Brussels territory do not have a home pass;
  										</li>
  										<li>
  											When transferring ownership to a new owner, it can take a while (up to 3 months) before the change of ownership is correctly registered;
  								 		</li>
  										<li>
  											For some information no link can be made between the owner and the correct address (house number, bus number), especially in case of apartments.
  								 		</li>
  									</ul>
  								</p>
  							</div>
  						</div>
  				</div>
        </section>

        <div v-else class="row row--eq-height">
          <div class="col-md-4" v-for="house in houses">
            <router-link :to="{ name: 'House', params: { houseId: house.houseId }}">
              <div class="m_house">
                <div class="m_house__cover" style="background-image:url('http://woningpas.brandplatform.be/img/images/keuzescherm-home-01-x2.jpg')"></div>
                <div class="m_house__information">
                  <div class="m_house__information__arrow">
                    <span class="icon-arrow-right"></span>
                  </div>
                  <div class="m_house__information__text">
                    <p>
                      {{house.street}} 543 <br>
                      <b>{{house.city}}</b>
                    </p>
                  </div>
                </div>
              </div>
            </router-link>
          </div>

        </div>
      </div>
    </div>
  </section>
</template>

<script>
import auth from '@/js/auth.js'
import api from '@/js/api.js'

export default {
  name: 'HouseList',
  data() {
    return {
      loading: true,
      role: auth.getRole(),
      token: auth.getToken(),
      houses: []
    }
  },
  created() {
    api.request('getHouses', {key: this.token}, (data) => {
        this.houses = data
        this.loading = false
    })
  }
}
</script>

<style scoped>
  #main{
    padding-left: 6%;
    padding-right: 6%;
  }
</style>
