  import { Injectable } from '@angular/core';
  import { HttpClient, HttpParams } from '@angular/common/http';
  import { Observable, catchError, map, throwError } from 'rxjs';
  @Injectable({
    providedIn: 'root',
  })
  export class SharedService {
    readonly APIUrl = 'http://localhost:5000/api';
    // readonly Url = 'https://localhost:7203/swagger/index.html';
    readonly PhotoUrl = 'http://localhost:5000/NewFolder2/';
    GetRolle: any;
    constructor(private http: HttpClient) {}
    getDepList(): Observable<any[]> {
      return this.http.get<any>(this.APIUrl + '/department');
    }
    addDepartment(val: any) {
      return this.http.post(this.APIUrl + '/Department', val);
    }
    updateDepartment(val: any) {
      return this.http.put(this.APIUrl + '/Department', val);
    }
    deleteDepartment(val: any) {
      return this.http.delete(this.APIUrl + '/Department/' + val);
    }

    getEmpList(): Observable<any[]> {
      return this.http.get<any>(this.APIUrl + '/Employee');
    }
    addEmployee(val: any) {
      return this.http.post(this.APIUrl + '/Employee', val);
    }
    updateEmployee(val: any) {
      return this.http.put(this.APIUrl + '/Employee', val);
    }
    deleteEmployee(val: any) {
      return this.http.delete(this.APIUrl + '/Employee/' + val);
    }

    UploadPhoto(val: any) {
      return this.http.post(this.APIUrl + '/Employee/SaveFile', val);
    }

    getAllDepartmentNames(): Observable<any[]> {
      return this.http.get<any[]>(
        this.APIUrl +
          'https://localhost:7203/api/UserManagement/GetRoles?pageNumber=1&pageSize=10'
      );
    }

    //----------------------------Role ---------------------------------------
   
 getRoles(pageNumber: number, pageSize: number, search: string): Observable<any> {
  let params = new HttpParams()
    .set('pageNumber', pageNumber.toString())
    .set('pageSize', pageSize.toString())
    .set('search', search);

  return this.http.get(`https://localhost:7203/api/UserManagement/GetRoles`, { params });
}
addRole(role: any): Observable<any> {
  return this.http.post(`https://localhost:7203/api/UserManagement/AddRole`, role);
}

updateRole(role: any): Observable<any> {
  return this.http.post(`https://localhost:7203/api/UserManagement/UpdateRole`, role);
}
updateRoleStatus(role: any): Observable<any> {
  return this.http.post(`https://localhost:7203/api/UserManagement/UpdateRoleStatus`, role);
}
getPermissions(): Observable<any> {
  return this.http.get(`https://localhost:7203/api/UserManagement/GetPermissions`);
}

getAssignedPermissions(roleId: number): Observable<any> {
  let params = new HttpParams().set('RoleId', roleId.toString());

  return this.http.get(`https://localhost:7203/api/UserManagement/GetAssignedPermissions`, { params });
}
    //----------------------------User ---------------------------------------
    GetUsers(): Observable<any> {
      return this.http.get<any>(
        'https://localhost:7203/api/UserManagement/GetUsers?pageNumber=1&pageSize=50'
      );
    }
    GetAllDepartments(dep: any): Observable<any> {
      return this.http.get<any>(
        'https://localhost:7203/api/UserManagement/GetAllDepartments?pageNumber=1&pageSize=100',
        dep
      );
    }
    GetAllDesignations(): Observable<any> {
      return this.http.get<any>(
        'https://localhost:7203/api/UserManagement/GetAlldesignations?pageNumber=1&pageSize=100'
      );
    }

    AddUser(user: any): Observable<any> {
      return this.http.post<any>(
        'https://localhost:7203/api/UserManagement/AddUser',
        user
      );
    }

    UpdateUser(user: any): Observable<any> {
      return this.http.post<any>(
        'https://localhost:7203/api/UserManagement/UpdateUser',
        user
      );
    }
    updateDepartments(user: any): Observable<any> {
      return this.http.post<any>(
        'https://localhost:7203/api/UserManagement/UpdateDepartments',
        user
      );
    }
  

    updateDesignation(user: any): Observable<any> {
      return this.http.post<any>(
        'https://localhost:7203/api/UserManagement/UpdateDesignation',
        user
      );
    }

    DeleteUser(user: any): Observable<any> {
      return this.http.post<any>(
        'https://localhost:7203/api/UserManagement/UpdateUserStatus',
        user
      );
    }
    
  }
