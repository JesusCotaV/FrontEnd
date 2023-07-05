import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'FrontEnd';
  readonly APIurl = "http://localhost:34255/usuario/";
  usuario: any = {};
  Usuarioxid: any = {};

  constructor(private http: HttpClient) {

  }
  notes: any = [];

  estados: string[] = ['Jalisco', 'Nuevo León', 'Querétaro']; // Arreglo de estados
  ciudadesPorEstado: { [estado: string]: string[] } = { // Arreglo de ciudades por estado
    'Jalisco': ['Guadalajara', 'Zapopan', 'Tlaquepaque'],
    'Nuevo León': ['Monterrey', 'San Pedro Garza García', 'Santa Catarina'],
    'Querétaro': ['Querétaro', 'San Juan del Río', 'El Marqués']
  };

  Message: string = '';
  estadoSeleccionado: string = '';
  ciudadSeleccionada: string = '';
  currentPage = 1; // Página actual
  itemsPerPage = 9; // Cantidad de elementos por página
  totalPages: number = 0;

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
          alert(data.message);
          this.refreshNotes();
        },
        (error: any) => {
          console.log(error);
          // Manejar el error aquí
        }
      );
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


    this.http.put(this.APIurl + 'actualizar', usuarioData).subscribe(
      (data: any) => {
        alert(data.message);
        this.refreshNotes();
      },
      (error: any) => {
        console.log(error);
        // Manejar el error aquí
      }
    );
  }

  deleteUsuario(id: any) {
    this.http.delete(this.APIurl + 'eliminar?id=' + id).subscribe(data => {
      alert("Usuario eliminado");
      this.refreshNotes();

    })
  }

}