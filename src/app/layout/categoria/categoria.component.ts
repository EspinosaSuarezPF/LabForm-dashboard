import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';

import {
  AngularFirestore,
  AngularFirestoreCollection,
  AngularFirestoreDocument,
  AngularFirestoreModule
} 
from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Categoria{
  nombre:string
}

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss']
})
export class CategoriaComponent implements OnInit {

  constructor(private afs:AngularFirestore, private fb:FormBuilder) { 
    this.createForm();
  }
  //Declaraciones
  categoriaForm:FormGroup
  categoriaCol:AngularFirestoreCollection<Categoria>;
  categorias:Observable<Categoria[]>;

  createCategoria(){
    this.categoriaCol.add({'nombre':this.categoriaForm.value.nombre});
  }

  updateCategoria(categoriaId,data){
    let doc=this.categoriaCol.doc(categoriaId);
    doc.update(data);
  }

  findCategoriaByName(name){
    let doc=this.categoriaCol.ref.where("nombre","==",name);
    return doc;
  }

  deleteCategoria(categoriaId){
    let doc=this.categoriaCol.doc(categoriaId);
    doc.delete();
  }

  createForm(){
    this.categoriaForm = this.fb.group({
      nombre:""
    });
  }

  ngOnInit() {
    this.categoriaCol=this.afs.collection('Categorias');
    this.categorias=this.categoriaCol.valueChanges();
  }

}
