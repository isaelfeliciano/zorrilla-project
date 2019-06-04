<template>
  <div class="factura-batch">
    <div class="factura" v-for="factura in listaFacturas">
    <div class="datos-company center-text">
      <h2 class="center-text">{{ datosEmpresa.name }}</h2>
      <p>{{ datosEmpresa.address }}</p>
      <p>Contacto: {{ datosEmpresa.phone }}</p>
      <p>{{ datosEmpresa.rnc }}</p>
    </div>

      <div class="datos-centro__left">
        <p class="name">Nombre de Centro: {{ factura.nombreCentro }}</p>
        <p v-if="factura.directorCentro">Director Centro: {{ factura.directorCentro }}</p>
        <p v-else>Director Centro: ___________________________</p>
        <p>Provincia: {{ factura.provincia }}</p>
      </div>

      <div class="datos-centro__right">
        <p>Conduce: {{ factura.conduce }}</p>
        <p>Fecha: {{ factura.date }}</p>
        <p>Código Centro: {{ factura.codigoCentro }}</p>
        <p v-if="factura.telefono">Telefono: {{ factura.telefono }}</p>
        <p v-else>Telefono: _____________</p>
        <p>Distrito: {{ factura.distrito }}</p>
      </div>

    <table class="pure-table pure-table-bordered center-align margin-sm">
          <thead>
            <tr>
              <th>Descripción del Producto</th>
              <th>Unidad de Medida</th>
              <th>Cantidad</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in factura.listaProductos" class="product-row" v-if="item.precio >= 1">
              <td>{{ item.nombre }}</td>
              <td>{{ item.measureUnit }}</td>
              <td>{{ item.cantidad }}</td>
            </tr>
          </tbody>
        </table>

        <div class="observaciones">
          <label for="observaciones">
            <p>Observaciones:</p>
            <input type="text" name="observaciones">
          </label>
        </div>
 
        <div class="footer__left">
          <p class="center-text">________________________</p>
          <p class="center-text">Firma y Sello Suplidor</p>
        </div>

        <div class="footer__right">
          <p>Recibido Por</p>
          <p class="border_bottom">Nombre:</p>
          <p class="border_bottom">Firma:</p>
          <p class="border_bottom">Fecha Recp.:</p>
          <p class="border_bottom">Hora Recp.:</p>
        </div>
        
  </div>
  </div>
</template>

<script>
  export default {
    name: 'factura-batch',
    data () {
      return {
        listaFacturas: localStorage.getObj('facturaBatch')
      }
    },
    created () {
      let self = this
      window.$('body, html').addClass('height-auto')
      window.flash('Facturas Creadas', 'success')
      setTimeout(() => {
        window.print()
        window.$('body, html').removeClass('height-auto')
        self.$router.push('/')
      }, 1000)
    }
  }
</script>

<style lang="scss" scoped>
#root {
  height: auto;
}

.factura {
  width: 21.6cm;
  min-height: 27.9cm;
  padding-left: 2cm;
  padding-top: 2cm;
  padding-right: 2cm;
  padding-bottom: 2cm;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto auto auto auto auto;
}

@page {
  size: letter portrait;
  margin-left: 2cm;
  margin-top: 2cm;
  margin-right: 2cm;
  margin-bottom: 2cm;
}

h2, h4 {
  margin: 0 auto 0.1rem auto;
}
.datos-company {
  grid-column: span 2;
  & p {
    // font-size: 0.8rem;
    line-height: 0.3rem;
  }
}

.datos-centro__left {
  line-height: 0.2rem;
  & .name {
    line-height: 1rem;
  }
}
.datos-centro__right {
  line-height: 0.2rem;
  justify-self: end;
}

table {
  // width: 80%;
  grid-column: span 2;
  & .product-row td {
    // font-size: 0.7rem;
    line-height: 0.3rem;
    font-weight: bold;

  }
  & .product-row td:nth-child(2) {
    text-align: right
  }
}

.observaciones {
  grid-column: span 2;
  & label {
    width: 100%;
  }
  & p {
    width: 100%;
    border-bottom: solid 1px black;
    margin: 0 auto 0 auto;
  }
  & input {
    border: none;
    border-bottom: solid 1px black;
    border-radius: 0px;
    width: 100%;
  }
}

.footer__left {
  align-self: end;
}

.footer__right {
  line-height: 0.9rem;
  & .border_bottom {
    border-bottom: solid 1px black;
  }
}
</style>
