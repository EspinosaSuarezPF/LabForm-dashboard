import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { FormBuilderComponent } from './form-builder.component';

const routes: Routes = [
    {
        path: '',
        component: FormBuilderComponent
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        FormsModule
    ],
    exports: [RouterModule]
})

export class FormBuilderRoutingModule {}
