<template>
  <div id="header" >
    <div class="o-topbar">
      <div class="o-topbar__logo">
        <router-link :to="{ name: 'Home' }">
          <img src="http://woningpas.brandplatform.be/img/flanders.svg" alt="">
        </router-link>
      </div>
      <div class="o-topbar__site">woningpas.be</div>
      <nav class="o-topbar__nav">
        <ul>
          <li v-if="role">
            <a class="o-topbar__login">
              <span>{{email}}</span>
              <img src="http://woningpas.brandplatform.be/img/coloured-icons/user.svg"
                width="22" height="auto" alt=""/>
            </a>
            <ul class="o-topbar__subnav">
              <li>
                <a>
                  <img src="http://woningpas.brandplatform.be/img/coloured-icons/user.svg"
                    width="50" height="auto" alt=""/> {{role}}
                </a>
              </li>
              <li><a href="/logout" @click.prevent="logout" class="a-button">Log out</a></li>
            </ul>
          </li>
          <li>
            <a class="o-topbar__contact">Contact us</a>
            <ul class="o-topbar__subnav o-topbar__subnav--contact">
              <li>
                <a>Report your error <span class="icon icon-mail"></span></a>
                <p>Reply within max. 2 working days</p>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import auth from '@/js/auth.js'

export default {
  name: 'Header',
  data(){
    return{
      email: auth.getEmail(),
      role: auth.getRole()
    }
  },
  methods:{
    logout(){
      auth.logout(this)
    }
  }
}
</script>
