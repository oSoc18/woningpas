<template>
    <login v-model="loginPage" name="login" >
        <h1>
            Login Page
        </h1>
        <button v-on:click="mainPage">login Page</button>
    </login>
</template>
<script>
export default {
    name: 'loginPage',
}
</script>