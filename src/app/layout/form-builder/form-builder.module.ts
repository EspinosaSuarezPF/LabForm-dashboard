import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormBuilderRoutingModule } from './form-builder-routing.module';
import { FormBuilderComponent } from './form-builder.component';

@NgModule({
    imports: [CommonModule, FormBuilderRoutingModule],
    declarations: [FormBuilderComponent]
})
export class FormBuilderModule {}
