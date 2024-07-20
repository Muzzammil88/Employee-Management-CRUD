
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';

interface Permission {
  id: number;
  name: string;
  parentId: number;
  checked: boolean; 
  c: boolean;
  r: boolean;
  u: boolean;
  d: boolean;
}

interface AssignedPermission {
  id: number;
  name: string;
  parentId: number;
  checked: boolean;
  c: boolean; 
    r: boolean; 
    u: boolean; 
    d: boolean;
}

@Component({
  selector: 'app-roll',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.css'],
})
export class RollComponent implements OnInit, AfterViewInit {
 
  closeButton: any;

  ngAfterViewInit(): void {
  }
  roles: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 100;
  search: string = '';

  selectAll: boolean = false;
  userListChecked: boolean = false;
  roleListChecked: boolean = false;
  createChecked: boolean = false;
  readChecked: boolean = false;
  updateChecked: boolean = false;
  deleteChecked: boolean = false;
  permissions: Permission []= [];

  toggleAllPermissions(event: any) {
    this.selectAll = event.target.checked;
    this.createChecked = this.selectAll;
    this.readChecked = this.selectAll;
    this.updateChecked = this.selectAll;
    this.deleteChecked = this.selectAll;
  }

  toggleParentPermission(event: any, permission: any) {
    debugger;
    if (permission.checked) {
        permission.c = true;
        permission.r = true;
        permission.u = true;
        permission.d = true;

        if (permission.checked) {
             permission.r = true;
        } else if (!permission.checked) {
            permission.r = false;
        }
        this.checkChildPermissions(permission.id, true);
    } else {
        permission.c = false;
        permission.r = false;
        permission.u = false;
        permission.d = false;
        this.checkChildPermissions(permission.id, false);
    }
}
  
  checkChildPermissions(parentId: number, checked: boolean) {
    this.permissions.forEach((childPermission: Permission) => {
      if (childPermission.parentId === parentId) {
        childPermission.checked = checked;
        childPermission.c = checked;
        childPermission.r = checked;
        childPermission.u = checked;
        childPermission.d = checked;
      }
    });
  }
  
  toggleParentAndRead(permission: any, event: any): void {
    if (event.target.checked && (permission.c || permission.u || permission.d) && permission.length >= 7) {
        permission.r = true;
        permission.checked = true;
    } else if (!event.target.checked) {
        const anyOtherChecked = this.permissions.some((p: Permission) =>
            p.checked && p !== permission && (p.c || p.u || p.d) && permission.length >= 7
        );
        if (!anyOtherChecked) {
            permission.r = false;
            permission.checked = false;
        }
    }
  }
  
  toggleReadPermission() {
    this.readChecked = this.createChecked || this.readChecked || this.updateChecked || this.deleteChecked;
  }
  
  toggleChildAndParentRead(permission: Permission) {
    if (permission.c || permission.u || permission.d) {
      permission.r = true;
      permission.checked = true;
  
      const anyChildChecked = this.permissions.some((p: Permission) =>
        p.parentId === permission.parentId && p.checked
      );
      
      
      const parentPermission = this.permissions.find(p => p.id === permission.parentId);
      if (parentPermission) {
        parentPermission.checked = anyChildChecked;
        parentPermission.c = anyChildChecked;
        parentPermission.u = anyChildChecked;
        parentPermission.d = anyChildChecked;
        parentPermission.r = anyChildChecked;
      }
    } else {
      const anyOtherChecked = this.permissions.some((p: Permission) =>
        p.parentId === permission.parentId && p.checked && (p.c || p.u || p.d) && p !== permission
      );
  
      if (!anyOtherChecked) {
        permission.r = false;
        permission.checked = false;
  
        const parentPermission = this.permissions.find(p => p.id === permission.parentId);
        if (parentPermission) {
          parentPermission.checked = false;
          parentPermission.r = false;
        }
      }
    }
  }
  
  

  @ViewChild('addRoleModal') addRoleModal: any;

  newRole: any = {
    id: 0,
    name: '',
    description: '',
    permissions: '',
    status: 2
  };
  updatedRole: any = {
    id: 0,
    name: '',
    description: '',
    permissions: '',
    status: 2
  };
  updatedRoleStatus: any = {
    id: 0,
    name: '',
    description: '',
    permissions: '',
    status: 3
  };
assignedPermissions: AssignedPermission[] = [];
updatedPermissions: AssignedPermission[] = [];

  isEditModalShown: boolean = false;

  constructor(
    private service: SharedService
  ) {}

  ngOnInit(): void {
    this.loadRoles();
    this.loadPermissions();
    
  }
 
  closeModal() {
    this.closeButton.nativeElement.click();
  }

  loadRoles(): void {
    this.service.getRoles(this.pageNumber, this.pageSize, this.search).subscribe(
      data => {
        console.log('API Response:', data); 
        if (data && data.success && data.data && Array.isArray(data.data.items)) {
          this.roles = data.data.items.filter((role: { status: number; }) => role.status !== 3);
        }
      },
      error => {
        console.error('Error fetching roles:', error);
      }
    );
  }
  
  loadPermissions(): void {
    this.service.getPermissions().subscribe(
      (data: any) => {
        console.log('Permissions API Response:', data); 
        if (data && data.success && data.data) {
          this.permissions = data.data; 
          console.log('Permissions Array:', this.permissions); 
        } else {
          console.error('Invalid API response format for permissions data:', data);
        }
      },
      (error: any) => {
        console.error('Error fetching permissions:', error);
      }
    );
  }
  
 


  
  isParentPermission(permissionId: number): boolean {
    return this.permissions.some(permission => permission.parentId === permissionId);
  }
  
  addNewRole() {
    if (!this.permissions || this.permissions.length === 0) {
        console.error('Permissions array is empty.');
        return;
    }

    const selectedPermissions = this.permissions.filter(permission => permission.checked);

const formattedPermissions = selectedPermissions.map(permission => {
  const c = permission.c ? 'true' : 'false';
  const r = permission.r ? 'true' : 'false';
  const u = permission.u ? 'true' : 'false';
  const d = permission.d ? 'true' : 'false';

  if (permission.parentId !== null && permission.parentId !== undefined) {
      return `${permission.parentId},${permission.id},${c},${r},${u},${d}`;
  } else {
      return ``;
  }
}).join('|');


    this.newRole.permissions = formattedPermissions;

    this.service.addRole(this.newRole).subscribe(
        (response: any) => {
          alert('Role added successfully');
            console.log('Role added successfully');
           

            this.newRole = {
                id: 0,
                name: '',
                description: '',
                permissions: '',
                status: 2
            };

            this.loadPermissions();
            this.loadRoles();

            let btn = document.getElementById('close-auto');
            btn?.click();
        },
        //alert('Duplicate Records Not allowed.');
        
        (error: any) => {
            console.error('Error adding role', error);
            console.log('Error details:', error.error);
        }
    );


    this.newRole.name = this.newRole.name.trim();
    this.newRole.description = this.newRole.description.trim();
    
}

loadAssignedPermissions(roleId: number): Promise<void> {
  return new Promise((resolve, reject) => {
    this.service.getAssignedPermissions(roleId).subscribe(
      (data: any) => {
        console.log('Assigned Permissions API Response:', data); 
        if (data && data.success && Array.isArray(data.data)) {
          this.assignedPermissions = data.data;
          resolve(); // Resolve the promise once data is loaded
        } else {
          console.error('Invalid API response format for assigned permissions data:', data);
          reject('Invalid API response format'); // Reject the promise if data format is invalid
        }
      },
      (error: any) => {
        console.error('Error fetching assigned permissions:', error);
        reject(error); // Reject the promise if there's an error
      }
    );
  });
}

  

  originalRole: any = {};
  
  
  editRole(role: any) {
    debugger;
    console.log('Editing role:', role);
  
    // Load assigned permissions for the selected role
    this.loadAssignedPermissions(role.id).then(() => {
      console.log('Assigned permissions loaded:', this.assignedPermissions);
  
      // Use assigned permissions for updating
      this.updatedPermissions = this.permissions.map((permission: Permission) => {
        const assignedPermission = this.assignedPermissions.find(ap => ap.id === permission.id);
        if (assignedPermission) {
          return {
            ...permission,
            c: assignedPermission.c,
            r: assignedPermission.r,
            u: assignedPermission.u,
            d: assignedPermission.d,
            checked: true // Set to true if it exists in both arrays
          };
        } else {
          return {
            ...permission,
            checked: false // Set to false if it only exists in permissions array
          };
        }
      });
  
      console.log('Permissions after mapping:', this.updatedPermissions);
  
      // Check if there are any permissions in assignedPermissions that are not in permissions array
      const unassignedPermissions = this.assignedPermissions.filter(ap => !this.permissions.some(p => p.id === ap.id));
      console.log('Unassigned permissions:', unassignedPermissions);
      // Add those unassigned permissions to updatedPermissions
      this.updatedPermissions.push(...unassignedPermissions.map(ap => ({ ...ap, checked: true })));
  
      console.log('Permissions after combining:', this.updatedPermissions);
  
      this.updatedRole = {
        id: role.id,
        name: role.name,
        description: role.description, 
        permissions: this.updatedPermissions
      };
  
      console.log('Updated role:', this.updatedRole);
      this.isEditModalShown = true;
    });
  }
  
  
  
  

  
  updateExistingRole() {
    debugger;
    if (this.updatedRole.name.trim() === '' || this.updatedRole.description.trim() === '') {
      console.error('Name and description are required.');
      return;
    }
  
    const formattedPermissions = this.updatedRole.permissions.map((permission: Permission) => {
      const c = permission.c ? 'true' : 'false';
      const r = permission.r ? 'true' : 'false';
      const u = permission.u ? 'true' : 'false';
      const d = permission.d ? 'true' : 'false';
  
      if (permission.parentId !== null && permission.parentId !== undefined) {
        return `${permission.parentId},${permission.id},${c},${r},${u},${d}`;
      } else {
        return '';
      }
    }).join('|');
  
    // Keep the permissions array intact
    const permissionsArray = this.updatedRole.permissions;
  
    // Update only the formatted permissions string for backend use
    const updatedRoleForBackend = {
      ...this.updatedRole,
      permissions: formattedPermissions
    };
  
    const roleChanged = JSON.stringify(updatedRoleForBackend) !== JSON.stringify(this.originalRole);
  
    if (roleChanged) {
      if (this.updatedRole.status === null) {
        this.updatedRole.status = 2;
      }
  
      this.service.updateRole(updatedRoleForBackend).subscribe(
        () => {
          console.log('Role updated successfully');
          this.isEditModalShown = false;
          this.loadRoles();
        },
        error => {
          console.error('Error updating role', error);
          if (error && error.error && error.error.errors) {
            console.error('Validation errors:', error.error.errors);
          }
        }
      );
    } else {
      console.log('No changes made to the role.');
    }
  
    let btn = document.getElementById('close-update');
    btn?.click();
  
    this.updatedRole.name = this.updatedRole.name.trim();
    this.updatedRole.description = this.updatedRole.description.trim();
  }
  

  


  updateRoleStatus(id: number) {
    const role = this.roles.find(role => role.id === id);
    if (!role) {
      console.error('Role not found.');
      return;
    }

    const updatedRoleStatus = {
      id: role.id,
      name: role.name,
      description: role.description,
      permissions: role.permissions,
      status: 3
    };

    this.service.updateRoleStatus(updatedRoleStatus).subscribe(
      () => {
        this.roles = this.roles.filter(role => role.id !== id);
      },
      error => {
        console.error('Error deleting role', error);
      }
    );
  }

  Space(event: any) {
    if (event?.target.selectionStart == 0 && event.code === 'Space') {
      alert('Spaces Not Allowed');
      event.preventDefault();
    }
  }
}


























