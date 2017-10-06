<template>
  <div class="factura-final-print">
    <h2 class="center-text">{{ datosEmpresa.name }}</h2>
    <div class="datos-company center-text">
      <p>{{ datosEmpresa.address }}</p>
      <p>Contacto: {{ datosEmpresa.phone }}</p>
      <p>RNC: {{ datosEmpresa.rnc }}</p>
    </div>

    <div class="factura-final-data">
      <p>Fecha: {{ facturaFinal.fecha }}</p>
      <p>NCF: {{ facturaFinal.ncf }}</p>
      <p>CLIENTE: {{ facturaFinal.client }}</p>
      <p>RNC: {{ facturaFinal.clientRNC }}</p>
      <p>Perido de facturacion: del {{ facturaFinal.startOfMonth }} al {{ facturaFinal.endOfMonth }} de {{ facturaFinal.month }} {{ facturaFinal.year }}</p>
      <p>Cantidad de Conduce: {{ facturaFinal.conduceQuantity }}: del {{ facturaFinal.firstConduce }} al {{ facturaFinal.lastConduce }}</p>
    </div>

    <table class="pure-table pure-table-bordered center-align margin-sm">
      <thead>
        <tr>
          <th>Descripción del Producto</th>
          <th>Cantidad</th>
          <th>Precio</th>
          <th>ITBIS</th>
          <th>Total</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in facturaFinal.listaProductos">
          <td>{{ item.nombre }}</td>
          <td class="number">{{ item.total }}</td>
          <td class="number">{{ numeral(item.precio).format('0,0.00') }}</td>
          <td class="itbis number">{{ numeral(percentage(item.total, item.precio)).format('0,0.00') }}</td>
          <td class="total number">{{ numeral(multiplicar(item.total, item.precio)).format('0,0.00') }}</td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td class="bold">SUB-TOTAL</td>
          <td class="number">{{ numeral(facturaFinal.subTotal).format('0,0.00') }}</td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td class="bold">ITBIS</td>
          <td class="number">{{ numeral(facturaFinal.itbis).format('0,0.00') }}</td>
        </tr>

        <tr>
          <td></td>
          <td></td>
          <td></td>
          <td class="bold">TOTAL GENERAL</td>
          <td class="number">{{ numeral(facturaFinal.totalGeneral).format('0,0.00') }}</td>
        </tr>
      </tbody>
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
      percentage (a, b) {
        let add = a * b
        let result = (add * 0.18)
        return result
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
html, body {
  height: 100%;
}
@media print {
  .no-print {
    display: none;
  }
}

.factura-final-print {
  width: 100%;
  position: relative;
}

h2, h4 {
  margin: 0 auto 0.1rem auto;
}
.datos-company {
  position: relative;
  & p {
    font-size: 0.8rem;
    line-height: 0.3rem;
  }
}

.factura-final-data {
  & p {
    margin: 0.3rem auto;
  }
}

table {
  width: 100%;
  & td {
    font-size: 0.7rem;
  }
  & td.number {
    text-align: right;
  }
}

footer {
  width: 100%;
  & p {
    margin: 6rem auto;
  }
  & .footer__left {
    position: absolute;
    bottom: 1rem;
    left: 4rem;
  }
  & .footer__right {
    position: relative;
    top: 1rem;
    left: 50%;
  }
}
</style>
