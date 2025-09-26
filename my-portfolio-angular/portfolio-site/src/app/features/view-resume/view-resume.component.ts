import { Component, Injector } from '@angular/core';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  selector: 'app-view-resume',
  templateUrl: './view-resume.component.html',
  styleUrls: ['./view-resume.component.css']
})
export class ViewResumeComponent extends CommonApp{
  
  aboutMeData: any;
  constructor(public override injector: Injector){
    super(injector)
  }
    
  ngOnInit() {
    this.getData();
  }

  getData(){
    this.services.getCombinedData().subscribe(data => {
      this.aboutMeData = data.aboutMe;
    });
  }

}
