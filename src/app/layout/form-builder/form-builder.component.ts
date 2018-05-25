import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';
import { FormBuilder, FormGroup, FormControl, FormArray, AbstractControl, Validators } from '@angular/forms';
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
    tipoNuevoCampo: any;
    message: string;
    formatoForm: any;
    formulariosColl: any;
    tiposCampo: Array<any>;
    categorias: Array<any>;

    constructor(private afs: AngularFirestore, private fb: FormBuilder) {
        this.buildFormatoForm();
        this.message = "";
        this.categorias = new Array<any>();
    }

    private buildFormatoForm() {
        this.formatoForm = this.fb.group({
            nombre: "",
            categoriaId: -1,
            Campos: this.fb.array(
                new Array<AbstractControl>()
            )
        });
    }

    ngOnInit() {
        this.formulariosColl = this.afs.collection('Formularios');
        this.afs.collection("Categorias")
            .valueChanges()
            .subscribe(
                categorias => {
                    categorias.forEach(categoria => {
                        this.categorias.push(categoria);
                    });
                }
            );

        this.tiposCampo = [
            { value: "checkbox", text: "Dicotomico (si/no)" },
            { value: "dropdown", text: "Selección múltiple" },
            { value: "textbox", text: "Alfanumérico" },
        ]
    }

    agregarNuevoCampo(tipoNuevoCampo) {
        let formsCampos = this.formatoForm.get('Campos');
        let formCtrlsCampo = {};
        /* switch para tipos de campos */
        switch (tipoNuevoCampo) {
            case 'checkbox':
                formCtrlsCampo['controlType'] = 'checkbox';
                formCtrlsCampo['value'] = new FormControl(false, Validators.required); // especifico
                break;
            case 'dropdown':
                formCtrlsCampo['controlType'] = 'dropdown';
                formCtrlsCampo['options'] = new FormArray( new Array<AbstractControl>() );
                formCtrlsCampo['value'] = new FormControl('', Validators.required);
                break;
            case 'textbox':
                formCtrlsCampo['controlType'] = 'textbox';
                formCtrlsCampo['value'] = new FormControl('', Validators.required);
                break;
            default:
                return;
        }
        // Agrega codigo general para los campos
        Object.assign(formCtrlsCampo, {
            name: new FormControl('', Validators.required),
            label: new FormControl('', Validators.required),
            required: new FormControl(false, Validators.required),
            order: new FormControl(0, Validators.required),
        });
        formsCampos.push(
            this.fb.group(formCtrlsCampo),
        );
    }

    crearFormulario() {
        /* codigo para creacion de formulario */
        let formGroupFormato = this.formatoForm as FormGroup;
        let formInfo = formGroupFormato.value;
        formGroupFormato.disable(); // evita modificar el formulario hasta que se guarde o se de un error
        let doc = this.formulariosColl.ref
            .where("nombre", "==", formInfo.nombre) // se valida que el nombre del formulario sea unico
            .get()
            .then(QuerySnapshot => {
                if (QuerySnapshot.empty) {
                    let id = this.afs.createId();
                    let basicProps = {
                        id: id,
                        active: true,
                        version: 1
                    } // estos valores son iniciales y obligatorios para todos los formularios
                    Object.assign(formInfo, basicProps);
                    this.formulariosColl.doc(id)
                        .set(formInfo)
                        .then(
                            response => {
                                window.alert("Formulario creado");
                                formGroupFormato.reset();
                                this.crearFormulario();
                                formGroupFormato.enable();
                            },
                            error => console.log(error)
                        );
                }
                else {
                    window.alert("Ya existe un formulario con el mismo nombre");
                    formGroupFormato.enable();
                }
            });
    }

    agregarOption(options) {
        options.push(
            this.fb.group({
                key: '',
                value: ''
            },Validators.required)
        );
    }

    agregarIdKeyCampos(formInfo) {
        console.log(formInfo);
        return formInfo.Campos.map(
            campo => {
                let uuid = this.camelize(campo.name);
                return Object.assign(campo, {
                    id: uuid,
                    key: uuid
                });
            }
        );
    }

    camelize(str) {
        return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function (letter, index) {
            return index == 0 ? letter.toLowerCase() : letter.toUpperCase();
        }).replace(/\s+/g, '');
    }
}

/** Comentarios
 * 
 * Al crear los formularios, debe colocarseles versión 1
 * 
 * los key de campo y de opcion deben ser calculados (pueden sacarse del nombre, usando camelcase)
 */