import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedService } from 'src/app/shared.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css'],
})
export class UserComponent implements OnInit {
  // selectDep(event: any) {
  //   this.depList = event.target.value;
  //   this.addUsers();
  // }

  // selectDep(event: any) {
  //   debugger;
  //   console.log(event.target);
  //   const selectedDepartmentId = event.target.value;
  //this.userForm.controls['departmentId'].setValue(selectedDepartmentId);
  //}

  // selectDep(event: any) {
  //   let mod ={
  //     name:this.depList,
  //     id:this.depList
  //   }
  //   debugger;
  //   console.log(this.depList);

  //   const selectedDepartmentId = event.target(mod).value;
  //   this.userForm.controls['departmentId'].setValue(selectedDepartmentId);
  // }

  userForm!: FormGroup;
  users: any[] = [];
  selectedUser: any = {};
  userClose: boolean = false;
  depList: any[] = [];
  roleList: any[] = [];
  designationList: any[] = [];
  pageNumber: number = 1;
  pageSize: number = 100;
  search: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private service: SharedService
  ) {}

  ngOnInit(): void {
    this.getDepartments();
    this.getRoleList();
    this.getDesignationList();
    this.initForm();
    this.fetchUsers();
  }

  initForm() {
    this.userForm = this.formBuilder.group({
      id: [0],
     fullName: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
    
           department: [''],
      roleId: [''],
      departmentId: ['', Validators.required],
      email: ['', [Validators.required]],
      phoneNumber: ['', [Validators.pattern('^\\d{11}$')]],
   
      userName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z]+$/)]],

      password: ['', Validators.required],
      designation: [''],
      designationId: [0],
      status: [''],
      statusName: [''],
      setStatus: [''],
    });
  }

  fetchUsers() {
    this.service.GetUsers().subscribe(
      (data: any) => {
        this.users = data.data.items;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  addUsers() {
    console.log(this.userForm.controls);
    this.userForm.controls['departmentId'].setValue(
      Number(this.userForm.controls['departmentId'].value)
    );
    this.userForm.controls['roleId'].setValue(
      Number(this.userForm.controls['roleId'].value)
    );
    this.userForm.controls['designationId'].setValue(
      Number(this.userForm.controls['designationId'].value)
    );
    // this.userForm.controls['designationId'].setValue(
    //   Number(this.userForm.controls['designationId'].value)
    // );
    this.userForm.controls['designation'].value;
    console.log(this.userForm.valid);

    if (this.userForm.valid) {
      this.service.AddUser(this.userForm.value).subscribe((data: any) => {
        if (data.success) {
          alert('User added successfully');
          this.initForm();
          this.fetchUsers();
          this.refreshModal();
          this.closeClick();
        } else {
          alert('Failed to add user: ' + data.message);
        }
      });
    } else {
      alert('Invalid Form all fields must be filled');
      //alert(confirm('Invalid Form all fields must be filled');
    }
    this.refreshModal();
    this.closeClick();
  }
  selectUser(user: any) {
    this.selectedUser = { ...user };

    this.userForm.controls['id'].setValue(user.id);
    this.userForm.controls['fullName'].setValue(user.fullName);
    this.userForm.controls['userName'].setValue(user.userName);
    this.userForm.controls['email'].setValue(user.email);
    this.userForm.controls['phoneNumber'].setValue(user.phoneNumber);
    this.userForm.controls['department'].setValue(user.department);
    this.userForm.controls['departmentId'].setValue(user.departmentId);
    this.userForm.controls['designation'].setValue(user.designation);
    this.userForm.controls['roleId'].setValue(user.role);
    this.userForm.controls['designationId'].setValue(user.designationId); //id kat do
    this.userForm.controls['password'].setValue(user.password);
  }

 
  updateUser() {
    let data = {
      id: this.userForm.controls['id'].value,
      department: this.userForm.controls['department'].value,
      departmentId: this.userForm.controls['departmentId'].value,
      designation: this.userForm.controls['designation'].value,
      designationId: this.userForm.controls['designationId'].value, // Update designationId
      email: this.userForm.controls['email'].value,
      fullName: this.userForm.controls['fullName'].value,
      image: null,
      password: this.userForm.controls['password'].value,
      phoneNumber: this.userForm.controls['phoneNumber'].value,
      roleId: this.userForm.controls['roleId'].value, // Update roleId
      setStatus: this.selectedUser.setStatus,
      status: this.selectedUser.status,
      statusName: 'default',
      userBase64DigiSign: 'default',
      userName: this.userForm.controls['userName'].value,
    };
  
    this.service.UpdateUser(data).subscribe(
      (data: any) => {
        if (data.success) {
          alert('User updated successfully');
          this.fetchUsers();
          this.refreshModal();
        } else {
          alert('Failed to update user: ' + data.message);
        }
      },
      (error: any) => {
        console.error('Error updating user:', error);
      }
    );
    this.refreshModal();
  }
  

  deleteUser(user: any) {
    user.status = 3;
    this.service.DeleteUser(user).subscribe(
      (data: any) => {
        if (confirm('Hit Ok to Delete the Record')) {
          if (data.success) {
            alert('User deleted successfully');
            this.fetchUsers();
          } else {
            alert('Failed to delete user: ' + data.message);
          }
        }
      },
      (error: any) => {
        console.error('Error deleting user:', error);
      }
    );
  }

  getDepartments() {
    let dep = {
      pageNumber: 1,
      pageSize: 2,
    };
    this.service.GetAllDepartments(dep).subscribe((data) => {
      //debugger;
      this.depList = data.data.items;
      //console.log(this.depList);
    });
    console.log(this.depList);
    console.log('unable to show the departments');
  }
  getRoleList() {
    // let dep = {
    //   pageNumber: 1,
    //   pageSize: 2,
    // };
    this.service.getRoles(this.pageNumber, this.pageSize, this.search).subscribe((data) => {
      //debugger;
      this.roleList = data.data.items;
      //console.log(this.depList);
    });
    console.log(this.roleList);
    console.log('unable to show the Roles');
  }
  getDesignationList() {
    // let desig = {
    //   id: 0,
    //   name: '',
    // };
    this.service.GetAllDesignations().subscribe((data) => {
      //debugger;
      this.designationList = data.data.items;
      console.log(this.designationList);
     
    });
    console.log(this.designationList);
    console.log('unable to show the Designations');
  }

  refreshModal() {
    this.userForm.reset();
  }

  closeClick() {
    this.userClose = true;
    this.userForm.reset();
    //this.refreshModal();
  }
  Space(event: any) {
    if (event?.target.selectionStart == 0 && event.code === 'Space') {
      alert('Spaces Not Allowed');
      event.preventDefault();
    }
  }



  //

 // updateUser(): void {
    // if (this.userForm.valid) {
    //   const userData = this.userForm.value;
    //   this.sharedService.updateUser(userData).subscribe({
    //     next: (response) => {
          // Handle success response
          //console.log('User updated successfully:', response);
      //  },
    //     error: (error) => {
    //       // Handle error
    //       console.error('Error updating user:', error);
    //     }
    //   });
    // } else {
      // Mark form controls as touched to show validation errors
  //     this.userForm.markAllAsTouched();
  //   }
  // }

  // Other methods in your component
  //
}
