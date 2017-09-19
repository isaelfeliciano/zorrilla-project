<template>
  <div class="datos-empresa center-text">
    <div class="form-box center-align">
      <label>Nombre Empresa<input type="text" name="nombre-empresa" v-model="datosEmpresa.name"></label>
      <label>Direccion<input type="text" name="address" v-model="datosEmpresa.address"></label>
      <label>Telefono<input type="tel" name="phone" v-model="datosEmpresa.phone"></label>
      <label>RNC<input type="text" name="rnc" v-model="datosEmpresa.rnc"></label>
    </div>
    <button @click.prevent="save" class="center-align">Guardar</button>
  </div>
</template>

<script>
  export default {
    name: 'datos-empresa',
    data () {
      return {

      }
    },
    methods: {
      save () {
        let self = this
        console.log('foo')
        let obj = {
          name: this.datosEmpresa.name,
          address: this.datosEmpresa.address,
          phone: this.datosEmpresa.phone,
          rnc: this.datosEmpresa.rnc
        }
        this.mongoDbObj.datosEmpresa.update({}, obj, (err, result) => {
          if (err) return console.log(err)
          window.flash('Datos salvados', 'success')
          self.getDatosEmpresa()
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
.form-box {
  background-color: #E8F1F5;
  width: 80%;
  height: 25rem;
  text-align: center;
  padding-top: 1rem;
  & label {
    position: relative;
    text-align: left;
    display: inline-block;
    width: 60%;
    & input {
      width: 100%;
    }
  }
}
button {
  position: relative;
  top: 1rem;
}
</style>
