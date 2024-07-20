import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeComponent } from './employee/employee.component';
import { DepartmentComponent } from './department/department.component';
import { HeaderComponent } from './header/header.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserComponent } from './sidebar/user/user.component';
import { RollComponent } from './sidebar/roll/roll.component';
const routes: Routes = [
  {path:'employee',component:EmployeeComponent},
  {path:'department',component:DepartmentComponent},
  {path:'header',component:HeaderComponent},
  {path:'sidebar',component:SidebarComponent},
  {path:'user',component:UserComponent},
  {path:'roll',component:RollComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
