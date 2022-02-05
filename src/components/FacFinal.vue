<template>
    <div class="facfinal">
      <div v-if="showEditFacFinal" class="create-facfinal">
      <button @click="back" class="btn btn__back no-print"><i class="fa fa-arrow-left"></i></button>
      <h2 class="center-text">Factura Final Datos</h2>
        <div class="facfinal__box center-align">
          <div class="facfinal__form-wrapper">
            <label>Fecha<input v-model="date" type="date" name="facfinal-date"></label>
            <label>NCF<input v-model="ncf" type="text" name="ncf"></label>
            <label>Fecha de Vencimiento(NCF)<input v-model="dateNcf" type="date" name="ncf-date"></label>
            <label>Cliente<input v-model="client" type="text" name="client"></label>
            <label>Cliente RNC<input v-model="clientRNC" type="text" name="client-rnc"></label>

            <p>Cantidad de Conduce: {{ conduceQuantity }}, del {{ firstConduce }} al {{ lastConduce }}</p>
          </div>
        </div>

        <h2 class="center-text">Detalles del Mes</h2>
        <div class="detalles-raciones">
          <table id="main-table" class="pure-table pure-table-bordered center-align margin-sm">
            <thead>
              <tr class="center-text">
                <th>ITEM</th>
                <th>PRODUCTOS</th>
                <th>
                  <p>UNIDAD DE</p>
                  <p>MEDIDA</p>
                </th>
                <th>CANT.</th>
                <th>PRECIO</th>
                <th>
                  <p>SUB TOTAL</p>
                  <p>PRODUCTOS</p>
                  <p>EXENTOS</p>
                </th>
                <th>
                  <p>SUB-TOTAL</p>
                  <p>PRODUCTOS</p>
                  <p>GRAVADOS CON</p>
                  <p>EL 16%</p>
                </th>
                <th>
                  <p>SUB-TOTAL</p>
                  <p>PRODUCTOS</p>
                  <p>GRAVADOS CON</p>
                  <p>EL 18%</p>
                </th>
                <th>TOTAL ITBIS</th>
                <th>
                  <p>TOTAL</p>
                  <p>GENERAL</p>
                </th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(item, index) in listaProductos" v-bind:class="{
                yellow: hasNoItbis(item.itbis),
                green: hasItbis16(item.itbis),
                blue_cell: hasItbis18(item.itbis)
              }">
                <td>{{ index + 1 }}</td>
                <td>{{ item.nombre }}</td>
                <td>{{ item.measureUnit }}</td>
                <td>{{ numeral(item.total).format('0,0') }}</td> <!-- Cantidad -->
                <td class="price">{{ numeral(item.precio).format('0,0.00') }}</td>
                <td v-if="item.itbis === 0" class="with-no-itbis">{{ numeral(multiplicar(item.total, item.precio)).format('0,0.00') }}</td>
                <td v-else class="with-no-itbis">-</td>

                <td v-if="item.itbis === 0.16" class="itbis with-16">{{ numeral(multiplicar(item.total, item.precio)).format('0,0.00') }}</td>
                <td v-else class="with-16">-</td>

                <td v-if="item.itbis === 0.18" class="itbis with-18">{{ numeral(multiplicar(item.total, item.precio)).format('0,0.00') }}</td>
                <td v-else class="with-18">-</td>

                <td v-if="item.itbis !== 0" class="itbis-total" v-bind:class="item.itbis.toString().replace('.', '')">{{ numeral(percentage(item.total, item.precio, item.itbis)).format('0,0.00') }}</td>
                <td v-else>-</td>

                <td class="total">{{ numeral(totalWithItbis(item.total, item.precio, item.itbis)).format('0,0.00') }}</td>
              </tr>

              <tr class="bold">
                <td class="no-border"></td>
                <td>Total</td>
                <td></td>
                <td></td>
                <td>{{ numeral(priceTotal).format('0,0.00') }}</td>
                <td>{{ numeral(withNoItbisTotal).format('0,0.00') }}</td>
                <td>{{ numeral(with16Total).format('0,0.00') }}</td>
                <td>{{ numeral(with18Total).format('0,0.00') }}</td>
                <td>{{ numeral(allItbisTotal).format('0,0.00') }}</td>
                <td>{{ numeral(allTotalGeneral).format('0,0.00') }}</td>
              </tr>
            </tbody>
          </table>

          <table id="all-totals" class="pure-table pure-table-bordered center-align">
            <tr class="yellow">
              <td>Sub total exento</td>
              <td class="bold">{{ numeral(withNoItbisTotal).format('0,0.00') }}</td>
            </tr>
            <tr class="green">
              <td>Sub total gravado 16%</td>
              <td class="bold">{{ numeral(with16Total).format('0,0.00') }}</td>
            </tr>
            <tr class="blue_cell">
              <td>Sub total gravado 18%</td>
              <td class="bold">{{ numeral(with18Total).format('0,0.00') }}</td>
            </tr>
            <tr class="bold">
              <td>Sub total</td>
              <td>{{ numeral(allTotalGeneral - allItbisTotal).format('0,0.00') }}</td>
            </tr>
            <tr>
              <td>ITBIS 16%</td>
              <td>{{ numeral(justItbis16Total).format('0,0.00') }}</td>
            </tr>
            <tr>
              <td>ITBIS 18%</td>
              <td>{{ numeral(justItbis18Total).format('0,0.00') }}</td>
            </tr>
            <tr class="bold">
              <td>TOTAL GENERAL</td>
              <td>{{ numeral(allTotalGeneral).format('0,0.00') }}</td>
            </tr>
          </table> 

          <button @click="facturar" v-show="showBtnFacturar" class="btn btn__facturar no-print">Facturar</button> 
          <button @click="updateFacFinal" v-show="showBtnUpdateFacFinal" class="btn btn__facturar no-print">Guardar</button> 
        </div>
      </div>

      <div v-else class="select-month-year center-text">
        <!-- List FacFinal -->
        <div v-if="showListFacFinal === true" class="list-facfinal">
        <button @click="back" class="btn btn__back no-print"><i class="fa fa-arrow-left"></i></button>
        <p>Lista de Facturas Finales</p>
          <div v-for="item in listFacFinal" @click="loadFacFinal(item)" class="list-facfinal__item box-radius center-align">
            <ul>
              <li><span>Mes: </span>{{ lodash.capitalize(item.month) }}</li>
              <li><span>NCF: </span>{{ item.ncf }}</li>
              <li><span>Cliente: </span>{{ item.client }}</li>
              <li><span>Total: </span>RD$ {{ numeral(item.totalGeneral).format('0,0.00') }}</li>
              <li @click.stop="deleteFacFinal(item._id)"><span>| <i class="fa fa-trash delete-button"></i></span></li>
            </ul>
          </div>
        </div>

        <div v-else>
          <p>Seleccione Mes y Año para crear Factura Final</p>
          <select v-model="monthSelected">
            <option v-for="month in moment.months()" :value="month">{{ lodash.capitalize(month) }}</option>
          </select>

          <select v-model="yearSelected">
            <option>2022</option>
            <option>2021</option>
            <option>2020</option>
            <option>2019</option>
            <option>2018</option>
            <option>2017</option>
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
        priceTotal: 0,
        withNoItbisTotal: 0,
        with16Total: 0,
        with18Total: 0,
        allItbisTotal: 0,
        allTotalGeneral: 0,
        justItbis16Total: 0,
        justItbis18Total: 0,
        date: window.moment().format('YYYY-MM-DD'),
        dateNcf: window.moment().format('YYYY-MM-DD'),
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
            console.log(tempList)
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
        this.dateNcf = window.moment(f.fechaNcf, 'DD/MM/YYYY').format('YYYY-MM-DD')
        this.ncf = f.ncf
        this.client = f.client
        this.clientRNC = f.clientRNC
        this.firstConduce = f.firstConduce
        this.lastConduce = f.lastConduce
        this.conduceQuantity = f.conduceQuantity
        this.startOfMonth = f.startOfMonth
        this.endOfMonth = f.endOfMonth
        this.listaProductos = f.listaProductos
        this.priceTotal = f.priceTotal
        this.withNoItbisTotal = f.withNoItbisTotal
        this.with16Total = f.with16Total
        this.with18Total = f.with18Total
        this.allItbisTotal = f.allItbisTotal
        this.allTotalGeneral = f.allTotalGeneral
        this.justItbis16Total = f.justItbis16Total
        this.justItbis18Total = f.justItbis18Total
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
          fechaNcf: window.moment(this.dateNcf, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          ncf: this.ncf,
          client: this.client,
          clientRNC: this.clientRNC,
          listaProductos: this.listaProductos,
          subTotal: this.total,
          itbis: this.itbisTotal,
          totalGeneral: this.allTotalGeneral,
          month: this.monthSelected,
          year: this.yearSelected,
          startOfMonth: this.startOfMonth,
          endOfMonth: this.endOfMonth,
          firstConduce: this.firstConduce,
          lastConduce: this.lastConduce,
          conduceQuantity: this.conduceQuantity,
          priceTotal: this.priceTotal,
          withNoItbisTotal: this.withNoItbisTotal,
          with16Total: this.with16Total,
          with18Total: this.with18Total,
          allItbisTotal: this.allItbisTotal,
          allTotalGeneral: this.allTotalGeneral,
          justItbis16Total: this.justItbis16Total,
          justItbis18Total: this.justItbis18Total
        }
        this.mongoDbObj.facturasFinales.update({_id: self._id}, obj, (err, result) => {
          if (err) return console.log(err)
          window.flash('Factura guardada', 'success')
          localStorage.setObj('facturaFinal', obj)
          self.$router.push('/facfinalprint')
        })
      },
      deleteFacFinal (id) {
        let self = this
        let answerDeleteFacFinal = confirm('Desea realmente borrar esta Factura Final?')
        if (answerDeleteFacFinal === true) {
          this.mongoDbObj.facturasFinales.deleteOne({_id: id}, (err, result) => {
            if (err) return window.flash('Error al borrar Factura Final', 'error')
            window.flash('Factura Final borrada', 'info')
            self.$router.push('/')
            setTimeout(() => {
              self.$router.push('/facfinal')
            }, 100)
          })
        }
      },
      getTotalProductsSellMonth () {
        let self = this
        return new Promise((resolve, reject) => {
          this.mongoDbObj.conduces.aggregate([
            { $match: { month: self.monthSelected, year: self.yearSelected } },
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
          fechaNcf: window.moment(this.dateNcf, 'YYYY-MM-DD').format('DD/MM/YYYY'),
          ncf: this.ncf,
          client: this.client,
          clientRNC: this.clientRNC,
          listaProductos: this.listaProductos,
          subTotal: this.total,
          itbis: this.itbisTotal,
          totalGeneral: this.allTotalGeneral,
          month: this.monthSelected,
          year: this.yearSelected,
          startOfMonth: this.startOfMonth,
          endOfMonth: this.endOfMonth,
          firstConduce: this.firstConduce,
          lastConduce: this.lastConduce,
          conduceQuantity: this.conduceQuantity,
          priceTotal: this.priceTotal,
          withNoItbisTotal: this.withNoItbisTotal,
          with16Total: this.with16Total,
          with18Total: this.with18Total,
          allItbisTotal: this.allItbisTotal,
          allTotalGeneral: this.allTotalGeneral,
          justItbis16Total: this.justItbis16Total,
          justItbis18Total: this.justItbis18Total
        }
        this.mongoDbObj.facturasFinales.insert(obj, (err, result) => {
          if (err) return console.log(err)
          window.flash('Factura guardada', 'success')
          localStorage.setObj('facturaFinal', obj)
          self.$router.push('/facfinalprint')
        })
      },
      multiplicar (a, b) {
        let result = window.numeral(a * b)
        return result
      },
      percentage (a, b, itbis) {
        let add = a * b
        let result = window.numeral((add * itbis))
        return result
      },
      totalWithItbis (a, b, itbis) {
        let result = (a * b) + ((a * b) * itbis)
        return result
      },
      getSubTotal () {
        let self = this
        let tempArray = []
        window.$('.total').each((index, element) => {
          tempArray.push(self.cNaN(window.numeral(window.$(element).text())._value))
          if (index === (window.$('.total').length - 1)) {
            self.total = window.numeral(window._.sum(tempArray)).format('0.00')
          }
        })
      },
      getItbisTotal () {
        let self = this
        let tempArray = []
        window.$('.itbis').each((index, element) => {
          tempArray.push(window.numeral(window.$(element).text())._value)
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
      getPriceTotal () {
        let self = this
        let array = []
        window.$('td.price').each((index, e) => {
          array.push(self.cNaN(window.numeral(window.$(e).text())._value))
          if (index === (window.$('td.price').length - 1)) {
            self.priceTotal = window._.sum(array)
          }
        })
      },
      getWithNoItbisTotal () {
        let self = this
        let array = []
        window.$('td.with-no-itbis').each((index, e) => {
          array.push(self.cNaN(window.numeral(window.$(e).text())._value))
          if (index === (window.$('td.with-no-itbis').length - 1)) {
            self.withNoItbisTotal = window._.sum(array)
          }
        })
      },
      getColumnTotal (dataVar, eClass) {
        let self = this
        let array = []
        window.$('td.' + eClass).each((index, e) => {
          array.push(self.cNaN(window.numeral(window.$(e).text())._value))
          if (index === (window.$('td.' + eClass).length - 1)) {
            self[dataVar] = window._.sum(array)
          }
        })
      },
      getConduceRange () {
        let self = this
        this.mongoDbObj.conduces.aggregate([
        { $match: { month: self.monthSelected, year: self.yearSelected } },
        { $sort: { conduce: 1 } }
        ]).toArray((err, doc) => {
          if (err) return console.log(err)
          self.firstConduce = doc[0].conduce
          self.lastConduce = doc[doc.length - 1].conduce
          self.conduceQuantity = doc.length
        })
      },
      back () {
        this.showListFacFinal = false
        this.showEditFacFinal = false
      },
      cNaN (parseResult) {
        if (isNaN(parseResult)) return 0
        return parseResult
      },
      hasNoItbis (a) {
        if (a === 0) return true
        return false
      },
      hasItbis16 (a) {
        if (a === 0.16) return true
        return false
      },
      hasItbis18 (a) {
        if (a === 0.18) return true
        return false
      }
    },
    created () {
      this.getProductsList()
    },
    updated () {
      this.getSubTotal()
      this.getItbisTotal()
      this.getPriceTotal()
      this.getWithNoItbisTotal()
      this.getColumnTotal('with16Total', 'with-16')
      this.getColumnTotal('with18Total', 'with-18')
      this.getColumnTotal('allItbisTotal', 'itbis-total')
      this.getColumnTotal('allTotalGeneral', 'total')
      this.getColumnTotal('with-16', 'justItbis16Total')
      this.getColumnTotal('justItbis16Total', '016')
      this.getColumnTotal('justItbis18Total', '018')
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

<style lang="scss" scoped>
$yellow: #FFF2CC;
$green: #C6E0B4;
$blue_cell: #BDD7EE;
$blue_header: #9BC2E6;

table#all-totals .yellow, .yellow td:nth-child(n+5) {
  background-color: $yellow;
}
table#all-totals .green, .green td:nth-child(n+5) {
  background-color: $green;
}
table#all-totals .blue_cell, .blue_cell td:nth-child(n+5) {
  background-color: $blue_cell;
}
.blue_header {
  background-color: $blue_header;
}
#main-table.pure-table {
  border: 1px solid black;
  & td {
    margin: 0.5rem 0.08rem;
  }
  & td, th {
    border-left: 1px solid black;
  }
  & thead {
    background-color: $blue_header;
    & tr th {
      padding: 0 0.5rem;
      & p {
        margin: 0;
      }
    }
  }
}
.pure-table td.no-border {
  border: none;
}
.pure-table-bordered td {
  border-bottom: 1px solid black;
}

table#all-totals {
  /* position: relative;
  left: 62.2rem; */
}
.facfinal {
  width: 100%;
  height: 90%;
  overflow-y: auto;
}

.create-facfinal {
  width: 100%;
  & .facfinal__box {
    // background-color: #E8F1F5;
    height: auto;
    padding: 1rem 7%;
    width: 73%;
    border: 1px solid #000;
    border-radius: 5px;
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
.btn__back {
  display: block;
  position: relative;
  top: 1rem;
  left: 1rem;
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
      & .delete-button:hover {
        color: #E73A38;
      }
    }
  }
}
</style>
