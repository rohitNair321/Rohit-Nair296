import { CommonModule } from '@angular/common';
import { Component, Injector } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CommonApp } from 'src/app/core/services/common';

@Component({
  selector: 'app-view-resume',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    CardModule,
    ButtonModule,
  ],
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
