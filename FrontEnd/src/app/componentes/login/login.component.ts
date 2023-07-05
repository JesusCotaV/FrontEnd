import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { environment } from '../../../environments/environment'

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  title = 'Login';
  APIurl:string="";
  usuario: any = {};
  Usuarioxid: any = {};
  messageError: string = "";

  constructor(private http: HttpClient, private router: Router) {

  }

  async ngOnInit() {
    await this.getUrl();
  }

  async getUrl() {
    try {
      debugger;
      const httpUrl = `http://localhost:${environment.puerto}/usuario/Listar`;
      const response = await fetch(httpUrl);

      if (response.ok) {
        // La URL HTTP funciona correctamente
        this.APIurl = `http://localhost:${environment.puerto}/usuario/`;
      } else {
        throw new Error('URL HTTP no disponible');
      }
    } catch {
      // La URL HTTP no funciona, se utiliza la URL HTTPS
      this.APIurl = `https://localhost:${environment.puerto}/usuario/`;
    }
  }

  GoBack(){
    this.router.navigateByUrl("");
  }

  Login(user: string, pass: string) {
    this.http.get(this.APIurl + 'Listar').subscribe(data => {
      this.Usuarioxid = data;
  
      for (let note of this.Usuarioxid) {
        if (user === note['Usuario']) {
          if (pass === note['Pass']) {
            this.usuario.usuario = note['Usuario'];
            this.usuario.passw = note['Pass'];
            localStorage.setItem("user", note['Usuario']);
            Swal.fire({
              title: '¡Bienvenido!',
              icon: 'success',
              imageHeight: 200,
              imageAlt: 'Custom image',
              showConfirmButton: false,
              timer: 1500,
            });
            this.router.navigateByUrl("");
            return;
          } else {
            this.messageError = "Contraseña incorrecta";
            Swal.fire({
              title: 'Error',
              text: this.messageError,
              icon: 'error',
              imageHeight: 200,
              imageAlt: 'Custom image',
              showConfirmButton: true,
            });
            return;
          }
        }
      }
  
      this.messageError = "Usuario incorrecto";
      Swal.fire({
        title: 'Error',
        text: this.messageError,
        icon: 'error',
        imageHeight: 200,
        imageAlt: 'Custom image',
        showConfirmButton: true,
      });
    });
  }
  


}