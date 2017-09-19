import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/Home'
import Update from '@/components/Update'
import Facturacion from '@/components/Facturacion'
import Factura from '@/components/Factura'
import FacFinal from '@/components/FacFinal'
import FacFinalPrint from '@/components/FacFinalPrint'
import Productos from '@/components/Productos'
import Relacion from '@/components/Relacion'
import RelacionPrint from '@/components/RelacionPrint'
import DatosEmpresa from '@/components/DatosEmpresa'
import FacturaBatch from '@/components/FacturaBatch'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/update',
      name: 'Update',
      component: Update
    },
    {
      path: '/facturacion',
      name: 'Facturacion',
      component: Facturacion
    },
    {
      path: '/factura',
      name: 'Factura',
      component: Factura
    },
    {
      path: '/facfinal',
      name: 'FacFinal',
      component: FacFinal
    },
    {
      path: '/facfinalprint',
      name: '/FacFinalPrint',
      component: FacFinalPrint
    },
    {
      path: '/productos',
      name: '/Productos',
      component: Productos
    },
    {
      path: '/relacion',
      name: '/Relacion',
      component: Relacion
    },
    {
      path: '/relacionprint',
      name: '/RelacionPrint',
      component: RelacionPrint
    },
    {
      path: '/datosempresa',
      name: '/DatosEmpresa',
      component: DatosEmpresa
    },
    {
      path: '/facturabatch',
      name: '/FacturaBatch',
      component: FacturaBatch
    }
  ]
})
