<template>
  <div id="app">
    <flash></flash>
    <app-header></app-header>
    <!-- <div style="height: 3rem;"></div> -->
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  created () {
    // this.getDatosEmpresa()
  }
}
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /*text-align: center;*/
  color: #2c3e50;
  /*margin-top: 60px;*/
}
</style>
<style src="./assets/css-helpers.css"></style>
<style src="./assets/tables-min.css"></style>
<style src="./assets/bootstrap-alerts.css"></style>
<style src="./assets/font-awesome.css"></style>
<style lang="scss">
.height-auto {
  height: auto
}
label {
  margin: 0;
  margin-left: 0.3em;
  color: black;
  padding: 0.2em 0 0 0;
  font-size: 1.2rem;
  display: inline-block;
  & input, select {
    display: block;
    margin: 0;
    color: #000;
    padding-bottom: 0.2em;
    border: 1px #D2D6D6 solid;
    font-size: 1.15em;
    width: auto;
    background-color: #FFF;
    border-radius: 5px;
    padding-left: 0.5rem;
    
    &[type="tel"] {
      width: 10.5em;
    }
    
    &:focus {
      // margin: 0;
      background-color: #D2D6D6;
      color: #000;
    }
    &:hover {
      // margin: 0;
      // color: $crown-color;
            border: 1px black solid;
    }
  }
}

button {
  border: none;
  background-color: #4696E7;
  color: #FFF;
  font-size: 1.5rem;
  border-radius: 5px;
  padding: 0.5rem 1rem;
  &:hover {
    opacity: 0.8;
  }
  &:active {
    background-color: #3782CF;
  }
}

.router-link-exact-active {
  color: #4696E7;
}

input[type="number"]::-webkit-outer-spin-button,
input[type="number"]::-webkit-inner-spin-button {
    -webkit-appearance: none;
}
input[type="number"] {
    -moz-appearance: textfield;
}
/* eslint-disable eol-last */  
</style>
