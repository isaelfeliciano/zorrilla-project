<template>
  <div class="factura-final-print">
    <img id="logo-z" src="static/logo-z.png">

    <div class="datos-company center-text">
      <h2 class="center-text">{{ datosEmpresa.name }}</h2>
      <p>{{ datosEmpresa.address }}</p>
      <p>Teléfono: {{ datosEmpresa.phone }}</p>
      <p>RNC: {{ datosEmpresa.rnc }}</p>
      <p class="bold">FACTURA</p>
    </div>

    <div class="factura-final-data">
      <p>Fecha: {{ facturaFinal.fecha }}</p>
      <p>NCF: {{ facturaFinal.ncf }}</p>
      <p>VALIDO HASTA: {{ facturaFinal.fechaNcf }}</p>
      <br>
      <p>CLIENTE: {{ facturaFinal.client }}</p>
      <p>RNC: {{ facturaFinal.clientRNC }}</p>
      <br>
      <p>Mes: {{ lodash.capitalize(facturaFinal.month) }} {{ facturaFinal.year }}</p>
      <p>Cantidad de Conduces: {{ facturaFinal.conduceQuantity }}. del {{ facturaFinal.firstConduce }} al {{ facturaFinal.lastConduce }}</p>
    </div>

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
        <tr v-for="(item, index) in facturaFinal.listaProductos" v-bind:class="{
          yellow: hasNoItbis(item.itbis),
          green: hasItbis16(item.itbis),
          blue_cell: hasItbis18(item.itbis)
        }">
          <td>{{ index + 1 }}</td>
          <td>{{ item.nombre }}</td>
          <td>{{ item.measureUnit }}</td>
          <td class="number">{{ numeral(item.total).format('0,0') }}</td> <!-- Cantidad -->
          <td class="price number">{{ numeral(item.precio).format('0,0.00') }}</td>
          <td v-if="item.itbis === 0" class="with-no-itbis number">{{ numeral(multiplicar(item.total, item.precio)).format('0,0.00') }}</td>
          <td v-else class="with-no-itbis number">-</td>

          <td v-if="item.itbis === 0.16" class="itbis with-16 number">{{ numeral(multiplicar(item.total, item.precio)).format('0,0.00') }}</td>
          <td v-else class="with-16 number">-</td>

          <td v-if="item.itbis === 0.18" class="itbis with-18 number">{{ numeral(multiplicar(item.total, item.precio)).format('0,0.00') }}</td>
          <td v-else class="with-18 number">-</td>

          <td v-if="item.itbis !== 0" class="itbis-total number" v-bind:class="item.itbis.toString().replace('.', '')">{{ numeral(percentage(item.total, item.precio, item.itbis)).format('0,0.00') }}</td>
          <td v-else class="number">-</td>

          <td class="total number">{{ numeral(totalWithItbis(item.total, item.precio, item.itbis)).format('0,0.00') }}</td>
        </tr>

        <tr class="bold">
          <td class="no-border"></td>
          <td>Total</td>
          <td></td>
          <td></td>
          <td class="number">{{ numeral(facturaFinal.priceTotal).format('0,0.00') }}</td>
          <td class="number">{{ numeral(facturaFinal.withNoItbisTotal).format('0,0.00') }}</td>
          <td class="number">{{ numeral(facturaFinal.with16Total).format('0,0.00') }}</td>
          <td class="number">{{ numeral(facturaFinal.with18Total).format('0,0.00') }}</td>
          <td class="number">{{ numeral(facturaFinal.allItbisTotal).format('0,0.00') }}</td>
          <td class="number">{{ numeral(facturaFinal.allTotalGeneral).format('0,0.00') }}</td>
        </tr>
      </tbody>
    </table>


    <table id="all-totals" class="pure-table pure-table-bordered">
      <tr class="yellow">
        <td>Sub total exento</td>
        <td class="bold number">{{ numeral(facturaFinal.withNoItbisTotal).format('0,0.00') }}</td>
      </tr>
      <tr class="green">
        <td>Sub total gravado 16%</td>
        <td class="bold number">{{ numeral(facturaFinal.with16Total).format('0,0.00') }}</td>
      </tr>
      <tr class="blue_cell">
        <td>Sub total gravado 18%</td>
        <td class="bold number">{{ numeral(facturaFinal.with18Total).format('0,0.00') }}</td>
      </tr>
      <tr class="bold">
        <td>Sub total</td>
        <td class="number">{{ numeral(facturaFinal.allTotalGeneral - facturaFinal.allItbisTotal).format('0,0.00') }}</td>
      </tr>
      <tr>
        <td>ITBIS 16%</td>
        <td class="number">{{ numeral(facturaFinal.justItbis16Total).format('0,0.00') }}</td>
      </tr>
      <tr>
        <td>ITBIS 18%</td>
        <td class="number">{{ numeral(facturaFinal.justItbis18Total).format('0,0.00') }}</td>
      </tr>
      <tr class="bold">
        <td>TOTAL GENERAL</td>
        <td class="number">{{ numeral(facturaFinal.allTotalGeneral).format('0,0.00') }}</td>
      </tr>
    </table>

    <footer>
      <p class="bold center-text">Jose A. Zorrilla Castillo</p>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'facturafinalprint',
    data () {
      return {
        numeral: window.numeral,
        lodash: window._,
        placeholder: '',
        facturaFinal: localStorage.getObj('facturaFinal'),
        datosEmpresa: localStorage.getObj('datosEmpresa')
      }
    },
    methods: {
      multiplicar (a, b) {
        let result = a * b
        return result
      },
      percentage (a, b, itbis) {
        let add = a * b
        let result = window.numeral((add * itbis)).format('0.00')
        return result
      },
      totalWithItbis (a, b, itbis) {
        let result = (a * b) + ((a * b) * itbis)
        return result
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
      let self = this
      setTimeout(function () {
        window.print()
        self.$router.push('/')
      }, 1000)
    }
  }

</script>

<style lang="scss" scoped>
/* html, body {
  height: 100%;
} */
@media print {
  .no-print {
    display: none;
  }
}

.factura-final-print {
  display: grid;
  grid-template-columns: 0.5fr 1fr 0.5fr;
  grid-template-rows: 100px 150px 525px auto auto;
  width: 21.6cm;
  min-height: 27.9cm;
  padding-left: 0.5cm;
  padding-top: 1cm;
  padding-right: 0.5cm;
  padding-bottom: 0.5cm;
}

@page {
  size: letter landscape;
  margin-left: 2cm;
  margin-top: 2cm;
  margin-right: 2cm;
  margin-bottom: 2cm;
}

h2, h4 {
  margin: 0 auto 0.1rem auto;
}

img#logo-z {
  max-width: 200px;
  position: absolute;
  left: 17cm;
}
.datos-company {
  grid-column: span 3;
  align-self: center;
  & p {
    font-size: 0.8rem;
    line-height: 0.3rem;
  }
}

.factura-final-data {
  grid-column: span 3;
  position: relative;
  left: 5px;
  line-height: 0.8rem;
  & p {
    margin: 0.3rem auto;
  }
}

$yellow: #FFF2CC;
$green: #C6E0B4;
$blue_cell: #BDD7EE;
$blue_header: #9BC2E6;

table#main-table {
  grid-column: span 3;
  font-size: 10px;
}

table#all-totals {
  justify-self: end;
  grid-column: span 3;
  font-size: 12px;
  & td.number{
    text-align: right;
  }
}
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
table#main-table {
  border: 1px solid black;
  & td {
    margin: 0.5rem 0.08rem;
    &.number {
      text-align: right;
    }
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

footer {
  justify-self: center;
  align-self: end;
  & p {
    width: 284px;
    border-top: 1px solid black;
  }
}
</style>
