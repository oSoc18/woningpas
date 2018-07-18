<template>
  <div id="header" >
    <div class="o-topbar">
      <div class="o-topbar__logo">
        <a href="/home"><img src="http://woningpas.brandplatform.be/img/flanders.svg" alt=""></a>
      </div>
      <div class="o-topbar__site">woningpas.be</div>
      <nav class="o-topbar__nav">
        <ul>
          <li v-if="role == 'owner' || role == 'inspector'">
            <a href="#" class="o-topbar__login" disable>
              <span>{{email}}</span>
              <img src="http://woningpas.brandplatform.be/img/coloured-icons/user.svg"
                width="22" height="auto" alt=""/>
            </a>
            <ul class="o-topbar__subnav">
              <li>
                <a href="#">
                  <img src="http://woningpas.brandplatform.be/img/coloured-icons/user.svg"
                    width="50" height="auto" alt=""/> {{role}}
                </a>
              </li>
              <li><a href="#" @click.prevent="logout" class="a-button">Sign out</a></li>
            </ul>
          </li>
          <li>
            <a class="o-topbar__contact" href="#" disable>Contact us</a>
            <ul class="o-topbar__subnav o-topbar__subnav--contact">
              <li>
                <a href="#" disable>Report your error <span class="icon icon-mail"></span></a>
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
      auth.logout(this);
    }
  }
}
</script>
