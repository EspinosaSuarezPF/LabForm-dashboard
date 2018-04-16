import { Component, OnInit } from '@angular/core';
import { routerTransition } from '../../router.animations';

@Component({
    selector: 'app-form-builder',
    templateUrl: './form-builder.component.html',
    styleUrls: ['./form-builder.component.scss'],
    animations: [routerTransition()]
})
export class FormBuilderComponent implements OnInit {
    constructor() {}

    ngOnInit() {}
}
