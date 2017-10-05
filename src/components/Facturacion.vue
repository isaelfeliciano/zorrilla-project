<template>
  <div class="facturacion">
    <div class="facturacion__header">
      <select v-model="centroSelected" class="box-radius">
        <option v-for="item in listaCentros" :value="item.nombreCentro">{{ item.nombreCentro }}</option>
      </select>
      <button @click="saveCentre">Guardar</button>
      <button  @click="addCentre">Agregar Centro</button>
      <button  @click="showBatchBox = true">Factura en Batch</button>
      <button @click="showSearchBoxMethod" class="right"><i class="fa fa-search"></i></button>

      <transition
      name="search-box-transition"
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
      :duration="500"
      >
        <div class="search-box center-align-absolute box-radius" v-show="showSearchBox">
          <input v-model.number="searchValue" @keyup.enter="searchConduce" class="box-radius" type="text" name="search-conduce" placeholder="#000">
          <i class="fa fa-search fa-2x" @click="searchConduce"></i>
          <i class="fa fa-close fa-2x right" @click="showSearchBox = false"></i>
        </div>
      </transition>

      <transition
      name="batch-box-transition"
      enter-active-class="animated fadeInDown"
      leave-active-class="animated fadeOutUp"
      :duration="500"
      >
        <div class="batch-box center-align-absolute box-radius" v-show="showBatchBox">
          <input v-model="fechaBatch" type="date" name="fecha-batch" class="box-radius">
          <button  @click="facturarBatch">Continuar</button>
          <i class="fa fa-close fa-2x right" @click="showBatchBox = false"></i>
        </div>
      </transition>
    </div>

    <p v-if="showNoCentroSelected" class="no-centro-selected">Seleccione un centro de el menu arriba</p>

    <div v-else class="datos-centro">
      <h2 class="center-text">Datos Centro</h2>
      <div class="datos-centro__box center-align">
        <label for="nombre-centro">Nombre Centro<input type="text" name="nombre-centro" v-model="nombreCentro"></label>
        <label for="director-centro">Director Centro<input type="text" name="director-centro" v-model="directorCentro"></label>
        <label for="provincia">Provincia<input type="text" name="provincia" v-model="provincia"></label>
        <label for="codigo-centro">Código Centro<input type="text" name="codigo-centro" v-model="codigoCentro"></label>
        <label for="telefono">Telefono<input type="text" name="telefono" v-model="telefono"></label>
        <label for="distrito">Distrito<input type="text" name="distrito" v-model="distrito"></label>
        <label for="fecha">Fecha<input type="date" name="fecha" v-model="fecha"></label>
        <label for="raciones">Raciones<input type="text" name="raciones" v-model.number="raciones"></label>
      </div>

      <h2 class="center-text">Detalles de las Raciones Entregadas y Recibidas</h2>
      <div class="detalles-raciones">
        <table class="pure-table pure-table-bordered center-align margin-sm">
          <thead>
            <tr>
              <th>Descripción del Producto</th>
              <th>Cantidad</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in listaProductos" class="product-row" v-if="item.precio >= 1">
              <td>{{ item.nombre }}</td>
              <td v-if="item.cantidad"><input type="number" name="cantidad" :value="item.cantidad" @keyup="recalcutate(item.nombre, item.itbis, $event)"></td>
              <td v-else><input type="number" name="cantidad" value="0" @keyup="recalcutate(item.nombre, item.itbis, $event)"></td>
            </tr>
          </tbody>
        </table> 

        <button @click="facturar" v-show="showBtnFactuar" class="btn__facturar">Facturar</button> 
        <button @click="updateConduce" v-show="showBtnGuardar" class="btn__facturar">Guardar</button> 
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'facturacion',
  data: function () {
    return {
      msg: 'Welcome to Your Vue.js App',
      showNoCentroSelected: true,
      showBtnFactuar: true,
      showBtnGuardar: false,
      showSearchBox: false,
      showBatchBox: false,
      centroSelected: 'Seleccione un Centro',
      nombreCentro: '',
      directorCentro: '',
      provincia: '',
      codigoCentro: '',
      telefono: '',
      distrito: '',
      raciones: 0,
      fecha: window.moment().format('YYYY-MM-DD'),
      fechaBatch: window.moment().format('YYYY-MM-DD'),
      nextConduce: 0,
      total: 0,
      listaFacturas: [],
      searchValue: '',
      conduce: '',
      _id: ''
    }
  },
  methods: {
    getCentrosList () {
      let self = this
      this.mongoDbObj.centrosEducativos.find({}).toArray((err, doc) => {
        if (err) return console.log(err)
        self.listaCentros = doc
      })
    },
    saveCentre () {
      let self = this
      let datosCentro = {
        nombreCentro: this.nombreCentro,
        directorCentro: this.directorCentro,
        provincia: this.provincia,
        codigoCentro: this.codigoCentro,
        telefono: this.telefono,
        distrito: this.distrito,
        raciones: this.raciones
      }
      this.mongoDbObj.centrosEducativos.update({nombreCentro: self.nombreCentro}, datosCentro, {upsert: true}, (err, result) => {
        if (err) return console.log(err)
        self.getCentrosList()
        self.cleanFields()
        self.getCentrosList()
        self.centroSelected = 'Seleccione un centro'
        self.showNoCentroSelected = true
        window.flash('Informacion de Centro salvado', 'success')
      })
    },
    addCentre: function () {
      this.showNoCentroSelected = false
      this.cleanFields()
    },
    facturar () {
      if (
        this.nombreCentro === '' ||
        this.directorCentro === '' ||
        this.provincia === '' ||
        this.codigoCentro === '' ||
        this.telefono === '' ||
        this.distrito === '' ||
        this.raciones === 0
      ) {
        return window.flash('Debe llenar todos los campos', 'error')
      }
      this.saveCentre()
      console.log(this.nextConduce)
      let self = this
      let obj = {
        conduce: this.nextConduce,
        date: window.moment(this.fecha, 'YYYY-MM-DD').format('DD/MMMM/YYYY'),
        month: window.moment(this.fecha, 'YYYY-MM-DD').format('MMMM'),
        year: window.moment(this.fecha, 'YYYY-MM-DD').format('YYYY'),
        nombreCentro: this.nombreCentro,
        directorCentro: this.directorCentro,
        provincia: this.provincia,
        codigoCentro: this.codigoCentro,
        telefono: this.telefono,
        distrito: this.distrito,
        total: this.total,
        raciones: this.raciones
      }
      obj.listaProductos = self.listaProductos
      self.mongoDbObj.conduces.insert(obj, (err, result) => {
        if (err) return console.log(err)
        self.updateNextConduce()
        window.flash('Conduce salvado', 'success')
        localStorage.setObj('factura', obj)
        self.$router.push('/factura')
      })
    },
    facturarBatch () {
      let self = this
      this.showBatchBox = false
      window.flash('Preparando Facturas', 'info')
      this.listaCentros.forEach((e, i) => {
        this.mongoDbObj.conduces.find({ nombreCentro: e.nombreCentro }, { _id: false }).sort({_id: -1}).limit(1).toArray((err, doc) => {
          if (err) return console.log(err)
          console.log(i)
          doc[0].conduce = self.nextConduce + i
          doc[0].date = window.moment(this.fechaBatch, 'YYYY-MM-DD').format('DD/MMMM/YYYY')
          let tempArray = []
          doc[0].listaProductos.forEach((e, i) => {
            e.precio = self.listaProductos[i].precio
            e.itbis = self.listaProductos[i].itbis
            if (!e.cantidad) e.cantidad = 0
            let total = (e.cantidad * e.precio) + ((e.cantidad * e.precio) * e.itbis)
            tempArray.push(total)
            if (i === (doc[0].listaProductos.length - 1)) {
              doc[0].total = window._.sum(tempArray)
              self.listaFacturas.push(doc[0])
            }
          })
        })
        if (i === (self.listaCentros.length - 1)) {
          setTimeout(() => {
            console.log((self.listaCentros.length - 1))
            self.updateNextConduceToThis(self.listaFacturas[(self.listaCentros.length - 1)].conduce + 1)
            localStorage.setObj('facturaBatch', self.listaFacturas)
            self.$router.push('/facturabatch')
            self.mongoDbObj.conduces.insertMany(self.listaFacturas, (err, result) => {
              if (err) return console.log(err)
              window.flash('Facturas salvadas en Base de Datos', 'info')
            })
          }, 1000)
        }
      })
    },
    getNextConduce () {
      let self = this
      this.mongoDbObj.conduces.find({id: 'nextConduce'}).toArray((err, doc) => {
        if (err) return console.log(err)
        self.nextConduce = doc[0].nextConduce
      })
    },
    updateNextConduce () {
      let self = this
      let nextConduce = this.nextConduce + 1
      this.mongoDbObj.conduces.updateOne({id: 'nextConduce'}, {id: 'nextConduce', nextConduce: nextConduce}, (err, result) => {
        if (err) return console.log(err)
        console.log('nextConduce updated')
        self.getNextConduce()
      })
    },
    updateNextConduceToThis (nextConduce) {
      console.log(nextConduce)
      this.mongoDbObj.conduces.updateOne({id: 'nextConduce'}, {id: 'nextConduce', nextConduce: nextConduce}, (err, result) => {
        if (err) return console.log(err)
        console.log('nextConduce updated')
        self.getNextConduce()
      })
    },
    cleanFields () {
      this.nombreCentro = ''
      this.directorCentro = ''
      this.provincia = ''
      this.codigoCentro = ''
      this.telefono = ''
      this.distrito = ''
      this.raciones = ''
      this.getProductsList()
    },
    // For Review
    recalcutate (nombre, itbis, event) {
      console.log(event)
      let cantidad = event.target.valueAsNumber
      let self = this
      console.log(cantidad)
      this.listaProductos.find((o, i) => {
        if (o.nombre === nombre) {
          self.listaProductos[i]['cantidad'] = cantidad
          let tempArray = []
          self.listaProductos.forEach((item, index) => {
            cantidad = item.cantidad
            // console.log(cantidad)
            let precio = item.precio
            let itbis = item.itbis
            if (!cantidad) {
              cantidad = 0
              self.listaProductos[index]['cantidad'] = cantidad
            }
            let total = (cantidad * precio) + ((cantidad * precio) * itbis)
            tempArray.push(total)
            console.log(tempArray)
            if (index === (self.listaProductos.length - 1)) {
              // console.log(self.listaProductos)
              self.total = window._.sum(tempArray)
              console.log(self.total)
              console.log(self.listaProductos)
            }
          })
        }
      })
    },
    searchConduce () {
      let self = this
      if (this.searchValue === '') return window.flash('Entre un numero para iniciar la busqueda', 'info')
      this.mongoDbObj.conduces.find({conduce: this.searchValue}).toArray((err, doc) => {
        if (err) return console.log(err)
        if (!doc[0]) return window.flash('No hay resultados', 'info')
        let d = doc[0]
        self._id = d._id
        self.conduce = d.conduce
        self.nombreCentro = d.nombreCentro
        self.directorCentro = d.directorCentro
        self.provincia = d.provincia
        self.codigoCentro = d.codigoCentro
        self.telefono = d.telefono
        self.distrito = d.distrito
        self.raciones = d.raciones
        self.fecha = window.moment(d.date, 'DD/MMMM/YYYY').format('YYYY-MM-DD')
        self.listaProductos = d.listaProductos
        self.showNoCentroSelected = false
        self.showBtnGuardar = true
        self.showBtnFactuar = false
      })
    },
    updateConduce () {
      let self = this
      let obj = {
        conduce: this.conduce,
        date: window.moment(this.fecha, 'YYYY-MM-DD').format('DD/MMMM/YYYY'),
        month: window.moment(this.fecha, 'YYYY-MM-DD').format('MMMM'),
        year: window.moment(this.fecha, 'YYYY-MM-DD').format('YYYY'),
        nombreCentro: this.nombreCentro,
        directorCentro: this.directorCentro,
        provincia: this.provincia,
        codigoCentro: this.codigoCentro,
        telefono: this.telefono,
        distrito: this.distrito,
        raciones: this.raciones,
        total: this.total
      }
      console.log(obj)
      let arr = []
      obj.listaProductos = self.listaProductos
      window.$('.product-row').each((index, element) => {
        arr.push({
          nombre: window.$(element).children('td').text(),
          cantidad: parseInt(window.$(element).children('td').next().children().val())
        })
        if (index === (window.$('.product-row').length - 1)) {
          // obj.listaProductos = arr
          self.mongoDbObj.conduces.update({ _id: self._id }, obj, (err, result) => {
            if (err) return console.log(err)
            window.flash('Conduce salvado', 'success')
            localStorage.setObj('factura', obj)
            self.$router.push('/factura')
          })
        }
      })
    },
    showSearchBoxMethod () {
      // window.$('input[name="search-conduce"]').focus()
      this.showSearchBox = true
    }
  },
  watch: {
    centroSelected () {
      console.log('centroSelected changed')
      this.cleanFields()
      let self = this
      if (this.centroSelected === 'no-selected' || this.centroSelected === undefined) return
      this.mongoDbObj.conduces.find({ nombreCentro: this.centroSelected }).sort({_id: -1}).limit(1).toArray((err, doc) => { // Make this get just one
        if (err) return console.log(err)
        if (doc[0]) {
          let d = doc[0]
          self.nombreCentro = d.nombreCentro
          self.directorCentro = d.directorCentro
          self.provincia = d.provincia
          self.codigoCentro = d.codigoCentro
          self.telefono = d.telefono
          self.distrito = d.distrito
          self.raciones = d.raciones || 0
          self.listaProductos = d.listaProductos
          self.mongoDbObj.productos.find({descripcion: 'productos'}).toArray((err, doc) => {
            if (err) console.log(err)
            let tempArray = doc[0].detalles
            let totalArray = []
            tempArray.forEach((item, index) => {
              let itbis = item.itbis
              let precio = item.precio
              let cantidad = self.listaProductos[index].cantidad
              self.listaProductos[index]['itbis'] = itbis
              self.listaProductos[index]['precio'] = precio
              let total = (cantidad * precio) + ((cantidad * precio) * itbis)
              totalArray.push(total)
              if (index === (tempArray.length - 1)) {
                console.log(self.listaProductos)
                self.total = window._.sum(totalArray)
                console.log(self.total)
                self.showNoCentroSelected = false
                self.showBtnGuardar = false
                self.showBtnFactuar = true
              }
            })
          })
        } else {
          self.mongoDbObj.centrosEducativos.find({ nombreCentro: self.centroSelected }).toArray((err, doc) => {
            if (err) return console.log(err)
            let d = doc[0]
            self.nombreCentro = d.nombreCentro
            self.directorCentro = d.directorCentro
            self.provincia = d.provincia
            self.codigoCentro = d.codigoCentro
            self.telefono = d.telefono
            self.distrito = d.distrito
            self.raciones = d.raciones || 0
            self.showNoCentroSelected = false
            self.showBtnGuardar = false
            self.showBtnFactuar = true
          })
        }
      })
    }
  },
  created: function () {
    this.getProductsList()
    this.getCentrosList()
    this.getNextConduce()
  }
}
</script>

<style lang="scss" scoped>
.facturacion {
  width: 100%;
  height: 90%;
  overflow-y: auto;
}
.facturacion__header {
  height: 4rem;
  width: 100%;
  background-color: #D2D6D6;
  padding-right: 1rem;
  & select, input {
    margin: auto 1rem;
    font-size: 1.4rem;
    width: 15rem;
    border: 2px solid #4696E7;
  }
  & button {
    margin: 0.5rem auto;
  }
}

.no-centro-selected {
  font-size: 3rem;
  text-align: center;
  position: relative;
  top: 10rem;
  color: #005691;
}

.search-box, .batch-box {
  position: absolute;
  top: 8rem;
  width: 23rem;
  height: 3.5rem;
  background-color: #3782CF;
  padding-right: 0.5rem;
  & input {
    width: 15rem;
    height: 2.3rem;
    color: #FFF;
    background-color: #4696E7;
    padding-left: 0.2rem;
    position: relative;
    top: 0.5rem;
  }
  & i {
    position: relative;
    top: 0.6rem;
    color: #FFF;
    &:hover {
      color: #f0f0f0;
    }
    &:active {
      color: #ccc;
    }
  }
}
.batch-box {
  width: 35rem;
  & input {
    border: none;
    top: 0.3rem;
  }
  & button {
    height: 2.3rem;
    margin: 0;
    top: 0.6rem;
    position: relative;
    box-shadow: 2px 2px 5px 0px rgba(0,0,0,0.75);
  }
}

.datos-centro__box {
  background-color: #E8F1F5;
  height: auto;
  padding: 1rem 7%;
  width: 51%;
  & label {
    // margin: 0 2rem;
  }
}

table {
  font-size: 1.4rem;
  width: 50%;
  & input {
    font-size: 1.2rem;
    padding-right: 0.5rem;
    text-align: right;
  }
}

.btn__facturar {
  position: fixed;
  bottom: 1rem;
  right: 5rem;
}
/* eslint-disable eol-last */ 
</style>

