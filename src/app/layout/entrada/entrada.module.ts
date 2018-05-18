import { NgModule } from '@angular/core';
import {FormsModule} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EntradaRoutingModule }from './entrada-routing.module';
import { PageHeaderModule } from './../../shared';
import { EntradaComponent } from './entrada.component';

@NgModule({
  imports: [
    CommonModule,
    EntradaRoutingModule,
    PageHeaderModule, 
    FormsModule
  ],
  declarations: [EntradaComponent]
})
export class EntradaModule { }
