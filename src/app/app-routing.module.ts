import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {RootComponent} from "./components/root/root.component";


const routes: Routes = [
  {path: '', component: RootComponent},
  {path: 'projects', loadChildren: () => import('./components/project/project.module').then(m => m.ProjectModule)},
  {path: '**' ,redirectTo:'/'}
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
