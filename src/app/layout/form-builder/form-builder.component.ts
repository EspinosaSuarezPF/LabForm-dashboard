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

    formularios: Array<any>;

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
            { value: "textbox", text: "Texto" },
            { value: "date", text: "Fecha/hora" },
        ]


        this.formulariosColl.valueChanges()
            .subscribe(
                formularios => {
                    this.formularios = formularios;
                }
            );
    }

    fetchForm(formulario: any) {
        console.log(formulario);
        this.formatoForm = this.fb.group(formulario);

    }

    agregarNuevoCampo(tipoNuevoCampo) {
        let formsCampos = this.formatoForm.get('Campos') as FormArray;
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
                formCtrlsCampo['value'] = new FormControl('');
                break;
            case 'textbox':
                formCtrlsCampo['controlType'] = 'textbox';
                formCtrlsCampo['value'] = new FormControl('', Validators.required);
                formCtrlsCampo['type'] = new FormControl('', Validators.required);
                break;
            case 'date':
                formCtrlsCampo['controlType'] = 'date';
                formCtrlsCampo['format'] = new FormControl('', Validators.required);
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

    eliminarCampo(index: number) {
        let formsCampos = this.formatoForm.get('Campos') as FormArray;
        formsCampos.removeAt(index);
    }

    eliminarOpcion(campo: AbstractControl, index: number) {
        let formsCampos = campo.get('options') as FormArray;
        formsCampos.removeAt(index);
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
                    formInfo.Campos = this.agregarIdKeyCampos(formInfo);
                    Object.assign(formInfo, basicProps);
                    this.formulariosColl.doc(id)
                        .set(formInfo)
                        .then(
                            response => {
                                window.alert("Formulario creado");
                                formGroupFormato.reset();
                                this.buildFormatoForm();
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

    validForm() {
        let formatoFormGroup = this.formatoForm as FormGroup;
        let campos = formatoFormGroup.get('Campos') as FormArray;
        let selectsWithOptions: boolean = true;
        let nonEmptyCampos: boolean = false;
        if(campos.controls){
            nonEmptyCampos = (campos.controls.length > 0);
            campos.controls.forEach(campo => {
                if(campo.get('options')) {
                    let options = campo.get('options') as FormArray;
                    selectsWithOptions = selectsWithOptions && (options.controls.length > 0);
                }
            });
        }
        let valid: boolean = (
            formatoFormGroup.valid && // todos los campos requeridos llenos
            nonEmptyCampos && // haya al menos 1 campo
            selectsWithOptions // no hayan select-options sin opciones de respuesta
        );
        return valid;
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