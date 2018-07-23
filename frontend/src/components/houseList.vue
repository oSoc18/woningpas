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
  			<br>
				<div class="row row--eq-height">
          <div class="col-md-4" v-for="house in houses" v-on:click="selectHouse(house.houseId)">
            <div class="m_house">
              <div class="m_house__cover" style="background-image:url('http://woningpas.brandplatform.be/img/images/keuzescherm-home-01-x2.jpg')">
						  </div>
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
      role: auth.getRole(),
      token: auth.getToken(),
      houses: []
    }
  },
  created() {
    api.request('getHouses', {key: this.token}, (data) => {
        this.houses = data.result
    })
  },
  methods:{
    selectHouse: function(houseId){
      this.$router.push({ name: 'House', params: { id: houseId }})
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
