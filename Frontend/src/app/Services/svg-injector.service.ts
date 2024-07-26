import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SvgInjectorService {

  constructor() {
    this.svgInjector();
  }

  svgInjector(){
    const svgUrl = '/assets/icon.svg';
    const xhr = new XMLHttpRequest();
    xhr.open('Get', svgUrl, true);
    xhr.send();
    xhr.onload = () => {
      if(xhr.status == 200){
        const div = document.createElement('div');
        div.innerHTML = xhr.responseText;
        document.body.insertBefore(div, document.body.childNodes[0]);
      }
    }
  }

}
