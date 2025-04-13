import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { IUser } from '../../interfaces/iuser.interface';
import { UsersService } from '../../services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buttons',
  imports: [RouterModule],
  templateUrl: './buttons.component.html',
  styleUrl: './buttons.component.css'
})
export class ButtonsComponent {
  @Input() myUser: IUser | any;
  userService = inject(UsersService);
  @Output() deleteItemEmit: EventEmitter<Boolean> = new EventEmitter();
  router = inject(Router);
  @Input() ocultar: Boolean = false;

  deleteUser(id: string) {
    Swal.fire({
      title: '¿Desea prodeceder a eliminar el usuario?',
      showCancelButton: true,
      confirmButtonColor: 'red',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await this.userService.delete(id)
        if (this.deleteItemEmit.observed) {
          this.deleteItemEmit.emit(true);
          Swal.fire(
            'El usuario ha sido eliminado correctamente.',
          );

        } else {
          this.router.navigate(['/home']);
        }
      }
    });
  }
}



