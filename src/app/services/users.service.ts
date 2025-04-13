import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { IUser } from '../interfaces/iuser.interface';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private endPoint: string = 'https://peticiones.online/api/users';

  private httpClient = inject(HttpClient);

  /**
   * getAll()
   * @param page Número de página a cargar
   * @returns Promise con la respuesta de la API
   */
  getAll(page: number = 1): Promise<{
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
    results: IUser[];
  }> {

    return lastValueFrom(
      this.httpClient.get<{
        page: number;
        per_page: number;
        total: number;
        total_pages: number;
        results: IUser[];
      }>(`${this.endPoint}?page=${page}`)
    );
  }

  getById(id: string): Promise<IUser> {
    return lastValueFrom(this.httpClient.get<IUser>(`${this.endPoint}/${id}`));
  }

  delete(id: string): Promise<IUser> {
    return lastValueFrom(
      this.httpClient.delete<IUser>(`${this.endPoint}/${id}`)
    );
  }

  update(user: IUser): Promise<IUser> {
 
    let { _id, ...userBody } = user;
    return lastValueFrom(
      this.httpClient.put<IUser>(`${this.endPoint}/${_id}`, userBody)
    );
  }

  insert(user: IUser): Promise<IUser> {
    let { _id, ...userBody } = user;
    return lastValueFrom(this.httpClient.post<IUser>(this.endPoint, userBody));
  }
}
