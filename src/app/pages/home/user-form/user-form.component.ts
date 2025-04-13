import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IUser } from '../../../interfaces/iuser.interface';
import { UsersService } from '../../../services/users.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user-form',
  imports: [ReactiveFormsModule],
  templateUrl: './user-form.component.html',
  styleUrl: './user-form.component.css'
})
export class UserFormComponent {
  userService = inject(UsersService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  title = signal('Registrar');

  // 🔹 Signal reactiva para obtener el ID desde la URL
  idUser = computed(() => this.route.snapshot.paramMap.get('id') ?? '');

  user = signal<IUser | null>(null);

  // 🔹 Se inicializa vacío para evitar el error de Angular Forms
  userForm: FormGroup = new FormGroup({
    _id: new FormControl(null, []),
    username: new FormControl('', [Validators.required]),
    first_name: new FormControl('', [Validators.required]),
    last_name: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required]),
    image: new FormControl('', [])
  });

  constructor() {
    // 🔹 Efecto reactivo para obtener el usuario cuando cambie el ID
    effect(async () => {
      if (this.idUser()) {
        try {
          const fetchedUser = await this.userService.getById(this.idUser());
          this.user.set(fetchedUser);
          this.title.set('Actualizar');
          this.initForm(fetchedUser); // 🔹 Se actualiza el formulario con los datos del usuario
        } catch (msg: any) {
          Swal.fire('¡Error!', msg.error, 'error');
        }
      }
    });
  }

  // 🔹 Método para actualizar los valores del formulario cuando haya datos
  initForm(userData?: IUser) {
    this.userForm.setValue({
      _id: userData?._id || null,
      username: userData?.username || '',
      first_name: userData?.first_name || '',
      last_name: userData?.last_name || '',
      email: userData?.email || '',
      image: userData?.image || ''
    });
  }

  async getDataForm() {
    let response: IUser;
    try {
      if (this.userForm.value._id) {
        const previousUser = this.user();
  
        response = await this.userService.update(this.userForm.value);
  
        const changedFields: string[] = [];
        if (previousUser) {
          (Object.keys(this.userForm.value) as Array<keyof IUser>).forEach((key) => {
            if (this.userForm.value[key] !== previousUser[key]) {
              changedFields.push(`${String(key)}: ${previousUser[key]} → ${this.userForm.value[key]}`);
            }
          });
        }
  
        await Swal.fire({
          title: 'Usuario actualizado',
          html: `
            <strong>${response.first_name}</strong> ha sido actualizado.<br><br>
            <strong>Campos modificados:</strong><br>
            ${changedFields.length ? changedFields.join('<br>') : 'No hubo cambios'}
          `,
          icon: 'success'
        });
  
      } else {
        response = await this.userService.insert(this.userForm.value);
  
        await Swal.fire({
          title: 'Usuario registrado',
          text: `El usuario ${response.first_name} ha sido añadido correctamente.`,
          icon: 'success'
        });
      }
  
      this.router.navigate(['/home', 'usuarios']);
  
    } catch (msg: any) {
      if (msg.status === 400 && Array.isArray(msg.error)) {
        msg.error.forEach((oneError: any) => Swal.fire('¡Error!', oneError, 'error'));
      } else {
        Swal.fire('¡Error!', msg.error || 'Ha ocurrido un error.', 'error');
      }
    }
  }
}