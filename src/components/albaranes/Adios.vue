<template>
  <div class='yo'>
    <img src="../../assets/logo.png" width="100px" height="100px" class="mt-3 mb-3">
    <br>
    <b-button pill v-on:click="atras" >
      Atras
    </b-button>
    <b-card
        tag='article'
        style='width:98%;'
        class=' yo shadow-lg my-2 mx-auto'
    >
        <div class="linea shadow">
          <div class=''>
            Aviso Numero: <strong>{{aviso.id}}</strong>
          </div>
          <div class=' '>
              Cliente: <strong>{{aviso.tb_contacto.Nombre}}</strong>
          </div>
          <div class=' '>
              Direccion: <strong> {{aviso.tb_contacto.Direccion}}</strong>
          </div>
          <div class=' '>
              Telefono: <strong>{{aviso.tb_contacto.Telefono}}</strong>
          </div>
          <div class=' '>
              Fecha y Hora:
              <br>
            <strong> {{aviso.fechaPrevista | moment('DD/MM/YYYY, h:mm a')}}</strong>
          </div>
          <div class=' '>
              Comentarios:
              <br>
              <strong>{{aviso.comentario}}</strong>
          </div>
        </div>
                <!-- maquinas -->
        <div class="linea mt-1 shadow">
            <small id="helpId3" class="form-text text-muted">Comience a teclear y pulse espacio para sugerencias <br> Pulsando solo espacio tendra una lista de las maquinas registradas</small>
            <div class="m-3 autocomplete">
            <input type="text" v-model="maquina" class="p-2 w-75"
              @blur="onBlur = true"
              aria-describedby="helpId3"
              @focus="
              onFocus = true;
              onBlur = false;
              "
              placeholder="Nombre de Maquina"
              v-on:click.prevent="buscarMaquina(maquina)">
            <div class="autocomplete-items" v-if="onFocus">
              <div
              v-for="(maquina, index) in listamaquinas"
              @click="maquinaselegidas.push(maquina);onFocus = false;"
              :key="index"
              >
                <div>
                  <strong>{{
                    maquina.nombre
                    }}
                  </strong>
                </div>
              </div>
            </div>
          </div>
            <h4>Maquinas Reparadas:</h4>
            <div  class="linea w-75 mx-auto mb-2 p-2" v-for="(maquina,index) in maquinaselegidas" :key="index">
              <strong>{{maquina.nombre}}</strong>
              <br>
               Referencia:
              <input class="p-2 w-100" type="text" v-model="referencia[index]" placeholder="Introduce la referencia">
              <img
                  id='clear3'
                  src='./Delete.png'
                  width='45px'
                  v-on:click='borrarMaquina(index)'
                />
            </div>
        </div>
        <div class="linea shadow mt-1">
          <div class='h4 mt-2'>
                Materiales Entregados:
          </div>
          <div class='container '>
            <table class="table table-sm">
              <thead class="display-5 p-3">
                <th class="display-5 p-3" >ARTICULO</th>
                <th class="display-5 p-3">CANTIDAD</th>
                <th class="display-5 p-3 text-right">PRECIO</th>
              </thead>
              <tbody>
                <tr v-on:change='calcularTotal' class='linea' v-for='(detalle, index ) in detallesAlbaran' :key='index'>
                <td>
                    {{detalle.articulo_nombre}}
                  </td>
                  <td>
                    <input type='text' class='w-50 text-right' v-model='detalle.cantidad'>
                  </td>
                  <td class='text-right'>
                    <input type='text' class='w-50 text-right' v-model='detalle.precio'>
                  </td>
                  <td>
                    <img
                      id='add1'
                      src='./Delete.png'
                      width='25px'
                      v-on:click='borrarDetallesAlbaran(index)'
                    />
                  </td>
                </tr>
              </tbody>
              <tfoot>
              </tfoot>
            </table>
          </div>
        </div>
        <!-- articulos -->
        <div class="dflex flex-row linea shadow p-2 mt-1">
          <div class="col-12 h4 mt-2">Añadir Articulos: <b-button class="botoncillo btn btn-success" v-b-modal.modal-prevent-closing>+</b-button></div>
          <div v-if="articulo.Nombre" class="linea col-11 mx-auto mb-2 p-2" >
                <strong>{{articulo.Nombre}}</strong>
                <br>
                <br>
                <label for="cantidad">CANTIDAD</label>
                <input type="text" v-model="cantidad" name="cantidad" class="w-25">
                <br>
                <label for="precio">PRECIO</label>
                <input type="text" v-model="articulo.UPC" name="precio" class="w-25">
                <br>
                <br>
                <img
                    id='add1'
                    src='./add.png'
                    width='45px'
                    v-on:click='sumarArticulo(articulo, cantidad)'
                  />
                <img
                    id='add1'
                    src='./Delete.png'
                    width='45px'
                    v-on:click='articulo={Nombre: null, UPC:null, Id: 0}; buscaId=null '
                  />
          </div>
          <div class="referente linea p-2 mt-3 col-11 mx-auto overflow-auto">
              <small id="helpId4" class="form-text text-muted">Comience a teclear y pulse espacio para sugerencias <br> Pulsando solo espacio tendra una lista de los articulos registrados</small>
              <div class="mt-3 autocomplete w-75">
                <input type="text" v-model="busca" class="w-75 py-2"
                  @blur="onBlur2 = true"
                  @focus="
                  onFocus2 = true;
                  onBlur2 = false;
                  "
                  placeholder="Buscar por Nombre"
                  v-on:click.prevent="buscarArticulo(busca)">
                <div class="autocomplete-items" v-if="onFocus2">
                  <div
                  v-for="(arti, index) in listaarticulos"
                  @click="articulo=arti;onFocus = false;busca=''"
                  :key="index"
                  >
                    <div>
                      <strong>{{
                      arti.Nombre
                        }}
                      </strong>
                    </div>
                  </div>
                </div>
              </div>
          </div>
          <!-- por id -->
            <div class="col-12 mx-auto">
              <input type="text" v-model="buscaId" class="p-2 m-3 w-75"
              placeholder="Buscar por Referencia"
              >
              <b-button pill v-on:click.prevent="buscarReferencia()" class="p-2 ">Buscar
              </b-button>
            </div>
        </div>
                <!-- finalizado -->
        <div class='linea shadow mt-1'>
          <div class='card-header'>
          <h4>Trabajo Finalizado</h4>
          <input
            class='form-control quitar'
            type='checkbox'
            name='terminada'
            value='Trabajo Finalizado'
            v-model='aviso.terminada'
            placeholder='terminado'
            />
            <label class='poner' v-if='aviso.terminada' for='terminada'
            >SI</label>
            <label class='poner' v-else for='terminada'>NO</label>
          </div>

          <div class='form-group p-3'>
            <h5>
              <strong>Observaciones / Material Pendiente</strong>
            </h5>
            <textarea
              v-model='observaciones'
              class='form-control sombra'
              name='observaciones'
              cols='85'
              rows='3'
              :placeholder='observaciones'
              ></textarea>
          </div>
          <div class='form-group p-3'>
            <h5>
              <strong>Trabajos Realizados</strong>
            </h5>
            <textarea
              v-model='trabajos'
              class='form-control sombra'
              name='trabajos'
              cols='85'
              rows='3'
              :placeholder='trabajos'
              ></textarea>
          </div>
      </div>
      <div class="linea shadow mt-1 p-4 table">
        <h4>Importes a Facturar</h4>
        <td>SubTotal: {{subtotal}}</td>
        <td>Iva 21%: {{iva}}</td>
        <td class="">Total: <strong>{{total}} €</strong></td>
      </div>
      <!-- firmas -->
      <div class='linea shadow mt-1'>
        <div class=''>
          <h4>Firmas</h4>
        </div>
        <div class='firmas'>
          <div class='text-center col  sombra p-2 quitar'>
          Firma Cliente
            <div id='cliente' class>
              <div>
                <img
                  v-if="flagFirmaCliente"
                  id='save'
                  src='./firma.png'
                  width='45px'
                  v-on:click='guardaFirmaCliente'
                />
              </div>
              <VueSignaturePad
                width="200px"
                height="200px"
                ref="signaturePad"
                :customStyle = 'option'
                class="mx-auto"
              />
              </div>
                <img
                  v-if="!flagFirmaCliente"
                  id='clear'
                  src='./Delete.png'
                  width='45px'
                  v-on:click='borrarFirmaCliente'
                />
            </div>
            <img class id='firmacli' alt />
            <div class='text-center col sombra quitar p-2'>
              Firma Empleado
              <div id='firmacliflag'>
                <div>
                  <img
                    v-if="flagFirmaEmpleado"
                    id='save2'
                    src='./firma.png'
                    width='45px'
                    v-on:click='guardaFirmaEmpleado'
                  />
                </div>
                <VueSignaturePad
                  width="200px"
                  height="200px"
                  ref="signaturePad2"
                  :customStyle = 'option'
                  class="mx-auto"
                />
              </div>
              <img
                v-if="!flagFirmaEmpleado"
                id='clear2'
                src='./Delete.png'
                width='45px'
                v-on:click='borrarFirmaEmpleado'
              />
            </div>
            <img id='firmaemp' alt />
          </div>
      </div>
       <img
          class="my-3 shadow"
          id='save'
          src='./Save.png'
          width='80px'
          v-on:click='guardaAlbaran'
          />
      </b-card>
      <b-modal
      id="modal-prevent-closing"
      ref="modal"
      title="Articulo Nuevo"
      size="xl"
      @ok="handleOk"
    >
      <form ref="form" @submit.stop.prevent="añadirArticulo">
        <b-form-group
          :state="nameState"
          label="Nombre"
          label-for="name-input"
          invalid-feedback="Introcuce el nombre del articulo"
        >
          <b-form-input
            id="name-input"
            v-model="name"
            :state="nameState"
            required
          ></b-form-input>
        </b-form-group>
        <b-form-group
          :state="upcState"
          label="Precio"
          label-for="upc-input"
          invalid-feedback="Introcuce el precio del articulo"
        >
          <b-form-input
            id="upc-input"
            v-model="upc"
            :state="upcState"
            required
          ></b-form-input>
        </b-form-group>
      </form>
    </b-modal>
  </div>
</template>

<script>
import router from '../../router'
export default {
  name: 'Adios',
  data () {
    return {
      msg: 'cyberwichi',
      datos: [],
      aviso: {},
      detallesAviso: [],
      detallesAlbaran: [],
      fields: ['articulo_nombre', 'cantidad', 'precio'],
      iva: 0,
      subtotal: 0,
      total: 0,
      option: {
        penColor: 'rgb(0, 0, 0)',
        backgroundColor: 'rgb(255,255,255)'
      },
      firmaCliente: '',
      firmaEmpleado: '',
      flagFirmaCliente: true,
      flagFirmaEmpleado: true,
      observaciones: '',
      terminada: false,
      maquina: '',
      listamaquinas: [],
      listaarticulos: [],
      maquinaselegidas: [],
      currentFocus: 2,
      autocomplete: '',
      onBlur: true,
      onFocus: false,
      onBlur2: true,
      onFocus2: false,
      referencia: [],
      ruta: '',
      articuloselegidas: [],
      articulos: [],
      busca: '',
      articulo: {
        Id: '0',
        Nombre: this.name,
        UPC: ''
      },
      cantidad: '',
      buscaId: '',
      find: '',
      name: '',
      upc: '',
      fechaalta: '',
      nameState: null,
      upcState: null,
      fechaaltaState: null,
      trabajos: null
    }
  },
  created () {
    this.veravisos()
    this.maquinaselegidas = []
    this.articuloselegidas = []
    this.ruta = 'aviso/' + this.aviso.id
  },
  watch: {
    maquina () {
      this.buscarMaquina(this.maquina)
    },
    busca () {
      this.buscarArticulo(this.busca)
    }
  },
  methods: {
    buscarReferencia () {
      if (this.buscaId) {
        this.articulos.forEach(articulo => {
          articulo.referencias.forEach(element => {
            if (element.referencia === this.buscaId) this.find = articulo
            console.log(element.referencia)
          })
        })
        if (this.find) {
          this.articulo = this.find
          this.find = {}
        } else {
          this.makeToast('danger', 'Articulo no encontrado')
          this.buscaId = ''
        }
      }
    },
    añadirArticulo () {
      this.articulo = {
        Id: '0',
        Nombre: this.name,
        UPC: this.upc
      }
      this.$nextTick(() => {
        this.$bvModal.hide('modal-prevent-closing')
      })
    },
    handleOk (bvModalEvt) {
      // Prevent modal from closing
      bvModalEvt.preventDefault()
      // Trigger submit handler
      this.añadirArticulo()
    },
    checkFormValidity () {
      const valid = this.$refs.form.checkValidity()
      this.nameState = valid
      this.upcState = valid
      this.fechaaltaState = valid
      return valid
    },
    borrarDetallesAlbaran (index) {
      this.detallesAlbaran.splice(index, 1)
      this.calcularTotal()
    },
    sumarArticulo (articulo, cantidad) {
      let reg = {
        articulo_id: this.articulo.Id,
        articulo_nombre: this.articulo.Nombre,
        aviso_id: this.aviso.id,
        cantidad: cantidad,
        precio: this.articulo.UPC
      }
      this.detallesAlbaran.push(reg)
      this.busca = ''
      this.articulo = {
        Id: '0',
        Nombre: '',
        UPC: ''
      }
      this.buscaId = ''
      this.cantidad = 1
      this.calcularTotal()
    },
    atras () {
      let id = this.aviso.id
      router.push({ name: 'avisoid', params: { id } })
    },
    borrarMaquina (index) {
      this.maquinaselegidas.splice(index, 1)
      this.referencia.splice(index, 1)
    },
    borrarFirmaCliente () {
      this.$refs.signaturePad.clearSignature()
      this.$refs.signaturePad.openSignaturePad()
      this.flagFirmaCliente = true
    },
    borrarFirmaEmpleado () {
      this.$refs.signaturePad2.clearSignature()
      this.$refs.signaturePad2.openSignaturePad()
      this.flagFirmaEmpleado = true
    },
    guardaFirmaCliente () {
      let firma = this.$refs.signaturePad.saveSignature()
      this.firmaCliente = firma.data
      this.$refs.signaturePad.lockSignaturePad()
      this.flagFirmaCliente = false
    },
    guardaFirmaEmpleado () {
      this.firmaEmpleado = this.$refs.signaturePad2.saveSignature().data
      this.$refs.signaturePad2.lockSignaturePad()
      this.flagFirmaEmpleado = false
    },
    veravisos () {
      document.addEventListener('click', function (e) {
        if (this.onblur) this.onFocus = false
      })
      this.datos = JSON.parse(localStorage.getItem('avisos'))
      this.maquinas = JSON.parse(localStorage.getItem('maquinas'))
      this.datos.sort(function (a, b) {
        if (a.fechaPrevista > b.fechaPrevista) {
          return 1
        }
        if (a.fechaPrevista < b.fechaPrevista) {
          return -1
        }
        // a must be equal to b
        return 0
      })
      this.aviso = this.datos.find(element => element.id === this.$route.params.id)
      this.detallesAviso = JSON.parse(localStorage.getItem('detallesaviso' + this.$route.params.id))
      this.detallesAlbaran = this.detallesAviso
      var DBOpenRequest = indexedDB.open('BaseDatos', 1)
      DBOpenRequest.onsuccess = event => {
        const db = DBOpenRequest.result
        const store = db.transaction('Articulos', 'readonly').objectStore('Articulos')
        const query = store.openCursor()
        query.onsuccess = ev => {
          const cursor = ev.target.result
          if (cursor) {
            this.articulos.push(cursor.value)
            cursor.continue()
          } else {
            console.log('¡No hay más registros disponibles!')
          }
        }
      }
      this.calcularTotal()
    },
    iniciaBd () {
      var openRequest = indexedDB.open('BaseDatos,1')
      openRequest.onupgradeneeded = function (e) {
        console.log('running onupgradeneeded')
      }
      openRequest.onsuccess = function (e) {
        console.log('Success!')
        this.db = e.target.result
      }
      openRequest.onerror = function (e) {
        console.log('Error')
        console.dir(e)
      }
    },
    buscarMaquina (cadena) {
      this.listamaquinas = []
      if (cadena !== '') {
        let cad = cadena.slice(0, -1)
        this.listamaquinas = this.maquinas.filter(maquina => maquina.nombre.toLowerCase().includes(cad.toLowerCase()))
      }
    },
    buscarArticulo (cadena) {
      this.listaarticulos = []
      if (cadena) {
        let cad = cadena.slice(0, -1)
        this.listaarticulos = this.articulos.filter(articulo => articulo.Nombre.toLowerCase().includes(cad.toLowerCase()))
      }
    },
    calcularTotal () {
      this.iva = 0
      this.subtotal = 0
      this.total = 0
      this.detallesAviso.forEach(element => {
        this.subtotal += element.precio * element.cantidad
      })
      this.subtotal = Number(this.subtotal.toFixed(2))
      this.iva = this.subtotal * 0.21
      this.iva = Number(this.iva.toFixed(2))
      this.total = this.subtotal + this.iva
      this.total = Number(this.total.toFixed(2))
    },
    // variant = primary secondary las de bootstrap
    makeToast (variant = null, mensaje) {
      this.$bvToast.toast(mensaje, {
        title: '',
        variant: variant,
        solid: true
      })
    },
    guardaAlbaran () {
      let listaMaquinas = []
      this.maquinaselegidas.forEach((maquina, index) => {
        listaMaquinas.push({
          id: maquina.id,
          nombre: maquina.nombre,
          referencia: this.referencia[index]
        })
      })
      var registroAlbaran = {
        aviso_id: this.aviso.id,
        terminada: this.aviso.terminada,
        observaciones: this.observaciones,
        firma_cliente: this.firmaCliente,
        firma_empleado: this.firmaEmpleado,
        listaarticulos: this.detallesAlbaran,
        listamaquinas: listaMaquinas,
        trabajos: this.trabajos
      }
      let alb = []
      alb = JSON.parse(localStorage.getItem('albaranes'))
      alb.push(registroAlbaran)
      localStorage.setItem('albaranes', JSON.stringify(alb))
      router.push({name: 'avisos'})
    }
  }
}
</script>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped>

.container {
    overflow: scroll;
}
h1, h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.linea {
  border: 1px solid #999;
  box-sizing: border-box;
}

.firmas {
  display: flex;
  width: 80%;
  justify-content: space-around;
  flex-wrap: wrap;
  margin: auto;
}
.autocomplete {
    position: relative;
    display: inline-block;
}
.autocomplete-items {
    border: 1px solid#d4d4d4;
    border-bottom: none;
    border-top: none;
    z-index: 99;
    top: 100%;
    max-height: 350px;
    overflow: scroll;
    font-size: small;
    text-align: justify;
}
.autocomplete-items div {
    cursor: pointer;
    background-color: #fff;
    border-bottom: 1px solid #d4d4d4;
    width: 100%;
    background-color: #dfdddd;
    border-radius: 15%;
}
.autocomplete-items div:hover {
    background-color: #a7a0a0;
}
.autocomplete-active {
    background-color: dodgerblue !important;
    color: #000000 !important;
}
.botoncillo{
  float: right;
  border-radius: 50%;
  margin-top: -10px;
}
.yo {
  background-color: rgb(231, 231, 231)
}
</style>
