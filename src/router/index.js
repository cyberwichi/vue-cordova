import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Adios from '@/components/albaranes/Adios'
import Avisos from '@/components/pedidos/PedidoPrincipalComponent'
import Avisoid from '@/components/pedidos/PedidoIdComponent'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/albaran/:id',
      name: 'albaran',
      component: Adios
    },
    {
      path: '/avisos',
      name: 'avisos',
      component: Avisos
    },
    {
      path: '/aviso/:id',
      name: 'avisoid',
      component: Avisoid
    }
  ]
})
