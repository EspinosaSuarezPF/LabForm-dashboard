import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { FormBuilder,FormGroup } from '@angular/forms';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
    } from 'angularfire2/firestore';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { Campo } from '../../shared/models/campo'

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html',
    styleUrls: ['./form-builder.component.scss'],
    animations: [routerTransition()]
})

export class FormBuilderComponent implements OnInit {
    tipoNuevoCampo: string;
    formatoForm: any;
    formulariosColl: any;
    tiposCampo: Array<any>;
    /* categorias: Array<any> = [
        {id: 0, nombre: 'primera categoria'},
        {id: 1, nombre: 'segunda categoria'},
        {id: 2, nombre: 'tercera categoria'},
    ]; */
    categorias: Array<any>;    
    Campos: Array<any>;

    constructor(private afs:AngularFirestore, private fb:FormBuilder) {
        this.buildFormatoForm();
        this.Campos = [
            new Campo(),
        ];
    }

    private buildFormatoForm() {
        this.formatoForm = this.fb.group({
            nombre: "",
            categoriaId: -1,
        });
    }
    
    /* formatoForm:FormGroup;
    campoForm:FormGroup;

    selectOptions:optionTypeArray;

    categoriaCol:AngularFirestoreCollection<Formato>;
    categorias:Observable<Categoria[]>;

    formatoCol:AngularFirestoreCollection<Formato>;
    formatos:Observable<Formato[]>;

    nameCampo:string;
    message:string;
    
    AddFormato(){
        this.afs.collection('/formatos').add({'name':this.formatoForm.value.name});
    }

    AddCampo(){

    } */

    ngOnInit() {
        this.formulariosColl = this.afs.collection('Formularios');
        this.afs.collection("Categorias")
            .valueChanges()
            .subscribe(
                categoria => this.categorias.push(categoria)
            );
        this.tiposCampo = [
            /* { value: "string", text: "AlfaNumerico" },
            { value: "number", text: "Numerico" },
            { value: "date", text: "Fecha" },
            { value: "select", text: "DropdownMenu "} */
            { value: "checkbox", text: "Dicotomico (si/no)" },
            { value: "dropdown", text: "Selección múltiple" },
            { value: "textbox", text: "Alfanumérico" },
        ]
    }
}

/** Comentarios
 * 
 * Al crear los formularios, debe colocarseles versión 1
 * 
 * los key de campo y de opcion deben ser calculados (pueden sacarse del nombre, usando camelcase)
 */