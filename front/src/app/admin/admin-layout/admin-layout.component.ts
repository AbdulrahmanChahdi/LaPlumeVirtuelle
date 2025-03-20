import { Component } from '@angular/core';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss']
})
export class AdminLayoutComponent {
  toggleSidebar = false;

  toggleSidebarMenu(): void {
    this.toggleSidebar = !this.toggleSidebar;
  }
}
