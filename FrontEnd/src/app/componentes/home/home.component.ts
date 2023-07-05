import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  title = 'FrontEnd';
  readonly APIurl = "http://localhost:34255/usuario/";
  usuario: any = {};
  Usuarioxid: any = {};

  constructor(private http: HttpClient, private router: Router) { }

  notes: any = [];
  estados: string[] = ['Jalisco', 'Nuevo León', 'Querétaro'];
  ciudadesPorEstado: { [estado: string]: string[] } = {
    'Jalisco': ['Guadalajara', 'Zapopan', 'Tlaquepaque'],
    'Nuevo León': ['Monterrey', 'San Pedro Garza García', 'Santa Catarina'],
    'Querétaro': ['Querétaro', 'San Juan del Río', 'El Marqués']
  };

  Message: string = '';
  estadoSeleccionado: string = '';
  ciudadSeleccionada: string = '';
  currentPage = 1;
  itemsPerPage = 9;
  totalPages: number = 0;
  UserName = localStorage.getItem("user");

  logOut() {
    localStorage.clear();
    this.router.navigateByUrl("Login");
  }

  numberInputListener() {
    const numberInput = document.getElementById("InputTelefono1") as HTMLInputElement;
    if (numberInput) {
      numberInput.addEventListener("input", () => {
        let value = numberInput.value;
        value = value.replace(/\D/g, ''); // Solo permite dígitos numéricos
        numberInput.value = value;
      });
    }
    const numberInput2 = document.getElementById("InputCodigoPostal1") as HTMLInputElement;
    if (numberInput2) {
      numberInput2.addEventListener("input", () => {
        let value = numberInput2.value;
        value = value.replace(/\D/g, ''); // Solo permite dígitos numéricos
        numberInput2.value = value;
      });
    }
  }

  loginUrl() {
    this.router.navigateByUrl("Login");
  }

  actualizarCiudad(): void {
    this.ciudadSeleccionada = '';
  }

  get pagedNotes() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.notes.slice(startIndex, endIndex);
  }

  pageChanged(page: number) {
    this.currentPage = page;
  }

  setCurrentPage(page: number) {
    this.currentPage = page;
  }

  getRange(): number[] {
    return Array(this.totalPages).fill(0).map((_, index) => index + 1);
  }

  refreshNotes() {
    this.http.get(this.APIurl + 'Listar').subscribe(data => {
      this.notes = data;
      this.totalPages = Math.ceil(this.notes.length / this.itemsPerPage);
    });
  }

  GetUser(id: any) {
    this.http.get(this.APIurl + 'Listarxid?ID=' + id).subscribe(data => {
      this.Usuarioxid = data;
      this.MessageValue('Actualizar Usuario');
      console.log(this.Usuarioxid);
      for (let note of this.Usuarioxid) {
        console.log(note['Usuario']);
        this.usuario.User = note['Usuario'];
        this.usuario.Nombre = note['Nombre'];
        this.usuario.Direccion = note['Direccion'];
        this.usuario.Telefono = note['Telefono'];
        this.usuario.CodigoPostal = note['CodigoPostal'];
        this.usuario.TipoUsuario = note['TipoUsuario'];
        this.usuario.Estado = note['Estado'];
        this.usuario.Ciudad = note['Ciudad'];
        this.usuario.Pass = note['Pass'];
        this.usuario.id = note['ID'];
        this.ciudadSeleccionada = note['Ciudad'];
        this.estadoSeleccionado = note['Estado'];
      }
    });
  }

  ngOnInit() {
    this.refreshNotes();
    this.numberInputListener();
  }

  MessageValue(Mensaje: string) {
    this.Message = Mensaje;
    if (this.Message === "Nuevo Usuario") {
      this.usuario.User = "";
      this.usuario.Nombre = "";
      this.usuario.Direccion = "";
      this.usuario.Telefono = "";
      this.usuario.CodigoPostal = "";
      this.usuario.TipoUsuario = "";
      this.usuario.Estado = "";
      this.usuario.Ciudad = "";
      this.usuario.Pass = "";
      this.usuario.id = "";
      this.ciudadSeleccionada = "";
      this.estadoSeleccionado = "";
    }
  }

  addUsuario(form: NgForm) {
    if (this.usuario.Nombre === "" || this.usuario.Direccion === "" || this.usuario.Telefono === "" || this.usuario.CodigoPostal === "" || this.usuario.TipoUsuario === "" || this.estadoSeleccionado === "" || this.ciudadSeleccionada === "" || this.usuario.User === "" || this.usuario.Pass === "") {
      Swal.fire({
        title: 'Error',
        text: 'Faltan campos por llenar',
        icon: 'error',
        showConfirmButton: true
      });
    } else {
      if (this.usuario.Telefono.length < 10) {
        Swal.fire({
          title: 'Error',
          text: 'Introduzca un numero de 10 digitos',
          icon: 'error',
          showConfirmButton: true
        });
      } else {
        if (this.Message === 'Actualizar Usuario') {
          this.updateUsuario();
        } else {
          this.usuario.Estado = this.estadoSeleccionado;
          this.usuario.Ciudad = this.ciudadSeleccionada;
          const usuarioData = {
            nombre: this.usuario.Nombre,
            direccion: this.usuario.Direccion,
            telefono: this.usuario.Telefono,
            codigoPostal: this.usuario.CodigoPostal,
            TipoUsuario: this.usuario.TipoUsuario,
            estado: this.usuario.Estado,
            ciudad: this.usuario.Ciudad,
            user: this.usuario.User,
            pass: this.usuario.Pass,
            id: ""
          };

          this.http.post(this.APIurl + 'guardar', usuarioData).subscribe(
            (data: any) => {
              Swal.fire({
                title: 'Éxito',
                text: data.message,
                icon: 'success',
                showConfirmButton: false,
                timer: 1500
              });
              this.refreshNotes();
            },
            (error: any) => {
              console.log(error);
              Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al guardar el usuario',
                icon: 'error',
                showConfirmButton: true
              });
            }
          );
        }
      }
    }

  }

  updateUsuario() {
    const usuarioData = {
      nombre: this.usuario.Nombre,
      direccion: this.usuario.Direccion,
      telefono: this.usuario.Telefono,
      codigoPostal: this.usuario.CodigoPostal,
      TipoUsuario: this.usuario.TipoUsuario,
      estado: this.estadoSeleccionado,
      ciudad: this.ciudadSeleccionada,
      user: this.usuario.User,
      pass: this.usuario.Pass,
      id: this.usuario.id.toString()
    };

    if (this.usuario.Nombre === "" || this.usuario.Direccion === "" || this.usuario.Telefono === "" || this.usuario.CodigoPostal === "" || this.usuario.TipoUsuario === "" || this.estadoSeleccionado === "" || this.ciudadSeleccionada === "" || this.usuario.User === "" || this.usuario.Pass === "") {
      Swal.fire({
        title: 'Error',
        text: 'Faltan campos por llenar',
        icon: 'error',
        showConfirmButton: true
      });
    } else {
      if (this.usuario.Telefono.length < 10) {
        Swal.fire({
          title: 'Error',
          text: 'Introduzca un numero de 10 digitos',
          icon: 'error',
          showConfirmButton: true
        });
      } else {
        this.http.put(this.APIurl + 'actualizar', usuarioData).subscribe(
          (data: any) => {
            Swal.fire({
              title: 'Éxito',
              text: data.message,
              icon: 'success',
              showConfirmButton: false,
              timer: 1500
            });
            this.refreshNotes();
          },
          (error: any) => {
            console.log(error);
            Swal.fire({
              title: 'Error',
              text: 'Ocurrió un error al actualizar el usuario',
              icon: 'error',
              showConfirmButton: true
            });
          }
        );
      }
    }


  }

  deleteUsuario(id: any) {
    this.http.delete(this.APIurl + 'eliminar?id=' + id).subscribe(data => {
      Swal.fire({
        title: 'Éxito',
        text: 'Usuario eliminado',
        icon: 'success',
        showConfirmButton: false,
        timer: 1500
      });
      this.refreshNotes();
    });
  }
}