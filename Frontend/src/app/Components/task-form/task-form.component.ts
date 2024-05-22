import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent {

  constructor(){
    
  }

  @Output() onSubmitTask = new EventEmitter<any>();
  @Output() onCancelTask = new EventEmitter<void>();

  task = {
    title: '',
    description: '',
    dueDate: null,
    priority: null
  };

  priorityOptions = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
  ];

  onSubmit() {
    this.onSubmitTask.emit(this.task);
  }

  onCancel() {
    this.onCancelTask.emit();
  }
}
