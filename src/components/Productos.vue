<template>
  <div class="productos">
    <transition
      name="search-box-transition"
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
      :duration="500"
      >
        <div class="add-product-box center-align box-radius">
          <input v-model="productName" class="box-radius" type="text" name="product-name" placeholder="Nombre">
          <input v-model.number="productPrice" class="box-radius" type="text" name="produc-price" placeholder="Precio">
          <button @click="addProduct">Agregar Producto</button>
        </div>
      </transition>
    <h2 class="center-text">PRODUCTOS</h2>
    <div class="detalles-raciones">
      <table class="pure-table pure-table-bordered center-align margin-sm">
        <thead>
          <tr>
            <th>Descripcion del Producto</th>
            <th>Precios RD$</th>
            <th>ITBIS?</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="item in listaProductos" class="productos__product-row">
            <td>{{ item.nombre }}</td>
            <td><input type="number" name="precio" :value="item.precio"></td>
            <td>
              <select v-if="item.itbis === 0.18">
                <option value="0.18">18%</option>
                <option value="0.16">16%</option>
                <option value="0">No</option>
              </select>

              <select v-else-if="item.itbis === 0.16">
                <option value="0.16">16%</option>
                <option value="0">No</option>
                <option value="0.18">18%</option>
              </select>

              <select v-else>
                <option value="0">No</option>
                <option value="0.16">16%</option>
                <option value="0.18">18%</option>
              </select>
            </td>
          </tr>
        </tbody>
      </table> 

      <button @click="saveProducts" class="btn--productos">Guardar</button> 
    </div>
  </div>
</template>

<script>
  export default {
    name: 'productos',
    data () {
      return {
        productName: '',
        productPrice: ''
      }
    },
    methods: {
      addProduct () {
        if (this.productName === '' || this.productPrice === '') return window.flash('Debe completar los campos vacios', 'error')
        this.listaProductos.push({nombre: this.productName, precio: this.productPrice, itbis: 0})
        this.productName = ''
        this.productPrice = ''
        this.listaProductos = window._.orderBy(this.listaProductos, ['nombre'])
      },
      saveProducts () {
        let self = this
        let arr = []
        window.$('.productos__product-row').each((index, element) => {
          arr.push({
            nombre: window.$(element).children('td:nth-child(1)').text(),
            precio: parseFloat(window.$(element).children('td').next().children().val()),
            itbis: parseFloat(window.$(element).children('td').next().next().children().val())
          })
          if (index === (window.$('.productos__product-row').length - 1)) {
            self.mongoDbObj.productos.update({descripcion: 'productos'}, {descripcion: 'productos', detalles: arr}, (err, result) => {
              if (err) return console.log(err)
              window.flash('Productos salvados', 'success')
            })
          }
        })
      }
    },
    created () {
      this.getProductsList()
    }
  }
</script>

<style lang="scss" scoped>
.productos {
  width: 100%;
  height: 90%;
  overflow-y: auto;
  position: relative;
}
table {
  font-size: 1.2rem;
}

.btn--productos {
  position: fixed;
  bottom: 1rem;
  right: 5rem;
}

.add-product-box {
  position: relative;
  width: 50rem;
  height: 3.5rem;
  background-color: #3782CF;
  padding-right: 0.5rem;
  padding-left: 0.5rem;
  & input {
    font-size: 1.4rem;
    width: 15rem;
    height: 2.3rem;
    color: #FFF;
    background-color: #4696E7;
    padding-left: 0.2rem;
    position: relative;
    top: 0.4rem;
    border: none;
  }
  & button {
    height: 2.3rem;
    margin: 0;
    top: 0.6rem;
    position: relative;
    box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.75);
    left: 1rem;
  }
}
</style>
