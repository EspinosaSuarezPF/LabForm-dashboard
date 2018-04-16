import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
    imports: [CommonModule, FormBuilderRoutingModule, PageHeaderModule],
    declarations: [FormBuilderComponent]
})
export class FormBuilderModule {}
