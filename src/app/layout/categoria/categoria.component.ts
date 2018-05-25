import { Component, OnInit } from '@angular/core';
import {FormBuilder,FormGroup} from '@angular/forms';
import {CategoriaService} from './../../shared/services/categoria/categoria.service';
import { routerTransition } from '../../router.animations';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


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
  id:string,
  nombre:string,
  active:boolean
}

@Component({
  selector: 'app-categoria',
  templateUrl: './categoria.component.html',
  styleUrls: ['./categoria.component.scss'],
  animations: [routerTransition()]
})
export class CategoriaComponent implements OnInit {

  constructor(private modalService: NgbModal,private afs:AngularFirestore, private fb:FormBuilder) { 
    this.createForm();
  }
  //Declaraciones
  categoriaForm:FormGroup
  updateForm:FormGroup
  categoriaCol:AngularFirestoreCollection<Categoria>;
  categorias:Array<Categoria>;
  message:string;

  open(content) {
    this.modalService.open(content)
  }
  
  createCategoria(){
    if(this.categoriaForm.value.nombre=="" || this.categoriaForm.value.nombre==null){
      this.categoriaForm.reset();
      this.createForm();
      this.message="El nombre de la categoria no puede estar vacía";
    }
    else{
      let doc=this.categoriaCol
      .ref.where("nombre","==",this.categoriaForm.value.nombre)
      .get().then(QuerySnapshot=>{
        if(QuerySnapshot.empty){
          let id=this.afs.createId();
          this.categoriaCol.doc(id).set(
            {
              'id':id,
              'nombre':this.categoriaForm.value.nombre,
              'active':true
            })
          .then(()=>{
            this.message="Categoria creada"
            this.categoriaForm.reset();
            this.createForm();
          });
        }
        else{
          this.message="La categoria ya existe";
        }
      });
    }
  }

  updateCategoria(categoriaId){
    //Traer el modulo de armar formularios
    /*Verificar que la categoria no tenga
    ningún formato asociado .then()
    */
    let doc=this.categoriaCol.doc(categoriaId);
    //doc.update(data);
  }

  findCategoriaByName(name){
    this.categoriaCol.ref.where("nombre","==",name).get()
    .then(QuerySnapshot=>{
      if(!QuerySnapshot.empty){
          QuerySnapshot.forEach(doc=>{
            console.log(doc.data());
          });
      }
      else{
        console.log("No se encontro el documento");
      }
    });
  }

  activateCategoria(categoriaId,categoriaActive){
    this.categoriaCol.doc(categoriaId).update({active:!categoriaActive});
  }

  createForm(){
    this.categoriaForm = this.fb.group({
      nombre:""
    });
  }

  updateFormOpen(data){
    this.updateForm = this.fb.group({
      nombre:data.nombre
    });
  }

  ngOnInit() {
    this.categoriaCol=this.afs.collection('Categorias');
    this.categoriaCol.valueChanges()
    .subscribe(data=>{this.categorias=data.sort()});
    this.message="";
  }

}
