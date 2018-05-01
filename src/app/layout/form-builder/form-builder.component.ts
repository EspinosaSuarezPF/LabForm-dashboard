import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {FormBuilder,FormGroup} from '@angular/forms';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
    } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

type optionTypeArray = 
Array<{value:string,text:string}>;

interface Formato{
    name:string;
}

interface Categoria{
    name:string;
}

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html',
    styleUrls: ['./form-builder.component.scss'],
    animations: [routerTransition()]
})

/*export class Campos{
    public name:string;
    public type:string;
}*/

export class FormBuilderComponent implements OnInit {
    categoriaList:Array<{id:string,nombre:string}>;
    version:number
    _Campos:Array<{
        id:string,
        name:string,
        controlType:string,
        value:string|number,
        key:string,
        label:string,
        required:boolean
    }>
    constructor(private afs:AngularFirestore, private fb:FormBuilder) {
        this.createForm();
    }
    
    formatoForm:FormGroup;
    campoForm:FormGroup;

    selectOptions:optionTypeArray;

    categoriaCol:AngularFirestoreCollection<Formato>;
    categorias:Observable<Categoria[]>;

    formatoCol:AngularFirestoreCollection<Formato>;
    formatos:Observable<Formato[]>;

    nameCampo:string;
    message:string;
    
    createForm(){
        this.formatoForm = this.fb.group({
            name:""
        });
        this.campoForm = this.fb.group({
            tipo:"",
            name:"",
            options:""
        });
    }
    AddFormato(){
        this.afs.collection('/formatos').add({'name':this.formatoForm.value.name});
    }

    AddCampo(){

    }

    ngOnInit() {
        this.formatoCol=this.afs.collection('formatos');
        this.formatos=this.formatoCol.valueChanges();
        this.categoriaCol=this.afs.collection("Categoria");
        this.categorias=this.categoriaCol.valueChanges();
        this.message="";
        this._Campos=[];
        this.selectOptions=[
            {value:"none",text:"Seleccion tipo del campo"},
            {value:"string",text:"AlfaNumerico"},
            {value:"number",text:"Numerico"},
            {value:"date",text:"Fecha"},
            {value:"select",text:"DropdownMenu"}
        ]
    }
}
