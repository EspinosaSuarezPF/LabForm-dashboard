import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule} from '@angular/forms';
import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [
        CommonModule, 
        FormBuilderRoutingModule, 
        PageHeaderModule,
        FormsModule
    ],
    declarations: [FormBuilderComponent]
})
export class FormBuilderModule {}
