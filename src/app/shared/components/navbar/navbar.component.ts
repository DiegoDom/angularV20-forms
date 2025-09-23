import { Component } from '@angular/core';
import { reactiveRoutes } from '../../../reactive/reactive.routes';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  title: string;
  route: string;
}

const reactiveItems = reactiveRoutes[0].children ?? [];

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  reactiveMenuItems: MenuItem[] = reactiveItems
    .filter((item) => item.path !== '**')
    .map(({ path, title }) => ({
      route: `/reactive/${path}`,
      title: `${title}`,
    }));

  authMenuItems: MenuItem[] = [
    {
      title: 'Register',
      route: '/auth/sign-up',
    },
  ];

  countriesMenuItems: MenuItem[] = [
    {
      title: 'Countries',
      route: '/countries',
    },
  ];
}
