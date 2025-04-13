import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonsComponent } from "../buttons/buttons.component";
import { IUser } from '../../interfaces/iuser.interface';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css'],
  imports: [ButtonsComponent]
})
export class UserCardComponent {
  @Input() myUser!: IUser; // Recibe el objeto usuario IUser
  @Output() deleteItemEmit: EventEmitter<Boolean> = new EventEmitter();

  deleteUser(event: Boolean) {
    this.deleteItemEmit.emit(event)
  }
}