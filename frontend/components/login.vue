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
                            <input type="radio" id="owner" value="Owner" v-model="role">
                            <label for="owner">I am an owner</label>
                        </td>
                        <td>
                            <input type="radio" id="inspector" value="Inspector" v-model="role">
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
import {loginRoutine} from './loginRoutine.js'
export default {
    name: 'Login',
    data() {
        return {
            role: ""
        }
    },
    methods: {
        login() {
            console.log(this.role)
            const { role } = this
            loginRoutine({ role }).then(() => {
                this.$router.push('/')
            })
            /*
                Authentification part is missing here
            */
            //this.$emit("authenticated", true);
            //this.$router.replace({ name: "home" });
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