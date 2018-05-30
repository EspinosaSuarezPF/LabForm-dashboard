import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestoreModule
}
  from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Entrada {
  id: string,
  formulario: string,
  active: boolean,
  consecutivo: string,
  fechaDeCreacion: Date,
  data: Array<{ name: string, value: any }>
}

interface Formulario {
  id: string,
  nombre: string,
  categoriaId: string,
  active: true,
  version: number,
  Campos: Array<object>
}

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.scss'],
  animations: [routerTransition()]
})
export class EntradaComponent implements OnInit {

  constructor(private afs: AngularFirestore) {

  }

  //Declaraciones
  entradaCol: AngularFirestoreCollection<Entrada>;
  entradas: Array<Entrada> = [];
  formularioCol: AngularFirestoreCollection<Formulario>;
  formularios: Array<Formulario>;
  nombreFormularios: Array<string> = [];
  camposEntrada: Array<string> = [];
  public opcionSelect: string = "";

  //Ordena según el consecutivo
  ordenarPorConsecutivo() {
    this.entradas.sort((a, b) => {
      if (a.consecutivo > b.consecutivo) {
        return 1;
      }
      else if (a.consecutivo < b.consecutivo) {
        return -1;
      }
      else {
        return 0;
      }
    });
  }

  //Ordena dependiendo del campo de menor a mayor
  ordenarPorColumna(nombreColumna) {
    this.entradas.sort((a, b) => {
      let ax: { name: string, value: any } = undefined;
      let bx: { name: string, value: any } = undefined;
      if (nombreColumna !== 'fechaDeCreacion') {
        for (let i = 0; i < a.data.length; i++) {
          if (a.data[i].name === nombreColumna) {
            ax = a.data[i];
            break;
          }
        }
        for (let i = 0; i < b.data.length; i++) {
          if (b.data[i].name === nombreColumna) {
            bx = b.data[i];
            break;
          }
        }
      } else {
        ax = { name: 'fechaDeCreacion', value: a.fechaDeCreacion };
        bx = { name: 'fechaDeCreacion', value: b.fechaDeCreacion };
      }
      if (ax.value > bx.value) {
        return 1;
      }
      else if (ax.value < bx.value) {
        return -1;
      }
      else {
        return 0;
      }
    })
  }

  cargarEntradaSegunFormulario(opcion) {
    //Carga entrada dependiendo del formulario escogido
    this.entradaCol.valueChanges()
      .subscribe(data => {
        this.entradas = data
          .filter(d => d.formulario === opcion)
          .sort((a, b) => {
            if (a.formulario > b.formulario) {
              return 1;
            }
            else if (a.formulario < b.formulario) {
              return -1;
            }
            else {
              return 0;
            }
          });
        this.camposEntrada.length = 0;
        if (this.entradas.length !== 0) {
          let entradaDefault = this.entradas.pop();
          entradaDefault.data.forEach(campo => {
            if (!this.camposEntrada.includes(campo.name)) {
              this.camposEntrada.push(campo.name);
            }
          });
          this.entradas.push(entradaDefault);
        }
      });
  }

  ngOnInit() {
    this.entradaCol = this.afs.collection('Entradas');
    this.formularioCol = this.afs.collection('Formularios');
    //Obtencion de nombre de formularios
    this.formularioCol.valueChanges()
      .subscribe(data => {
        data.forEach(formulario => {
          if (!this.nombreFormularios.includes(formulario.nombre)) {
            this.nombreFormularios.push(formulario.nombre);
          }
        });
        this.nombreFormularios.sort();
      });
  }

  boolOrValue(value: any) {
    if(typeof(value) == "boolean") {
      return value ? "Cumple" : "No Cumple";
    } else {
      return value;
    }
  }

  uncamelize(text, separator = "_") {
    return text.replace(/[A-Z]/g, (letter) => separator + letter.toLowerCase())
      .replace("/^" + separator + "/", '');
  }

}
