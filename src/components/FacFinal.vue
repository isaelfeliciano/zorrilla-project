<template>
    <div class="facfinal">
      <div v-if="showEditFacFinal" class="create-facfinal">
      <h2 class="center-text">Factura Final Datos</h2>
        <div class="facfinal__box center-align">
          <div class="facfinal__form-wrapper">
            <label>Fecha<input v-model="date" type="date" name="facfinal-date"></label>
            <label>NCF<input v-model="ncf" type="text" name="ncf"></label>
            <label>Cliente<input v-model="client" type="text" name="client"></label>
            <label>Cliente RNC<input v-model="clientRNC" type="text" name="client-rnc"></label>

            <p>Periodo de Facturacion del {{ startOfMonth }} al {{ endOfMonth }} de {{ monthSelected }} {{ yearSelected }}</p>
            <p>Cantidad de Conduce: {{ conduceQuantity }}, del {{ firstConduce }} al {{ lastConduce }}</p>
          </div>
        </div>

        <h2 class="center-text">Detalles del Mes</h2>
        <div class="detalles-raciones">
          <table class="pure-table pure-table-bordered center-align margin-sm">
            <thead>
              <tr>
                <th>Descripcion del Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>ITBIS</th>
                <th>Total</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="item in listaProductos">
                <td>{{ item.nombre }}</td>
                <td>{{ item.total }}</td>
                <td>{{ item.precio }}</td>
                <td v-if="item.itbis === 0.18" class="itbis">{{ percentage(item.total, item.precio) }}</td>
                <td v-else >0</td>
                <td class="total">{{ multiplicar(item.total, item.precio) }}</td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td class="bold">SUB-TOTAL</td>
                <td>{{ total }}</td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td class="bold">ITBIS</td>
                <td>{{ itbisTotal }}</td>
              </tr>

              <tr>
                <td></td>
                <td></td>
                <td></td>
                <td class="bold">TOTAL GENERAL</td>
                <td>{{ totalGeneral }}</td>
              </tr>
            </tbody>
          </table> 

          <button @click="facturar" v-show="showBtnFacturar" class="btn btn__facturar no-print">Facturar</button> 
          <button @click="updateFacFinal" v-show="showBtnUpdateFacFinal" class="btn btn__facturar no-print">Guardar</button> 
        </div>
      </div>

      <div v-else class="select-month-year center-text">
        <!-- List FacFinal -->
        <div v-if="showListFacFinal === true" class="list-facfinal">
        <p>Lista de Facturas Finales</p>
          <div v-for="item in listFacFinal" @click="loadFacFinal(item)" class="list-facfinal__item box-radius center-align">
            <ul>
              <li><span>Mes: </span>{{ lodash.capitalize(item.month) }}</li>
              <li><span>NCF: </span>{{ item.ncf }}</li>
              <li><span>Cliente: </span>{{ item.client }}</li>
              <li><span>Total: </span>RD$ {{ numeral(item.totalGeneral).format('0,0.00') }}</li>
            </ul>
          </div>
        </div>

        <div v-else>
          <p>Seleccione Mes y Año para crear Factura Final</p>
          <select v-model="monthSelected">
            <option v-for="month in moment.months()" :value="month">{{ month }}</option>
          </select>

          <select v-model="yearSelected">
            <option>2017</option>
            <option>2018</option>
            <option>2019</option>
            <option>2020</option>
          </select>

          <button class="btn" @click="createFacFinal">Continuar</button>

          <button @click="getFacFinalList" class="btn btn--list-fac-finales block center-align">Lista Fac. Finales</button>
        </div>
      </div>


    </div>
</template>

<script>
  export default {
    name: 'facfinal',
    data () {
      return {
        _id: '',
        lodash: window._,
        numeral: window.numeral,
        moment: window.moment,
        monthSelected: window.window.moment().format('MMMM'),
        yearSelected: window.moment().format('YYYY'),
        showEditFacFinal: false,
        showListFacFinal: false,
        showBtnFacturar: true,
        showBtnUpdateFacFinal: false,
        listFacFinal: [],
        totalProductsSellMonth: [],
        total: 0,
        itbisTotal: 0,
        totalGeneral: 0,
        date: window.moment().format('YYYY-MM-DD'),
        ncf: '',
        client: 'Instituto Nacional de Bienestar Estudiantil (INABIE)',
        clientRNC: '401-50561-4',
        firstConduce: '',
        lastConduce: '',
        conduceQuantity: ''
      }
    },
    methods: {
      createFacFinal () {
        let self = this
        this.mongoDbObj.facturasFinales.find({month: self.monthSelected, year: self.yearSelected}).toArray((err, doc) => {
          if (err) return console.log(err)
          if (doc[0]) return window.flash('La Factura Final para este mes ya existe', 'error')
          this.getTotalProductsSellMonth()
          .then((result) => {
            let tempList = self.listaProductos
            result.forEach((element, index) => {
              tempList[index]['total'] = element.total
              if (index === (result.length - 1)) {
                self.listaProductos = tempList
                self.showEditFacFinal = true
                self.getConduceRange()
              }
            })
          })
        })
      },
      getFacFinalList () {
        let self = this
        this.mongoDbObj.facturasFinales.find({}).sort({_id: 1}).toArray((err, doc) => {
          if (err) return console.log(err)
          self.listFacFinal = doc
          self.showEditFacFinal = false
          self.showListFacFinal = true
        })
      },
      loadFacFinal (facFinal) {
        let f = facFinal
        this._id = f._id
        this.showEditFacFinal = true
        this.showListFacFinal = false
        this.showBtnFacturar = false
        this.showBtnUpdateFacFinal = true
        this.monthSelected = f.month
        this.yearSelected = f.year
        this.total = f.subTotal
        this.itbisTotal = f.itbis
        this.totalGeneral = f.totalGeneral
        this.date = window.moment(f.fecha, 'DD/MM/YYYY').format('YYYY-MM-DD')
        this.ncf = f.ncf
        this.client = f.client
        this.clientRNC = f.clientRNC
        this.firstConduce = f.firstConduce
        this.lastConduce = f.lastConduce
        this.conduceQuantity = f.conduceQuantity
        this.startOfMonth = f.startOfMonth
        this.endOfMonth = f.endOfMonth
        this.listaProductos = f.listaProductos
      },
      updateFacFinal () {
        let self = this
        let ncf = this.ncf
        let client = this.client
        let clientRNC = this.clientRNC
        if (ncf === '' || client === '' || clientRNC === '') {
          return window.flash('Debe llenar todos los campos', 'error')
        }
        let obj = {
          fecha: window.moment(this.date, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          ncf: this.ncf,
          client: this.client,
          clientRNC: this.clientRNC,
          listaProductos: this.listaProductos,
          subTotal: this.total,
          itbis: this.itbisTotal,
          totalGeneral: this.totalGeneral,
          month: this.monthSelected,
          year: this.yearSelected,
          startOfMonth: this.startOfMonth,
          endOfMonth: this.endOfMonth,
          firstConduce: this.firstConduce,
          lastConduce: this.lastConduce,
          conduceQuantity: this.conduceQuantity
        }
        this.mongoDbObj.facturasFinales.update({_id: self._id}, obj, (err, result) => {
          if (err) return console.log(err)
          window.flash('Factura guardada', 'success')
          localStorage.setObj('facturaFinal', obj)
          self.$router.push('/facfinalprint')
        })
      },
      getTotalProductsSellMonth () {
        let self = this
        return new Promise((resolve, reject) => {
          this.mongoDbObj.conduces.aggregate([
            { $match: { month: self.monthSelected } },
            { $unwind: '$listaProductos' },
            { $match: { 'listaProductos.cantidad': { $gte: 1 } } },
            { $group: { _id: '$listaProductos.nombre', total: { $sum: '$listaProductos.cantidad' } } },
            { $sort: { '_id': 1 } }
          ]).toArray((err, doc) => {
            if (err) return console.log(err)
            if (doc[0] === undefined) return window.flash('No existen Conduce para este mes', 'info')
            self.totalProductsSellMonth = doc
            resolve(doc)
          })
        })
      },
      facturar () {
        let self = this
        let ncf = this.ncf
        let client = this.client
        let clientRNC = this.clientRNC
        if (ncf === '' || client === '' || clientRNC === '') {
          return window.flash('Debe llenar todos los campos', 'error')
        }
        let obj = {
          fecha: window.moment(this.date, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          ncf: this.ncf,
          client: this.client,
          clientRNC: this.clientRNC,
          listaProductos: this.listaProductos,
          subTotal: this.total,
          itbis: this.itbisTotal,
          totalGeneral: this.totalGeneral,
          month: this.monthSelected,
          year: this.yearSelected,
          startOfMonth: this.startOfMonth,
          endOfMonth: this.endOfMonth,
          firstConduce: this.firstConduce,
          lastConduce: this.lastConduce,
          conduceQuantity: this.conduceQuantity
        }
        this.mongoDbObj.facturasFinales.insert(obj, (err, result) => {
          if (err) return console.log(err)
          window.flash('Factura guardada', 'success')
          localStorage.setObj('facturaFinal', obj)
          self.$router.push('/facfinalprint')
        })
      },
      multiplicar (a, b) {
        let result = window.numeral(a * b).format('0.00')
        return result
      },
      percentage (a, b) {
        let add = a * b
        let result = window.numeral((add * 0.18)).format('0.00')
        return result
      },
      getSubTotal () {
        let self = this
        let tempArray = []
        window.$('.total').each((index, element) => {
          tempArray.push(parseFloat(window.$(element).text()))
          if (index === (window.$('.total').length - 1)) {
            self.total = window.numeral(window._.sum(tempArray)).format('0.00')
          }
        })
      },
      getItbisTotal () {
        let self = this
        let tempArray = []
        window.$('.itbis').each((index, element) => {
          tempArray.push(parseFloat(window.$(element).text()))
          if (index === (window.$('.itbis').length - 1)) {
            self.itbisTotal = window.numeral(window._.sum(tempArray)).format('0.00')
          }
        })
      },
      getTotalGeneral () {
        let self = this
        console.log(this.total)
        console.log(this.itbisTotal)
        this.totalGeneral = window.numeral(window._.sum([parseFloat(self.total), parseFloat(self.itbisTotal)])).format('0.00')
      },
      getConduceRange () {
        let self = this
        this.mongoDbObj.conduces.aggregate([
        { $match: { month: self.monthSelected } },
        { $sort: { conduce: 1 } }
        ]).toArray((err, doc) => {
          if (err) return console.log(err)
          self.firstConduce = doc[0].conduce
          self.lastConduce = doc[doc.length - 1].conduce
          self.conduceQuantity = doc.length
        })
      }
    },
    created () {
      this.getProductsList()
    },
    updated () {
      this.getSubTotal()
      this.getItbisTotal()
    },
    watch: {
      total () {
        this.getTotalGeneral()
      }
    },
    computed: {
      startOfMonth () {
        // let self = this
        return window.moment(this.monthSelected, 'MMMM').startOf('month').format('DD')
      },
      endOfMonth () {
        // let self = this
        return window.moment(this.monthSelected, 'MMMM').endOf('month').format('DD')
      }
    }
  }

  /* db.getCollection('conduces').aggregate([
{ $match: { month: 'septiembre' } },
{ $unwind: "$listaProductos" },
{ $match: { 'listaProductos.cantidad': { $gte: 1} } },
{ $group: { _id: '$listaProductos.nombre', total: {$sum: '$listaProductos.cantidad' } } }
]) */
</script>

<style lang="scss">
.facfinal {
  width: 100%;
  height: 90%;
  overflow-y: auto;
}

.create-facfinal {
  width: 100%;
  & .facfinal__box {
    background-color: #E8F1F5;
    height: auto;
    padding: 1rem 7%;
    width: 51%;
  }
  & .facfinal__form-wrapper {
    text-align: center;
    & label {
      text-align: left;
      margin: 1rem 0.5rem;
      & input {
        width: 17rem;
      }
    }
  }
}

.select-month-year {
  position: relative;
  top: 0;
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
  & .btn--list-fac-finales {
    margin-top: 5rem;
  }
}

.btn__facturar {
  position: fixed;
  bottom: 1rem;
  right: 5rem;
}

.list-facfinal {
    overflow: auto;
}

.list-facfinal__item {
  margin: 1rem auto;
  border: 2px solid #4696E7;
  background-color: #E8F1F5;
  width: 90%;
  &:hover{
    opacity: 0.8;
  }
  & ul {
    list-style: none;
    cursor: pointer; 
    & li {
      display: inline;
      margin: auto 0.3rem;
      font-weight: bold;
      & span {
        color: #004A7C;
        font-weight: normal;
      }
    }
  }
}
</style>
