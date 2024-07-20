import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
@Component({
  selector: 'app-show-emp',
  templateUrl: './show-emp.component.html',
  styleUrls: ['./show-emp.component.css']
})
export class ShowEmpComponent {
  EmployeeList: any = [];
  ModalTitle!: string; //! not necessary
  ActivateAddEditEmpComp: boolean = false;
  emp: any;

  constructor(private service: SharedService) {}

  ngOnInit(): void {
    debugger;
    this.refreshEmpList();
  }

  addClick() {
    this.emp = {
      EmployeeId: 0,
      EmployeeName: "",
      Department: "",
      DateOfJoining:"",
      PhotoFileName:"anonymous.png"
    };
    this.ModalTitle = 'Add Employee';
    this.ActivateAddEditEmpComp = true;         
  }
  closeClick() {
    this.ActivateAddEditEmpComp = false;
    this.refreshEmpList();
  }
  editClick(item: any) {
    //  [: any ] extra
    this.emp = item;
    this.ModalTitle = 'Edit Employee';
    this.ActivateAddEditEmpComp = true;
  }

  deleteClick(item:any) {
    if (confirm('Are You Sure You Want To Delete ?')) {
      this.service.deleteEmployee(item.EmployeeId).subscribe((data) => {
        alert(data.toString());
        this.refreshEmpList();
      });
    }
  }

  refreshEmpList() {
    this.service.getEmpList().subscribe((data) => {
      this.EmployeeList = data;
    });
  }
}
