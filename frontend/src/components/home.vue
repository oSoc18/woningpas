<template>
  <div id="home" class="site-container">
    <app-header></app-header>
    <main>
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
  					    <div class="col-md-4">
  								<div class="m_house">
  									<div class="m_house__cover" style="background-image:url('http://woningpas.brandplatform.be/img/images/keuzescherm-home-01-x2.jpg')">
  								  </div>
  									<div class="m_house__information">
  										<div class="m_house__information__arrow">
  											<span class="icon-arrow-right"></span>
  										</div>
  										<div class="m_house__information__text">
  											<p>
  													Hoge weg 543 <br>
  													<b>Kortrijk</b>
  											</p>
  									  </div>
  								  </div>
  							  </div>
  					    </div>

  					    <div class="col-md-4">
  								<div class="m_house">
  									<div class="m_house__cover">
  										<div>
  											<img src="http://woningpas.brandplatform.be/img/coloured-icons/placeholder-appartement.svg" alt="">
  											<strong>Insulation</strong>
  										</div>
  								  </div>
  									<div class="m_house__information">
  										<div class="m_house__information__arrow">
  											<span class="icon-arrow-right"></span>
  										</div>
  										<div class="m_house__information__text">
  											<p>
  													Hoge weg 543 <br>
  													<b>Antwerpen</b>
  											</p>
  									  </div>
  								  </div>
  							  </div>
  					    </div>

  							<div class="col-md-4">
  								<div class="m_house">
  									<div class="m_house__cover" style="background-image:url('http://woningpas.brandplatform.be/img/images/keuzescherm-home-01-x2.jpg')">
  								  </div>
  									<div class="m_house__information">
  										<div class="m_house__information__arrow">
  											<span class="icon-arrow-right"></span>
  										</div>
  										<div class="m_house__information__text">
  											<p>
  													Hoge weg 543 <br>
  													<b>Brugge</b>
  											</p>
  									  </div>
  								  </div>
  							  </div>
  					    </div>

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
import api from '@/js/api.js'
import file from '@/js/file.js'

export default {
  name: 'Home',
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
