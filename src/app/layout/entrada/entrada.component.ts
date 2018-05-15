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
  entradas:Array<Entrada>;

  ngOnInit() {
    this.entradaCol=this.afs.collection('Entradas');
    this.entradaCol.valueChanges()
    .subscribe(data=>{
      this.entradas=data.sort();
    });
  }

}
