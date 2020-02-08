<template>
  <div class="yo">
    <img src="../../assets/logo.png" width="100px" height="100px" class="mt-3 mb-3">
    <br>
    <b-button class="shadow-lg" pill v-on:click="atras">
      Atras
    </b-button>
      <b-card
        title="Calendario de Avisos"
        tag="article"
        style=""
        class="m-3 shadow-lg rounded "
      >
         <vue-cal
            :time="false"
            default-view="day"
            events-count-on-year-view
            events-on-month-view="true"
            class="vuecal--rounded-theme"
            v-if="event"
            :locale="es"
            style=""
            :events="events"
            :on-event-click="onEventClick"
        >
            <template v-slot:event-renderer="{ event, view }">
            <div style="cursor:pointer">
                <div class="vuecal__event-title" v-html="event.title" />
            </div>
            </template>
        </vue-cal>

       </b-card>
    <h4 class="">Ultimos Avisos Asignados</h4>
    <div class="table-responsive ">
      <table class="table w-75 mx-auto shadow-lg mb-5">
      <thead class="bg-white" >
        <th class="border border-secondary">Id</th>
        <th class="border border-secondary">Cliente</th>
        <th class="border border-secondary">Fecha/Hora prevista</th>
      </thead>
      <tbody class="bg-white">
        <tr class="" v-for="(dato, index) in datos" :key="index" v-on:click.prevent="iraviso(dato.id)">
          <td class="border h5 border-secondary">{{dato.id}}</td>
          <td class="border h5 border-secondary" >{{dato.tb_contacto.Nombre}}</td>
          <td class="border h5 border-secondary text-right" >{{dato.fechaPrevista | moment("DD/MM/YYYY, h:mm a")}}</td>
        </tr>
      </tbody>
    </table>
    </div>
  </div>
</template>

<script>
import VueCal from 'vue-cal'
import 'vue-cal/dist/vuecal.css'
import 'vue-cal/dist/i18n/es.js'
import router from '../../router'

export default {
  name: 'avisos',
  components: {VueCal},
  data () {
    return {
      es: 'es',
      event: true,
      events: [],
      numeroaviso: '',
      datos: [],
      aviso: [],
      fields: ['id', {key: 'tb_contacto.Nombre', label: 'Cliente'}, 'fechaPrevista']
    }
  },
  mounted () {
    this.veravisos()
  },

  methods: {
    atras () {
      router.push({name: 'HelloWorld'})
    },
    iraviso (id) {
      router.push({ name: 'avisoid', params: { id } })
    },
    iralbaran (id) {
      router.push({ name: 'albaran', params: { id } })
    },
    onEventClick (event, e) {
      let id = event.title
      router.push({ name: 'avisoid', params: { id } })
      /* this.veraviso = true
      this.numeroaviso = event.title
      this.aviso = this.datos.find(element => element.id === event.title)
      this.detallesAviso = JSON.parse(localStorage.getItem('detallesaviso' + event.title)) */
      // Prevent navigating to narrower view (default vue-cal behavior).
      e.stopPropagation()
    },
    veravisos () {
      this.events = []
      this.event = false
      this.datos = JSON.parse(localStorage.getItem('avisos'))
      this.datos.sort(function (a, b) {
        if (a.fechaPrevista > b.fechaPrevista) {
          return -1
        }
        if (a.fechaPrevista < b.fechaPrevista) {
          return 1
        }
        // a must be equal to b
        return 0
      })
      this.datos.forEach(element => {
        if (element.fechaPrevista) {
          if (element.empleado_id == null) {
            var empleado = 'SIN ASIGNAR'
          } else {
            empleado = element.empleado.name
          }
          let data = {
            start: element.fechaPrevista,
            end: element.fechaPrevista,
            title: element.id,
            content:
                '<br><strong>Cliente: ' +
                element.tb_contacto.Nombre +
                '</strong>' +
                '<br> Direccion Cliente: <strong> ' +
                element.tb_contacto.Direccion +
                '</strong>' +
                '<br> <br>Empleado asignado: <strong> ' +
                empleado +
                '</strong>',
            class: 'btn btn-success p-0 m-1 '
          }
          this.events.push(data)
        }
        this.event = true
      })
    }
  }
}
</script>
<style scoped>
*{
  box-sizing: border-box;
}
.fade-enter-active {
  transition: opacity 0.1s;
}
.fade-leave-active {
  transition: opacity 0.1s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.container {
    overflow: scroll;
}
.vuecal {
  width:100%;height:250px; font-size: 12px;overflow: visible;
}
.yo {
  background-color: rgb(231, 231, 231)
}
</style>
