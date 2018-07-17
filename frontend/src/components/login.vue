<template>
    <div id="login" class="login-wrapper border border-light">
        <form class="form-signin" @submit.prevent="login">
            <h2 class="form-signin-heading">Please choose between the followings</h2>
            <p>
                <table>
                    <tr>
                        <td>
                            <input type="radio" id="owner" value="owner" v-model="role">
                            <label for="owner">I am an owner</label>
                        </td>
                        <td>
                            <input type="radio" id="inspector" value="inspector" v-model="role">
                            <label for="inspector">I am an inspector</label>
                        </td>
                    </tr>
                </table>
            </p>
            <p>
                <button class="btn btn-lg btn-primary btn-block" type="submit">Sign in</button>
            </p>
        </form>
    </div>
</template>

<script>
import axios from 'axios'
import auth from './auth.js'
export default {
    name: 'Login',
    data() {
        return {
            role: "",
            auth: auth
        }
    },
    methods: {
        apiRequest(path, data, success){
            axios({
                url: 'http://localhost:8080/' + path,
                data: data,
                method: 'POST',
                responseType: 'json',
            }).then(success).catch(error => {
                console.log(error)
            })
        },
        login() {
            this.apiRequest('login', {type: this.role}, (res) => {
                var token = res.data.key
                this.auth.login(this.role, token)
                this.$route.router.go('/')
            })
        }
    }
}
</script>

<style scoped>
body {
  background: #605B56;
}
/*.login-wrapper {
  background: #fff;
  width: 70%;
  margin: 12% auto;
}
.form-signin {
  max-width: 330px;
  padding: 10% 15px;
  margin: 0 auto;
}
.form-signin .form-signin-heading,
.form-signin .checkbox {
  margin-bottom: 10px;
}*/
</style>
