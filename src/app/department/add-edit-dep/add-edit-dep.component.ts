import { Component, Input , OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
@Component({
  selector: 'app-add-edit-dep',
  templateUrl: './add-edit-dep.component.html',
  styleUrls: ['./add-edit-dep.component.css'],
})
export class AddEditDepComponent {
  updateDepartment() {
    var val = {
      DepartmentId: this.DepartmentId,
      DepartmentName: this.DepartmentName,
    };
    this.service.updateDepartment(val).subscribe((res) => {
      alert(res.toString());
    });
  }
  addDepartment() {
    var val = {
      DepartmentId: this.DepartmentId,
      DepartmentName: this.DepartmentName,
    };
    this.service.addDepartment(val).subscribe((res) => {
      alert(res.toString());
    });
  }
  constructor(private service: SharedService) {}
  @Input() dep: any;
  DepartmentId!: string; //     [!]
  DepartmentName!: string;
  ngOnInit(): void {
    this.DepartmentId = this.dep.DepartmentId;
    this.DepartmentName = this.dep.DepartmentName;
  }
}
