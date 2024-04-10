import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './modules/dashboard/dashboard.component';
import { ConnectionRequestComponent } from './modules/connection-request/connection-request.component';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';

import { CommonModule } from '@angular/common';
import { EditRequestComponent } from './modules/connection-request/edit-request/edit-request.component';
import { AgGridModule } from 'ag-grid-angular';
import { HttpClientModule } from '@angular/common/http';


@NgModule({
  schemas: [NO_ERRORS_SCHEMA],

  declarations: [
    AppComponent,
    DashboardComponent,
    ConnectionRequestComponent,
    EditRequestComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgxChartsModule,
    BrowserAnimationsModule,
    FormsModule,
    CommonModule,
    AgGridModule,
    NgMultiSelectDropDownModule.forRoot(),
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
