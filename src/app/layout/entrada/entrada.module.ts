import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EntradaRoutingModule }from './entrada-routing.module';
import { PageHeaderModule } from './../../shared';
import { EntradaComponent } from './entrada.component';

@NgModule({
  imports: [
    CommonModule,
    EntradaRoutingModule,
    PageHeaderModule
  ],
  declarations: [EntradaComponent]
})
export class EntradaModule { }
