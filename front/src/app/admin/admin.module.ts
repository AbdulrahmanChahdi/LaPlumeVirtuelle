import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AdminRoutingModule } from './admin-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminLayoutComponent } from './admin-layout/admin-layout.component';
import { AuthService } from './services/auth.service';
import { AdminService } from './services/admin.service';

@NgModule({
  declarations: [
    AdminLayoutComponent,
    DashboardComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AdminRoutingModule
  ],
  providers: [
    AuthService,
    AdminService
  ]
})
export class AdminModule { }
