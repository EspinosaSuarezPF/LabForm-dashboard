import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestoreModule
} 
from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Entrada{
  id:string,
  formulario:string,
  active:boolean,
  data:object
}

interface Formato{
  id:string,
  nombre:string,
  categoriaId:string,
  active:true,
  version:number,
  _Campos:object
}

@Component({
  selector: 'app-entrada',
  templateUrl: './entrada.component.html',
  styleUrls: ['./entrada.component.scss'],
  animations: [routerTransition()]
})
export class EntradaComponent implements OnInit {

  constructor(private afs:AngularFirestore) { 

  }

  //Declaraciones
  entradaCol:AngularFirestoreCollection<Entrada>;
  entradas:Array<Entrada>=[];
  formatoCol:AngularFirestoreCollection<Formato>;
  formatos:Array<Formato>;
  nombreFormatos:Array<string>=[];
  public opcion:string="";
  cargarEntradaSegunFormato(opcion){
    console.log(opcion);
    this.entradaCol.valueChanges()
    .subscribe(data=>{
      this.entradas=data
      .filter(d=>d.formulario===opcion)
      .sort((a,b)=>{
        if(a.formulario>b.formulario){
          return 1;
        }
        else if(a.formulario<b.formulario){
          return -1;
        }
        else{
          return 0;
        }
      });
    });
  }

  ngOnInit() {
    this.entradaCol=this.afs.collection('Entradas');
    this.formatoCol=this.afs.collection('Formatos');
    this.formatoCol.valueChanges()
    .subscribe(data=>{
      data.forEach(formato=>{
        if(!this.nombreFormatos.includes(formato.nombre)){
          this.nombreFormatos.push(formato.nombre);
        }
      });
      this.nombreFormatos.sort();
    });
  }

}
