<template>
  <div id="sideBar" data-styleguide="woningpas">
    <section class="o-main-nav">
      <div class="o-main-nav__house">
    		<div class="o-main-nav__house__placeholder o-main-nav__house__placeholder--noImage "
          style="background-image:url('http://woningpas.brandplatform.be/img/coloured-icons/placeholder-appartement.svg')">
        </div>
        <div class="o-main-nav__adress">
          <p>Hogeweg</p>
          <strong>Kortrijk</strong>
          <a href="#">woningpas another house</a>
        </div>
      </div>
      <nav class="o-main-nav__nav">
        <ul>
          <li class="">
            <a class="" href=""><span class="icon-mijn-woningpas"></span> My woningpas</a>
            <ul>
               <li class=""><a href="#">Building, layout, location <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a href="#">Energy <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a href="#">Insulation &amp; Glazing <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a href="#">Installations <span class="a-badge a-badge--red">2</span></a></li>
               <li class=""><a href="#">Ground <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a href="#">Permit <span class="a-badge a-badge--red"></span></a></li>
            </ul>
          </li>
          <li class="">
            <a class="" href="#"><span class="icon-omgeving"></span> Environment</a>
          </li>
          <li class="">
            <a class="" href="#"><span class="icon-attesten"></span> Certificates &amp; documents</a>
          </li>
          <li class="o-main-nav__collapsable">
            <a class="js-menu-collapsable" href="#"><span class="icon-legende"></span> Ik ben van plan om te...</a>
            <ul>
               <li class=""><a href="#">To sell <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a href="#">To rent <span class="a-badge a-badge--red"></span></a></li>
               <li class="is-favorited"><a href="isolatie.html">Rebuild <span class="a-badge a-badge--red"></span></a></li>
               <li class=""><a href="installaties.html">To build <span class="a-badge a-badge--red"></span></a></li>
            </ul>
          </li>
        </ul>
      </nav>
    </section>
  </div>
</template>

<script>
export default {
  name: 'SideBar'
}
</script>

<style scoped>
</style>
