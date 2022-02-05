<template>
  <div id="root">
    <div v-for="(conducesList, index) in arrayOfConduces" class="relacion-print">
      <h2 class="center-text">{{ datosEmpresa.name }}</h2>
      <div class="datos-company center-text">
        <p>{{ datosEmpresa.address }}</p>
        <p>Contacto: {{ datosEmpresa.phone }}</p>
        <p>{{ datosEmpresa.rnc }}</p>
        <p class="margin-big bold">{{ relacionType }}</p>
        <!-- <p>Mes: {{ lodash.capitalize(conducesList[0].month) }} {{ conducesList[0].year }}</p> -->
      </div>

      <h3 class="center-text">{{'Relación de Factura del ' + firstDayFacturation + ' al ' + lastDayFacturation + ' de ' + lodash.capitalize(conducesList[0].month) + ' del ' + conducesList[0].year }}</h3>

       <table class="pure-table pure-table-bordered center-align margin-sm">
        <thead>
          <tr>
            <th>Fecha</th>
            <th>No. De Conduce</th>
            <th>Codigo y Nombre del Centro Educativo</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="conduce in conducesList">
            <td>{{ moment(conduce.date, 'DD/MMMM/YYYY').format('DD/MM/YYYY') }}</td>
            <td>{{ conduce.conduce }}</td>
            <td>({{ conduce.codigoCentro }}) {{ conduce.nombreCentro }}</td>
          </tr>
          <tr v-show="(index + 1) === arrayOfConduces.length">
            <td></td>
            <td class="bold right-text">Total Conduces</td>
            <td class="bold right-text">{{ totalOfConduces }}</td>
          </tr>
        </tbody>
      </table> 
      <p>Página {{ index + 1 }}/{{arrayOfConduces.length}}</p>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'relacion-print',
    data () {
      return {
        moment: window.moment,
        numeral: window.numeral,
        lodash: window._,
        datosEmpresa: localStorage.getObj('datosEmpresa'),
        relacion: localStorage.getObj('relacion'),
        arrayOfConduces: [],
        relacionType: localStorage.getItem('relacionType'),
        totalOfConduces: 0,
        conducesCompleteList: [],
        firstDayFacturation: '',
        lastDayFacturation: ''
      }
    },
    created () {
      let self = this
      self.totalOfConduces = self.relacion.conducesList.length
      self.conducesCompleteList = self.relacion.conducesList
      self.firstDayFacturation = self.moment(self.conducesCompleteList[0].date, 'DD/MMMM/YYYY').format('DD')
      self.lastDayFacturation = self.moment(self.conducesCompleteList[(self.conducesCompleteList.length - 1)].date, 'DD/MMMM/YYYY').format('DD')
      console.log(self.conducesCompleteList[0])
      let numberOfPages = parseInt(self.relacion.conducesList.length / 30) + 1
      for (var i = 0; i < numberOfPages; i++) {
        self.arrayOfConduces.push(self.relacion.conducesList.splice(0, 30))
        if (i === numberOfPages) {
          console.log(self.arrayOfConduces)
        }
      }
      setTimeout(function () {
        window.print()
        self.$router.push('/relacion')
      }, 1000)
    },
    methods: {
      return36 (conduces) {
        if (conduces.length > 36) {
          console.log('Conduces size: ' + conduces.length)
          let thisConduces = []
          thisConduces = conduces.slice(0, 36)
          this.relacion.conducesList = conduces.slice(36)
          return thisConduces
        } else return conduces
      }
    }
  }
</script>

<style lang="scss" scoped>

#root {
  height: auto;
}
.relacion-print {
  width: 22.8cm;
  min-height: 27.9cm;
  padding-left: 2cm;
  padding-top: 2cm;
  padding-right: 2cm;
  padding-bottom: 2cm;
  // overflow-y: auto;
}

p {
  line-height: 0.3rem;
}
table {
  line-height: 0.3rem;
}
@page {
  size: letter portrait;
  margin-left: 2cm;
  margin-top: 2cm;
  margin-right: 2cm;
  margin-bottom: 2cm;
}
</style>
