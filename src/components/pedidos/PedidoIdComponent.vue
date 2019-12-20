<template>
  <div class="">
    <img src="../../assets/logo.png" width="100px" height="100px" class="mt-3 mb-3">
    <br>
    <b-button pill v-on:click="atras">
      Atras
    </b-button>
     <b-button v-on:click.prevent="iralbaran(aviso.id)"  pill variant="success">Crear Albaran</b-button>
    <div id="vistapedido">
        <b-card
        tag="article"
        style="width:100%;"
        class="mb-2"
        >
        <div class="h4">
            Aviso Numero: {{aviso.id}}
        </div>
         <div class="h5">
            Cliente: {{aviso.tb_contacto.Nombre}}
        </div>
        <div class="h5">
            Direccion: {{aviso.tb_contacto.Direccion}}
        </div>
        <div class="h5">
            Telefono: {{aviso.tb_contacto.Telefono}}
        </div>
        <div class="h5 bg-success  text-white">
            Fecha y Hora:
            <br>
            {{aviso.fechaPrevista | moment("DD/MM/YYYY, h:mm a")}}
        </div>
        <div class="bg-dark  text-white">
            Comentarios:
            <br>
            {{aviso.comentario}}
        </div>
        <div class="h4 mt-2">
                Articulos Encargados:
            </div>
        <div class="container">
            <b-table striped :items="detallesAviso" :fields="fields"></b-table>
        </div>
        </b-card>
    </div>
  </div>
</template>

<script>
import router from '../../router'

export default {
  name: 'avisoid',
  data () {
    return {
      es: 'es',
      events: [],
      veraviso: false,
      numeroaviso: '',
      datos: [],
      aviso: {},
      detallesAviso: [],
      fields: ['articulo_nombre', 'cantidad', 'precio']
    }
  },
  created () {
    this.veravisos()
  },

  methods: {
    atras () {
      router.push({name: 'avisos'})
    },
    iralbaran (id) {
      router.push({ name: 'albaran', params: { id } })
    },
    veravisos () {
      this.veraviso = true
      this.numeroaviso = this.$route.params.id
      this.datos = JSON.parse(localStorage.getItem('avisos'))
      this.aviso = this.datos.find(element => element.id === this.numeroaviso)
      this.detallesAviso = JSON.parse(localStorage.getItem('detallesaviso' + this.numeroaviso))
    }
  }
}

</script>
<style scoped>
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
</style>
