<template>
  <div id="sideBar" class="col-xs-6 col-md-3">
    <div align="center">
      <img id="houseImage" src="@/assets/house.jpg">
      <div id="houseInfo">
        <h5>Hogeweg 543</h5>
        <h6><b>KORTRIJK</b></h6>
        <a href="#">Woningpas other house</a>
      </div>
      <div>
        <div id="houseTabs">
          <a href="#">
            <img src="@/assets/houseIcon.jpg" width="20" height="20" alt="house icon">&nbsp;&nbsp;
            My house
          </a>
          <a href="#">Building, layout, location</a>
          <a href="#">Energy</a>
          <a href="#">Insulation & glazing</a>
          <a href="#">Insulation & glazing</a>
          <a href="#">Installations</a>
          <a href="#">Ground</a>
          <a href="#">Permit</a>
        </div>
        <div id="environment">
          <a href="#">
            <img src="@/assets/map.jpg" width="20" height="20" alt="house icon">&nbsp;&nbsp;
            Environment
          </a>
        </div>
        <div id="docs">
          <a href="#">
            <img src="@/assets/document.png" width="16" height="16" alt="document icon">&nbsp;&nbsp;
            Certificates & documents
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SideBar'
}
</script>

<style scoped>
#sideBar {
  padding: 0;
  margin: 0;
  border: solid 1px;
  background: lightgrey;
}
#sideBar a {
    text-decoration: none;
    font-size: 16px;
    color: #2196F3;
    display: block;
}
#sideBar a:hover {
    color: #f1f1f1;
}
#main{
  padding-left: 6%;
  padding-right: 6%;
}
@media screen and (max-height: 450px) {
    .sideBar {padding-top: 15px;}
    .sideBar a {font-size: 18px;}
}
#houseImage{
  width: 100%;
}
#houseInfo {
  background: #ECE6E6;
  border-top: solid 1px black;
}
#houseInfo, #houseTabs, #environment, #docs {
  padding-top: 4%;
  padding-bottom: 4%;
  border-bottom: solid 1px black;
}
</style>
