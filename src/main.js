// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Header from './components/Header'
import router from './router/index.js'
import jQuery from 'jquery'
import Moment from 'moment'
import Numeral from 'numeral'
import Lodash from 'lodash'
window.moment = Moment
window.moment.locale('es-do')
window.$ = jQuery
window.Vue = require('vue/dist/vue.js')
window.events = new Vue()
window.flash = function (message, type) {
  window.events.$emit('flash', message, type)
}
window.numeral = Numeral
window._ = Lodash
var MongoClient = require('mongodb').MongoClient
var mongoDbObj
const vueFlash = require('vue-flash')
Vue.config.productionTip = false
Vue.component('app-header', Header)
Vue.component('flash', vueFlash)
Vue.mixin({
  data: function () {
    return {
      mongoDbObj: mongoDbObj,
      listaProductos: [],
      listaCentros: [],
      datosEmpresa: localStorage.getObj('datosEmpresa')
    }
  },
  methods: {
    getProductsList: function () {
      let self = this
      this.mongoDbObj.productos.aggregate([
      { $unwind: '$detalles' },
      { $group: { _id: { nombre: '$detalles.nombre', precio: '$detalles.precio', itbis: '$detalles.itbis' } } },
      { $project: { _id: 0, 'nombre': '$_id.nombre', 'precio': '$_id.precio', 'itbis': '$_id.itbis' } },
      { $sort: { nombre: 1 } }
      ]).toArray((err, doc) => {
        if (err) return console.log(err)
        self.listaProductos = doc
      })
    },
    getDatosEmpresa () {
      let self = this
      this.mongoDbObj.datosEmpresa.find({}).toArray((err, doc) => {
        if (err) return console.log(err)
        localStorage.setObj('datosEmpresa', doc[0])
        self.datosEmpresa = doc[0]
      })
    }
  },
  watch: {
    listaProductos () {
      console.log('listaProductos changed')
    }
  }
})

Storage.prototype.setObj = function (key, obj) {
  return this.setItem(key, JSON.stringify(obj))
}
Storage.prototype.getObj = function (key) {
  return JSON.parse(this.getItem(key))
}

function connectMongo () {
  MongoClient.connect('mongodb://127.0.0.1:27017/school_invoice_app', (err, db) => {
    if (err) {
      startVue()
      window.flash('Servidor Base de Datos no iniciado', 'error')
      return console.log(err)
    } else {
      console.log('Connected to DB')
      mongoDbObj = {
        db: db,
        productos: db.collection('productos'),
        centrosEducativos: db.collection('centrosEducativos'),
        conduces: db.collection('conduces'),
        datosEmpresa: db.collection('datosEmpresa'),
        facturasFinales: db.collection('facturasFinales'),
        relaciones: db.collection('relaciones')
      }
      startVue()
    }
  })
}
connectMongo()

// for auto update
import { checkUpdate } from '@/utils/update.js'
checkUpdate()

/* eslint-disable no-new */
function startVue () {
  new Vue({
    el: '#app',
    router,
    template: '<App/>',
    components: { App }
  }).$mount()
}
