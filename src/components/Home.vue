<template>
  <div class="home">
    <p class="home__msg">{{ datosEmpresa.name }}</p>
  </div>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
.home__msg {
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  position: relative;
  top: 10rem;
  color: #005691;
}

</style>
