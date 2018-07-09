<template>
    <div>
        <div id="mainPage" v-if="currentPage === 'mainPage'">
            <h1>
                Hello world
            </h1>
            <button v-on:click="loginPageButton">login Page</button>
        </div>
        <div id="login" v-if="currentPage === 'loginPage'">
            <h1>
                Login Page
            </h1>
            <input type="text" name="username" v-model="input.username" placeholder="Username" />
            <input type="password" name="password" v-model="input.password" placeholder="Password" />
            <button v-on:click="login">login Page</button>
        </div>
    </div>
</template>

<script src= ./script.js>
</script>