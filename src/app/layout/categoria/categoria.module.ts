import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';

import { CategoriaRoutingModule }from './categoria-routing.module';
import { CategoriaComponent } from './categoria.component';
import { PageHeaderModule } from './../../shared';

@NgModule({
  imports: [
    CommonModule,
    CategoriaRoutingModule,
    PageHeaderModule,
    ReactiveFormsModule
  ],
  declarations: [CategoriaComponent]
})
export class CategoriaModule { }
