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
const log4js = require('log4js')
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
// const ATLAS_CLUSTER_STRING = process.env.ATLAS_CLUSTER_STRING
// const ATLAS_DEV_CREDS = process.env.ATLAS_DEV_CREDS
var MongoClient = require('mongodb').MongoClient
var mongoDbObj
var mongoString
var dataBaseString
console.log(process.env.NODE_ENV)
if (process.env.NODE_ENV === 'development') {
  mongoString = 'mongodb://isael:yTS9ywfXXvVlEBPV@cluster0-shard-00-00-5lqqr.mongodb.net:27017,cluster0-shard-00-01-5lqqr.mongodb.net:27017,cluster0-shard-00-02-5lqqr.mongodb.net:27017/school_invoice_app_dev?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
  dataBaseString = 'school_invoice_app_dev'
  // mongoString = 'mongodb://127.0.0.1:27017/school_invoice_app'
} else {
  mongoString = 'mongodb://user:n9wfWJMLDt1AyBMN@cluster0-shard-00-00-5lqqr.mongodb.net:27017,cluster0-shard-00-01-5lqqr.mongodb.net:27017,cluster0-shard-00-02-5lqqr.mongodb.net:27017/school_invoice_app_yamasa?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true'
  dataBaseString = 'school_invoice_app_yamasa'
}
console.log(mongoString)
const vueFlash = require('vue-flash')
Vue.config.productionTip = false
Vue.component('app-header', Header)
Vue.component('flash', vueFlash)
Vue.mixin({
  data: function () {
    return {
      mongoDbObj: mongoDbObj,
      logger: logger,
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
      { $group: { _id: { nombre: '$detalles.nombre', measureUnit: '$detalles.measureUnit', precio: '$detalles.precio', itbis: '$detalles.itbis' } } },
      { $project: { _id: 0, 'nombre': '$_id.nombre', 'measureUnit': '$_id.measureUnit', 'precio': '$_id.precio', 'itbis': '$_id.itbis' } },
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
    },
    handleDBError (err) {
      window.flash('Error conectando a la Base de Datos. Revise su conexion a internet o intente mas tarde', 'error')
      window.logger.error(err)
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
if (!localStorage.getObj('datosEmpresa') || localStorage.getObj('datosEmpresa') === undefined) {
  localStorage.setObj('datosEmpresa', {name: 'N/A'})
}

log4js.configure({
  appenders: { dist_pro: { type: 'file', filename: 'dist_pro.log' } },
  categories: { default: { appenders: ['dist_pro'], level: 'error' } }
})
const logger = log4js.getLogger('dist_pro')
function connectMongo () {
  MongoClient.connect(mongoString, (err, client) => {
    if (err) {
      startVue()
      window.flash('Error al conectar a la Base de Datos', 'error')
      logger.error(err)
      return
    } else {
      const db = client.db(dataBaseString)
      startVue()
      window.flash('Exito, Conectado a Base de Datos', 'success')
      logger.info('Connected to DB')
      mongoDbObj = {
        db: db,
        productos: db.collection('productos'),
        centrosEducativos: db.collection('centrosEducativos'),
        conduces: db.collection('conduces'),
        datosEmpresa: db.collection('datosEmpresa'),
        facturasFinales: db.collection('facturasFinales'),
        relaciones: db.collection('relaciones')
      }
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
