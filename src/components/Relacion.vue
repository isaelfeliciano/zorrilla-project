<template>
  <div class="relacion">
    <div v-if="showRelacionTable" class="relacion-table center-text">
      <input class="periodo-relacion center-align" type="text" name="periodo-relacion" :value="periodoRelacion()">

      <table class="pure-table pure-table-bordered center-align margin-sm">
        <thead>
          <tr>
            <th>Conduce</th>
            <th>Escuela</th>
            <th>Fecha</th>
            <th>Total Raciones</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="conduce in conducesList">
            <td>{{ conduce.conduce }}</td>
            <td>{{ conduce.nombreCentro }}</td>
            <td>{{ conduce.date }}</td>
            <td class="cantidad right-text">{{ conduce.raciones }}</td>
          </tr>
          <tr>
            <td></td>
            <td></td>
            <td class="bold right-text">Total</td>
            <td class="bold right-text">{{ totalRaciones }}</td>
          </tr>
        </tbody>
      </table>
      
      <button @click="printRelacion" class="btn btn__print-relacion no-print">Imprimir Relacion</button>
    </div>

    <div v-else class="select-month-year center-text">
      <p>Seleccione Fecha para crear Relación</p>
      <select v-model="dateSelected">
        <option v-for="date in listDaysWithConduce" v-if="date._id !== null" :value="date._id">{{ date._id }}</option>
      </select>
      <!-- <input v-model="fechaFacturacion" type="date" name="fecha-relacion" class="box-radius"> -->
     <!--  <select v-model="monthSelected">
        <option v-for="month in moment.months()" :value="month">{{ month }}</option>
      </select>

      <select v-model="yearSelected">
        <option>2017</option>
        <option>2018</option>
        <option>2019</option>
        <option>2020</option>
      </select> -->

      <button class="btn" @click="createRelacion">Continuar</button>

      <button v-show="false" @click="getRelacionList" class="btn btn--list-relaciones block center-align">Lista Relaciones</button>
    </div>  
  </div>
</template>

<script>
  export default {
    name: 'relacion',
    data () {
      return {
        moment: window.moment,
        numeral: window.numeral,
        monthSelected: window.window.moment().format('MMMM'),
        yearSelected: window.moment().format('YYYY'),
        fechaFacturacion: window.moment().format('YYYY-MM-DD'),
        fechaRelacion: window.moment().format('YYYY-MM-DD'),
        showRelacionTable: false,
        conducesList: [],
        total: 0,
        totalRaciones: 0,
        listDaysWithConduce: [],
        dateSelected: ''
      }
    },
    methods: {
      createRelacion () {
        let self = this
        if (this.dateSelected === undefined) return window.flash('No ha seleccionado una fecha', 'warning')
        let fechaFacturacion = this.dateSelected
        this.mongoDbObj.relaciones.find({fechaFacturacion: fechaFacturacion}).toArray((err, doc) => {
          if (err) return console.log(err)
          if (doc[0]) return window.flash('La Relacion para este mes ya existe', 'error')
          self.mongoDbObj.conduces.find({date: fechaFacturacion}).toArray((err, doc) => {
            if (err) console.log(err)
            if (doc[0] === undefined) return window.flash('No existen Conduce para esta fecha', 'info')
            self.conducesList = doc
            self.conducesList.sort((a, b) => {
              return a.conduce - b.conduce
            })
            self.showRelacionTable = true
            setTimeout(() => {
              self.getTotal()
            }, 1000)
          })
        })
      },
      getRelacionList () {
        window.flash('No ready yet', 'info')
      },
      printRelacion () {
        console.log(this.conducesList)
        let self = this
        let obj = {
          total: self.total,
          totalRaciones: self.totalRaciones,
          conducesList: self.conducesList,
          periodoRelacion: self.periodoRelacion()
        }
        localStorage.setObj('relacion', obj)
        this.$router.push('/relacionprint')
      },
      getTotal () {
        let self = this
        let totalArray = []
        window.$('.cantidad').each((index, element) => {
          console.log('foo')
          totalArray.push(parseFloat(window.$(element).text()))
          if (index === (window.$('.cantidad').length - 1)) {
            self.totalRaciones = window._.sum(totalArray)
            console.log(self.totalRaciones)
          }
        })
      },
      periodoRelacion () {
        let string = 'Relación de Factura del ' + this.startOfMonth + ' al ' + this.endOfMonth + ' de ' + this.getMonth(this.dateSelected) + ' del ' + this.getYear(this.dateSelected)
        return string
      },
      getDaysWithConduce () {
        let self = this
        this.mongoDbObj.conduces.aggregate([ { $group: { _id: '$date' } } ]).toArray((err, result) => {
          if (err) return console.log(err)
          self.listDaysWithConduce = result
        })
      },
      getMonth (date) {
        return window._.capitalize(window.moment(date, 'DD/MMMM/YYYY').format('MMMM'))
      },
      getYear (date) {
        return window.moment(date, 'DD/MMMM/YYYY').format('YYYY')
      }
    },
    computed: {
      startOfMonth () {
        // let self = this
        return window.moment(this.dateSelected, 'DD/MMMM/YYYY').startOf('month').format('DD')
      },
      endOfMonth () {
        // let self = this
        return window.moment(this.dateSelected, 'DD/MMMM/YYYY').endOf('month').format('DD')
      }
    },
    created: function () {
      this.getDaysWithConduce()
    }
  }
</script>

<style lang="scss" scoped>
.relacion {
  width: 100%;
  height: 90%;
  overflow-y: auto;
  position: relative;
}

.select-month-year {
  position: relative;
  top: 25%;
  & p {
    font-size: 2rem;
    font-weight: bold;
    color: #005691;
  }
  & select {
    font-size: 1.5rem;
    border-radius: 5px;
    margin: 0 0.5rem;
  }
  & .btn--list-relaciones {
    margin-top: 5rem;
  }
}

input {
  font-size: 1.4rem;
  border: 2px solid #4696E7;
  height: 2.6rem;
}

.btn__print-relacion {
  position: fixed;
  bottom: 1rem;
  right: 4rem;
}

.periodo-relacion {
  font-size: 1.4rem;
  width: 90%;
  margin: 2rem auto;
  position: relative;
}
</style>
