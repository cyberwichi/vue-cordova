<template>
  <div class="hello" >
    <img class="fondo" src="../assets/fondo3.jpg" width="100px" height="100px">
    <img src="../assets/logo.png" width="100px" height="100px" class="mt-3 mb-3">
    <br>
    <b-button v-show="hayAvisos" pill >
      <router-link to="/avisos">Avisos</router-link>
    </b-button>
    <br>
    <br>
    <b-button pill >
      <div class="form-group">
        <label for="codigoEmpleado">Codigo Empleado:</label>
        <input type="text"
          class="form-control text-center" v-model="codigoEmpleado" name="codigoEmpleado" id="codigoEmpleado" aria-describedby="helpId" placeholder="">
        <small id="helpId" class="form-text text-muted">Introduzca por favor su codigo de empleado</small>
      </div>
    </b-button>
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
    <small id="helpId2" class="form-text text-muted">Solo disponible si no hay albaranes pendientes de subir</small>
    <b-alert
      :show="dismissCountDown2"
      dismissible
      fade
      variant="primary"
      @dismiss-count-down="countDownChanged2"
    >
     {{ msg}}
    </b-alert>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: '',
  data () {
    return {
      msg: '',
      name: '',
      dismissSecs: 5,
      dismissCountDown: 0,
      dismissCountDown2: 0,
      detallesAviso: [],
      albaranes: [],
      hayAlbaranes: false,
      hayAvisos: false,
      flagAlbaranes: JSON.parse(localStorage.getItem('albaranes')),
      flagAvisos: JSON.parse(localStorage.getItem('avisos')),
      codigoEmpleado: '',
      disabled: false
    }
  },
  mounted () {
    if (localStorage.name) {
      this.name = localStorage.name
    }
    let aux = JSON.parse(localStorage.getItem('avisos'))
    if (aux === null) {
      this.hayAvisos = false
    } else if (aux.length > 0) {
      this.hayAvisos = true
    } else {
      this.hayAvisos = false
    }
    aux = JSON.parse(localStorage.getItem('albaranes'))
    if (aux.length > 0) {
      this.hayAlbaranes = true
    } else {
      this.hayAlbaranes = false
    }
  },
  watch: {
    name (newName) {
      localStorage.name = newName
    },
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
    countDownChanged2 (dismissCountDown) {
      this.dismissCountDown2 = dismissCountDown
    },
    showAlert () {
      this.dismissCountDown2 = this.dismissSecs
    },
    eliminarDatos () {
      localStorage.clear()
      this.hayAvisos = false
      var req = indexedDB.deleteDatabase('BaseDatos')
      req.onsuccess = () => {
        this.msg = 'Limpieza de basura correcta...'
        this.dismissCountDown2 = this.dismissSecs
      }
      req.onerror = () => {
        this.msg = 'No se puede borrar la Base de Datos'
        console.log('Couldn delete database')
        this.dismissCountDown2 = this.dismissSecs
      }
      req.onblocked = () => {
        this.msg = 'Operacion Bloqueada no se puede borrar la base de Datos.Por Favor REINICIE LA APLICACION Y Descarge los datos directamente.'
        this.dismissCountDown2 = this.dismissSecs
        console.log('Couldn delete database due to the operation being blocked')
      }
    },
    obtenerAvisos () {
      if (this.codigoEmpleado === '') {
        this.msg = 'Por Favor Introduzca su codigo de empleado'
        this.dismissCountDown2 = this.dismissSecs
        return
      }
      this.msg = 'Procesando...Tardaremos un par de segundos...'
      this.dismissCountDown2 = this.dismissSecs
      this.eliminarDatos()
      axios.get('http://parte.eu-west-1.elasticbeanstalk.com/api/avisos/noterminados/empleado/' + this.codigoEmpleado).then(response => {
        if (response.data.length > 0) {
          localStorage.setItem('avisos', JSON.stringify(response.data))
          var data = JSON.parse(localStorage.getItem('avisos'))
          data.forEach(element => {
            axios.get('http://parte.eu-west-1.elasticbeanstalk.com/api/detalles/' + element.id)
              .then(response => {
                localStorage.setItem('detallesaviso' + element.id, JSON.stringify(response.data))
                this.detallesAviso.push(response.data)
              })
          })
          axios.get('http://parte.eu-west-1.elasticbeanstalk.com/api/maquinas').then(response => {
            localStorage.setItem('maquinas', JSON.stringify(response.data))
          })
          axios.get('http://parte.eu-west-1.elasticbeanstalk.com/api/articulos').then(response => {
            var articulos = response.data
            const dbconnect = indexedDB.open('BaseDatos', 1)
            dbconnect.onupgradeneeded = ev => {
              console.log('Actualizar BD')
              this.msg = 'Actualizando Base de Datos'
              this.dismissCountDown2 = this.dismissSecs
              const db = ev.target.result
              const store = db.createObjectStore('Articulos', { keyPath: 'id', autoIncrement: true })
              store.createIndex('Nombre', 'Nombre', { unique: false })
              store.createIndex('Id', 'Id', { unique: true })
            }
            dbconnect.onsuccess = ev => {
              console.log('BD-Actualización exitosa')
              this.msg = 'Actualizacion Correcta \n'
              this.dismissCountDown2 = this.dismissSecs
              const db = ev.target.result
              const transaction = db.transaction('Articulos', 'readwrite')
              const store = transaction.objectStore('Articulos')
              articulos.forEach(el => store.add(el))
              transaction.onerror = ev => {
                console.error('¡Se ha producido un error!', ev.target.error.message)
                this.msg = '¡Se ha producido un error!' + ev.target.error.message
                this.dismissCountDown2 = this.dismissSecs
              }
              transaction.oncomplete = ev => {
                this.msg += '¡Los datos se han añadido con éxito!'
                this.dismissCountDown2 = this.dismissSecs
                console.log('¡Los datos se han añadido con éxito!')
              }
            }
          })
          localStorage.setItem('albaranes', JSON.stringify(this.albaranes))
          this.hayAvisos = true
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
    guardarAlbaranes () {
      let albar = JSON.parse(localStorage.getItem('albaranes'))
      albar.forEach(al => {
        axios.post('http://parte.eu-west-1.elasticbeanstalk.com/api/albaran', al).then(() => {
          this.msg += '¡Los datos se han subido con éxito! \n Buen Trabajo'
          this.dismissCountDown2 = this.dismissSecs
          localStorage.clear()
        })
      })
      this.hayAvisos = false
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
  height: 100%;
  top: 0;
  left: 0;
}
</style>
