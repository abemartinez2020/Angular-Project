import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SearchAndFilterBarComponent } from './search-and-filter-bar/search-and-filter-bar.component';
import { DataTableComponent } from './data-table/data-table.component';
import { MaterialModule } from '../material/material.module';

const components = [
  NavBarComponent,
  DashboardComponent,
  SearchAndFilterBarComponent,
  DataTableComponent,
];

@NgModule({
  declarations: [components],
  imports: [CommonModule, MaterialModule],
  exports: [components, MaterialModule],
})
export class ComponentsModule {}
