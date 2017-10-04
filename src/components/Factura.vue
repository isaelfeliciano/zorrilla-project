<template>
  <div class="factura">
    <h2 class="center-text">{{ datosEmpresa.name }}</h2>
    <div class="datos-company center-text">
      <p>{{ datosEmpresa.address }}</p>
      <p>Contacto: {{ datosEmpresa.phone }}</p>
      <p>{{ datosEmpresa.rnc }}</p>
    </div>

    <div class="datos-centro center-text">
      <div class="datos-centro__left inline-block left">
        <p>Nombre de Centro: {{ factura.nombreCentro }}</p>
        <p v-if="factura.directorCentro">Director Centro: {{ factura.directorCentro }}</p>
        <p v-else>Director Centro: ___________________________</p>
        <p>Provincia: {{ factura.provincia }}</p>
      </div>

      <div class="datos-centro__right inline-block">
        <p>Conduce: {{ factura.conduce }}</p>
        <p>Fecha: {{ factura.date }}</p>
        <p>Código Centro: {{ factura.codigoCentro }}</p>
        <p v-if="factura.telefono">Telefono: {{ factura.telefono }}</p>
        <p v-else>Telefono: _____________</p>
        <p>Distrito: {{ factura.distrito }}</p>
      </div>
    </div>

    <h4 class="center-text">DETALLES DE LAS RACIONES ENTREGADAS Y RECIBIDAS</h4>

    <table class="pure-table pure-table-bordered center-align margin-sm">
          <thead>
            <tr>
              <th>Descripción del Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in factura.listaProductos" class="product-row" v-if="item.precio >= 1">
              <td>{{ item.nombre }}</td>
              <td>{{ item.cantidad }}</td>
            </tr>
          </tbody>
        </table>

        <p class="observaciones">OBSERVACIONES:</p> 
        <div class="line"></div>
        <div class="line"></div>


        <footer>
          <div class="footer__left">
            <p class="center-text">________________________</p>
            <p class="center-text">Firma y Sello Suplidor</p>
          </div>

          <div class="footer__right">
            <p>Recibido Por:</p>
            <p>Nombre: _________________</p>
            <p>Firma: __________________</p>
            <p>Fecha recp. _____________</p>
            <p>Hora recp. ______________</p>
          </div>
        </footer>
  </div>
</template>

<script>
  export default {
    name: 'factura',
    data () {
      return {
        placeholder: '',
        factura: localStorage.getObj('factura'),
        datosEmpresa: localStorage.getObj('datosEmpresa')
      }
    },
    created () {
      let self = this
      setTimeout(function () {
        window.print()
        self.$router.push('/facturacion')
      }, 1000)
    }
  }

</script>

<style lang="scss" scoped>
@media print {
  .no-print {
    display: none;
  }
}

.factura {
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

.datos-centro {
  width: 100%;
  position: relative;
  line-height: 0.3rem;
  & .datos-centro__left, .datos-centro__right {
    text-align: left;
    position: relative;
  }
  & .datos-centro__right {
    position: relative;
    left: 8rem;
  }
}

table {
  width: 80%;
  & .product-row td {
    font-size: 0.7rem;
    font-weight: bold;

  }
  & .product-row td:nth-child(2) {
    text-align: right
  }
}

.observaciones {
  margin: auto 0 auto 0;
}

.line {
  width: 80%;
  display: block;
  border-bottom: 1px solid black;
  height: 1rem;
}

footer {
  width: 100%;
  & p {
    margin: auto 0 0.1rem 0;
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
