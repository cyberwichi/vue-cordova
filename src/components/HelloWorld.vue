<template>
  <div class="hello" >
    <img class="fondo" src="../assets/fondo3.jpg" width="100px" height="100px">
    <img src="../assets/logo.png" width="100px" height="100px" class="mt-3 mb-3 mx-auto">
    <br>
    <b-button v-show="hayAvisos" pill >
      <router-link to="/avisos">Avisos</router-link>
    </b-button>
    <br>
    <br>
    <br>
    <br>
     <b-button :disabled="hayAvisos ? '': disabled" pill v-on:click="obtenerAvisos">
       Descargar Avisos
    </b-button>
    <br>
    <br>
      <b-button :disabled="hayAlbaranes ? disabled: '' " pill v-on:click="guardarAlbaranes">
       Subir Albaranes
    </b-button>
    <br>
    <br>
      <b-button aria-describedby="helpId2" :disabled="!hayAvisos || hayAlbaranes ? '': disabled " pill v-on:click="eliminarDatos">
       Eliminar Datos Descargados
    </b-button>
    <small id="helpId2" class="form-text text-muted">Solo disponible si no hay partes de trabajo pendientes de subir</small>
    <b-alert
      :show="dismissCountDown2"
      dismissible
      fade
      variant="primary"
      @dismiss-count-down="countDownChanged2"
    >
     {{ msg}}
    </b-alert>
    <div class="bottom">
        <label for="name">Server Ip</label>
        <input type="text"
          class="form-control text-center" v-model="name" name="name" id="name" aria-describedby="helpI2" placeholder="">
        <small id="helpId2" class="form-text text-muted">Introduzca la direccion del servidor</small>
        <label class="mt-1" for="codigoEmpleado">Codigo Empleado:</label>
        <input type="text"
          class="form-control text-center" v-model="codigoEmpleado" name="codigoEmpleado" id="codigoEmpleado" aria-describedby="helpId" placeholder="">
        <small id="helpId" class="form-text text-muted">Introduzca por favor su codigo de empleado</small>
        <b-button class="mt-2" pill v-on:click="guardarName">
          Guardar
        </b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      msg: '',
      name: '',
      dismissSecs: 50,
      dismissSecs2: 50,
      dismissCountDown: 0,
      dismissCountDown2: 0,
      detallesAviso: [],
      albaranes: [],
      hayAlbaranes: false,
      hayAvisos: false,
      flagAlbaranes: JSON.parse(localStorage.getItem('albaranes')),
      flagAvisos: JSON.parse(localStorage.getItem('avisos')),
      codigoEmpleado: '',
      disabled: false,
      aux2: '',
      albar: {}
    }
  },
  mounted () {
    this.name = localStorage.getItem('name')
    this.codigoEmpleado = localStorage.getItem('name2')
    let aux = JSON.parse(localStorage.getItem('avisos'))
    if (aux === null) {
      this.hayAvisos = false
    } else {
      this.hayAvisos = true
    }
    if (localStorage.getItem('albaranes')) {
      this.aux2 = JSON.parse(localStorage.getItem('albaranes'))
      if (this.aux2.length > 0) {
        this.hayAlbaranes = true
      } else {
        this.hayAlbaranes = false
      }
    } else {
      this.hayAlbaranes = false
    }
    if (this.hayAlbaranes === false && this.hayAvisos === false) {
      this.obtenerAvisos()
    }
  },
  watch: {
    flagAlbaranes () {
      if (this.flagAlbaranes.length > 0) {
        this.hayAlbaranes = true
      } else {
        this.hayAlbaranes = false
      }
    },
    flagAvisos () {
      if (this.flagAvisos.length > 0) {
        this.hayAvisos = false
      } else {
        this.hayAvisos = false
      }
    }
  },
  methods: {
    cerrar () {
      var ventana = window.self
      ventana.opener = window.self
      ventana.close()
    },
    guardarName () {
      localStorage.setItem('name', this.name)
      localStorage.setItem('name2', this.codigoEmpleado)
      this.msg = 'Configuracion guardada'
      this.dismissCountDown2 = 5
    },
    countDownChanged2 (dismissCountDown) {
      this.dismissCountDown2 = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown2 = this.dismissSecs
    },
    eliminarDatos () {
      this.msg += 'Limpiando datos antiguos...\n'
      this.dismissCountDown2 = 5
      this.name = localStorage.getItem('name')
      this.codigoEmpleado = localStorage.getItem('name2')
      this.limpia()
      this.hayAvisos = false
      var req = indexedDB.deleteDatabase('BaseDatos')
      req.onsuccess = () => {
        this.msg = 'Limpieza de basura correcta...\n' + this.msg
      }
      req.onerror = () => {
        location.reload()
      }
      req.onblocked = () => {
        location.reload()
      }
    },
    obtenerAvisos () {
      if (this.codigoEmpleado === '') {
        this.msg = 'Por Favor Introduzca su codigo de empleado'
        this.dismissCountDown2 = 5
        return
      }
      this.eliminarDatos()
      this.msg = 'Actualizando Datos...No interrumpa el proceso \r'
      this.dismissCountDown2 = 2000
      axios.get('http://' + this.name + '/api/avisos/noterminados/empleado/' + this.codigoEmpleado).then(response => {
        if (response.data.length > 0) {
          localStorage.setItem('avisos', JSON.stringify(response.data))
          var data = JSON.parse(localStorage.getItem('avisos'))
          data.forEach(element => {
            axios.get('http://' + this.name + '/api/detalles/' + element.id)
              .then(response => {
                localStorage.setItem('detallesaviso' + element.id, JSON.stringify(response.data))
                this.detallesAviso.push(response.data)
              })
          })
          axios.get('http://' + this.name + '/api/maquinas').then(response => {
            localStorage.setItem('maquinas', JSON.stringify(response.data))
          })
          axios.get('http://' + this.name + '/api/articulos').then(response => {
            var articulos = response.data
            const dbconnect = indexedDB.open('BaseDatos', 1)
            dbconnect.onupgradeneeded = ev => {
              console.log('Actualizar BD')
              this.msg = 'Actualizando Base de Datos \r'
              this.dismissCountDown2 = this.dismissSecs2
              const db = ev.target.result
              const store = db.createObjectStore('Articulos', { keyPath: 'id', autoIncrement: true })
              store.createIndex('Nombre', 'Nombre', { unique: false })
              store.createIndex('Id', 'Id', { unique: true })
            }
            dbconnect.onsuccess = ev => {
              this.msg = 'Actualizacion Correcta \n'
              this.dismissCountDown2 = this.dismissSecs
              const db = ev.target.result
              const transaction = db.transaction('Articulos', 'readwrite')
              const store = transaction.objectStore('Articulos')
              articulos.forEach(el => store.add(el))
              transaction.onerror = ev => {
                this.msg = '¡Se ha producido un error!' + ev.target.error.message
                this.dismissCountDown2 = 5
              }
              transaction.oncomplete = ev => {
                this.msg += '¡Los datos se han añadido con éxito! \r Ahora puede acceder a sus avisos'
                this.dismissCountDown2 = 5
                this.hayAvisos = true
              }
            }
          })
          localStorage.setItem('albaranes', JSON.stringify(this.albaranes))
        } else {
          alert('EMPLEADO NO ENCONTRADO O SIN AVISOS')
        }
        this.codigoEmpleado = ''
      })
        .catch()
    },
    countDownChanged (dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },
    limpia () {
      this.name = localStorage.getItem('name')
      this.codigoEmpleado = localStorage.getItem('name2')
      localStorage.clear()
      localStorage.setItem('name', this.name)
      localStorage.setItem('name2', this.codigoEmpleado)
    },
    guardarAlbaranes () {
      this.msg += 'Subiendo Albaranes \n No interrumpa la operacion'
      this.dismissCountDown2 = 150
      this.albar = JSON.parse(localStorage.getItem('albaranes'))
      this.albar.forEach(al => {
        axios.post('http://' + this.name + '/api/albaran', al).then(response => {
          console.log(response.data)
        })
      })
      this.msg += '¡Los datos se han subido con éxito! \n Buen Trabajo'
      this.dismissCountDown2 = 5
      this.name = localStorage.getItem('name')
      this.codigoEmpleado = localStorage.getItem('name2')
      this.limpia()
      this.obtenerAvisos()
      this.hayAlbaranes = false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
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
.fondo {
  position: absolute;
  z-index: -1;
  width: 100%;
  height: 99ch;
  top: 0;
  left: 0;
  bottom: 0;
}
.bottom{
  margin:10px auto 0 auto;
  background-color: rgba(54, 13, 190, 0.952);
  color:blanchedalmond;
  padding: 15px;
  width: 90%;
  border-radius: 20%;
}
button{
  background-color: rgba(54, 13, 190, 0.952);
  color:blanchedalmond;
}
</style>
