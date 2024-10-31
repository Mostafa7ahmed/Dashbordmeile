import { Component } from '@angular/core';
import { SidebarComponent } from "../sidebar/sidebar.component";
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-controllers',
  standalone: true,
  imports: [ SidebarComponent , RouterOutlet] ,
  templateUrl: './controllers.component.html',
  styleUrl: './controllers.component.scss'
})
export class ControllersComponent {

}
