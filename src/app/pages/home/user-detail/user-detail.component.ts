import { Component, inject, Input } from '@angular/core';
import { IUser } from '../../../interfaces/iuser.interface';
import { UsersService } from '../../../services/users.service';
import { ButtonsComponent } from "../../../shared/buttons/buttons.component";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-detail',
  imports: [ButtonsComponent],
  templateUrl: './user-detail.component.html',
  styleUrl: './user-detail.component.css'
})
export class UserDetailComponent {
  @Input() id: string = ""
  user: IUser | any;
  userService = inject(UsersService);

  async ngOnInit() {
    try {
      this.user = await this.userService.getById(this.id);
    } catch (msg: any) {
      Swal.fire(
        '¡Error!',
        'El usuario no ha sido encontrado.',
      );
    }
  }
}