<template>
    <div class="relacion-print">
      <h2 class="center-text">{{ datosEmpresa.name }}</h2>
      <div class="datos-company center-text">
        <p>{{ datosEmpresa.address }}</p>
        <p>Contacto: {{ datosEmpresa.phone }}</p>
        <p>{{ datosEmpresa.rnc }}</p>
      </div>

      <h3 class="center-text">{{ relacion.periodoRelacion }}</h3>

       <table class="pure-table pure-table-bordered center-align margin-sm">
        <thead>
          <tr>
            <th>Conduce</th>
            <th>Escuela</th>
            <th>Fecha</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="conduce in relacion.conducesList">
            <td>{{ conduce.conduce }}</td>
            <td>{{ conduce.nombreCentro }}</td>
            <td>{{ moment(conduce.date, 'DD/MMMM/YYYY').format('DD/MM/YYYY') }}</td>
            <td class="cantidad right-text">{{ conduce.raciones }}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td class="bold right-text">Total</td>
            <td class="bold right-text">{{ relacion.totalRaciones }}</td>
          </tr>
        </tbody>
      </table> 
    </div>
</template>

<script>
  export default {
    name: 'relacion-print',
    data () {
      return {
        moment: window.moment,
        numeral: window.numeral,
        datosEmpresa: localStorage.getObj('datosEmpresa'),
        relacion: localStorage.getObj('relacion')
      }
    },
    created () {
      let self = this
      console.log(this.relacion)
      setTimeout(function () {
        window.print()
        self.$router.push('/')
      }, 1000)
    }
  }
</script>

<style lang="scss" scoped>

.relacion-print {
  width: 100%;
  // height: 8in;
  overflow-y: auto;
}

p {
  line-height: 0.3rem;
}
table {
  line-height: 0.3rem;
}
</style>
