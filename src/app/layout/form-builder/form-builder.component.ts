import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import {
    AngularFirestore,
    AngularFirestoreCollection,
    AngularFirestoreDocument
    } from 'angularfire2/firestore';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';

interface Formato{
    name:string;
}

interface Seccion{
    name:string;
}

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html',
    styleUrls: ['./form-builder.component.scss'],
    animations: [routerTransition()]
})


export class FormBuilderComponent implements OnInit {
    constructor(private afs:AngularFirestore) {}
    seccionCol:AngularFirestoreCollection<Seccion>;
    secciones:Observable<Seccion[]>;
    formatoCol:AngularFirestoreCollection<Formato>;
    formatos:Observable<Formato[]>;
    nameCampo:string;
    _Campos:string;
    message:string;
    tipoCampoSelected:string;
    AddFormato(){
        if(this.nameCampo=="" || this.nameCampo==null || this.nameCampo==undefined){
            console.log("Fallo");
            
        }
        else{
            this.afs.collection('/formatos').add({'name':this.nameCampo});
        }
    }

    AddCampo(){
        let tag="<p>hola</p>";
        this._Campos+=tag;
        document.getElementById("_Campos").innerHTML= this._Campos;
        console.log(this.tipoCampoSelected);
    }

    AddSeccion(){
        if(this.nameCampo=="" || this.nameCampo==null || this.nameCampo==undefined){
            console.log("Fallo");
            
        }
        else{
            if(!this.afs.collection('/secciones').ref.where('name','==',this.nameCampo)){
                this.afs.collection('/secciones').add({'name':this.nameCampo});
            }
        }
    }

    ngOnInit() {
        this.formatoCol=this.afs.collection('formatos');
        this.formatos=this.formatoCol.valueChanges();
        this.seccionCol=this.afs.collection('secciones');
        this.secciones=this.seccionCol.valueChanges();
        this.message="";
        this._Campos="";
    }
}
