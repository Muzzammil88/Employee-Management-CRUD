import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/shared.service';
@Component({
  selector: 'app-show-dep',
  templateUrl: './show-dep.component.html',
  styleUrls: ['./show-dep.component.css'],
})
export class ShowDepComponent {
sortResult(prop: string | number,asc: any) {
this.DepartmentList=this.DepartmentListWithoutFilter.sort(function(a: { [x: string]: number; },b: { [x: string]: number; }){
  if(asc){
return (a[prop]>b[prop])?1 : ((a[prop]<b[prop]) ?-1 :0);
  }else{
    return (b[prop]>a[prop])?1 : ((b[prop]<a[prop]) ?-1 :0);

  }
})
}
  DepartmentList: any = [];
  ModalTitle!: string; //! not necessary
  ActivateAddEditDepComp: boolean = false;
  dep: any;

  DepartmentIdFilter: string = '';
  DepartmentNameFilter: string = '';
  DepartmentListWithoutFilter: any = [];

  constructor(private service: SharedService) {}

  ngOnInit(): void {
    debugger;
    this.refreshDepList();
  }

  addClick() {
    this.dep = {
      DepartmentId: 0,
      DepartmentName: '',
    };
    this.ModalTitle = 'Add Department';
    this.ActivateAddEditDepComp = true;
  }
  closeClick() {
    this.ActivateAddEditDepComp = false;
    this.refreshDepList();
  }
  editClick(item: any) {
    //  [: any ] extra
    this.dep = item;
    this.ModalTitle = 'Edit Department';
    this.ActivateAddEditDepComp = true;
  }

  deleteClick(item: { DepartmentId: any }) {
    if (confirm('Are You Sure You Want To Delete ?')) {
      // this.DepartmentList.splice(this.DepartmentList);
      this.service.deleteDepartment(item.DepartmentId).subscribe((data) => {
        alert(data.toString());
        this.refreshDepList();
      });
    }
  }

  refreshDepList() {
    this.service.getDepList().subscribe((data) => {
      this.DepartmentList = data;
      this.DepartmentListWithoutFilter = data;
    });
  }

  FilterFn() {
    var DepartmentIdFilter = this.DepartmentIdFilter;
    var DepartmentNameFilter = this.DepartmentNameFilter;

    this.DepartmentList = this.DepartmentListWithoutFilter.filter(function (
      el: { DepartmentId: { toString: () => string; }; DepartmentName: { toString: () => string; }; }          // extra
    ) {
      return (
        el.DepartmentId.toString()
          .toLowerCase()
          .includes(DepartmentIdFilter.toString().trim().toLowerCase()) &&
        el.DepartmentName.toString()
          .toLowerCase()
          .includes(DepartmentNameFilter.toString().trim().toLowerCase())
      );
    });
  }
}
