<template>
    <div id="login" class="login-wrapper border border-light">
        <form class="form-signin" @submit.prevent="login">
            <!--<p v-if="errors.length">
                <b>Please correct the following error(s):</b>
                <ul>
                    <li v-for="(error, index) in errors" :key="index"></li>
                </ul>
            </p>-->
            <h2 class="form-signin-heading">Please choose between the followings</h2>
            <p>
                <table>
                    <tr>
                        <td>
                            <input type="radio" id="owner" value="owner" v-model="type">
                            <label for="owner">I am an owner</label>
                        </td>
                        <td>
                            <input type="radio" id="inspector" value="inspector" v-model="type">
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
var loginRoutine = require('./apiCalls.js')
export default {
    name: 'Login',
    data() {
        return {
            type: ""
        }
    },
    methods: {
        login() {
            var loginRoutine = require('./apiCalls.js')
            loginRoutine(this.type)
            this.$router.push('Home')
        }
    }
}
</script>

<style scoped>
body {
  background: #605B56;
}
.login-wrapper {
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
}
</style>