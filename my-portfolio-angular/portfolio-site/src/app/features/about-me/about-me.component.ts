import { Component, Injector } from '@angular/core';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  selector: 'app-about-me',
  templateUrl: './about-me.component.html',
  styleUrls: ['./about-me.component.css']
})
export class AboutMeComponent extends CommonApp{
  
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
