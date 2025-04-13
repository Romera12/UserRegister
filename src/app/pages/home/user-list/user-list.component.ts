import { Component, inject, Input } from '@angular/core';
import { IUser } from '../../../interfaces/iuser.interface';
import { UsersService } from '../../../services/users.service';
import { UserCardComponent } from "../../../shared/user-card/user-card.component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
  standalone: true,
  imports: [UserCardComponent, CommonModule]
})
export class UserListComponent {
  @Input() arrUsers: IUser[] = [];
  userServices = inject(UsersService);
  currentPage: number = 1;
  totalPages: number = 1;

  ngOnInit() {
    this.cargaUsers(this.currentPage);
  }

  async cargaUsers(page: number = 1) {
    try {
      const response = await this.userServices.getAll(page);
      this.arrUsers = response.results;
      this.currentPage = response.page;
      this.totalPages = response.total_pages; // Usamos el nombre del API
    } catch (error) {
      console.error('Error en la carga de usuarios:', error);
      this.arrUsers = [];
    }
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.cargaUsers(page);
    }
  }

  deleteUser(event: Boolean) {
    if (event) {
      this.cargaUsers(this.currentPage);
    }
  }

  getPages(): { page: number }[] {
    return Array.from({ length: this.totalPages }, (_, i) => ({ page: i + 1 }));
  }
}