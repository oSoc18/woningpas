<template>
  <div class="footer">
    <b-navbar toggleable="md" type="dark" variant="info">
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-navbar-brand href="#">
        <img id="logo" src=""/>
      </b-navbar-brand>
      <b>Vlaanderen</b>
      <b> Dit is een officiële website van de Vlaamse overheid</b>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item href="#" disabled>Vlaanderen</b-nav-item>
          <b-nav-item href="#" disabled>WONINGPAS</b-nav-item>
        </b-navbar-nav>
        <!-- Right aligned nav items -->
        <b-navbar-nav class="ml-auto">
          <b-nav-item right>
            <a href="#" disabled>over woningpas</a>
            <a href="#" disabled>disclaimer</a>
            <a href="#" disabled>toegankelijkheid</a>
          </b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
  </div>
</template>

<script>
export default {
  name: 'Footer'
}
</script>
