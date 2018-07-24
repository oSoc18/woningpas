<template>
  <div id="sideBar" data-styleguide="woningpas">
    <section class="o-main-nav">
      <div class="o-main-nav__house">
    		<div class="o-main-nav__house__placeholder o-main-nav__house__placeholder--noImage "
          style="background-image:url('http://woningpas.brandplatform.be/img/coloured-icons/placeholder-appartement.svg')">
        </div>
        <div class="o-main-nav__adress">
          <p>{{house.street}}</p>
          <strong>{{house.city}}</strong>
          <router-link :to="{ name: 'Home'}">other houses</router-link>
        </div>
      </div>
      <nav class="o-main-nav__nav">
        <ul>
          <li class="">
            <a class=""><span class="icon-mijn-woningpas"></span> My house</a>
            <ul>
               <li class="">
                 <a>Building, layout, location <span class="a-badge a-badge--red"></span></a>
               </li>
               <li class=""><a>Energy <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a>Insulation &amp; Glazing <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a>Installations <span class="a-badge a-badge--red">2</span></a></li>
               <li class=""><a>Ground <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a>Permit <span class="a-badge a-badge--red"></span></a></li>
            </ul>
          </li>
          <li class="">
            <a class=""><span class="icon-omgeving"></span> Environment</a>
          </li>
          <li class="">
            <a class=""><span class="icon-attesten"></span> Certificates &amp; documents</a>
          </li>
          <li class="o-main-nav__collapsable">
            <a class="js-menu-collapsable"><span class="icon-legende"></span> I intend to...</a>
            <ul>
               <li class=""><a>To sell <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a>To rent <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a>Rebuild <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a>To build <span class="a-badge a-badge--red"></span></a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </section>
  </div>
</template>

<script>
import auth from '@/js/auth.js'
import api from '@/js/api.js'

export default {
  name: 'SideBar',
  data() {
    return {
      houseId: this.$route.params.houseId,
      house: {}
    }
  },
  created() {
    this.getHouse()
  },
  methods: {
      getHouse(){
        let data = {
          key: auth.getToken(),
          houseId: this.houseId
        }
        api.request('getHouse', data, data => {
          this.house = data
        })
      }
  }
}
</script>
