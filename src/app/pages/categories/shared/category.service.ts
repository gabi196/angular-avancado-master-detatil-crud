import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { from, Observable, throwError } from 'rxjs'
import { map, catchError, flatMap } from 'rxjs/operators'

import { Category } from './category.model'
import { CategoriesModule } from '../categories.module';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private apiPath: string = "api/categories"

  constructor(private http: HttpClient ) { }

  // toda vez que for chamaso o getAll ele vai retornar um array de categorias (este array foi definido no model e está no backend)
  getAll(): Observable<Category[]>{ // return fazer uma requisicao para retornar essas categorias
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError), //passa o cachError que eh da biblioteca rxjs para a variavel handleError
      map(this.jsonDataToCategories) // esse jsonDataToCategories recebe do backend as categorias, então eh so converter para categoria pois esse json não vem nesse type para o angular
    )  
  }



  //metodo que retorna uma categoria especifica dependendo do id que a pessoa passar
  // ele receberá um id e retornará um observeble do tipo Category
  getById(id: number): Observable<Category> {
    //a url sera uma interpolação contendo o caminho da api barra o id da categoria que eu quero acessar
    const url =`${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory), //nesse caso é jsonDataToCategory e não jsonDataToCategories como foi usado no getAll pois aqui ele retorna apenas uma categoria e nao um array delas 
    )
  }

  //metodo de criacao de uma categoria
  //recebe um objeto do tipo category e retorna um Observeble do tipo category
  create(category: Category): Observable<Category> {
    return this.http.post(this.apiPath, category).pipe( // o category aqui siguinifica o corpo da requisicao post que esta sendo feita
      catchError(this.handleError),
      map(this.jsonDataToCategory),
    )
  }

  //metodo de edicao de um dos campos de uma categoria
  update(category: Category): Observable<Category> {
    const url = `${this.apiPath}/${category.id}`;

    return this.http.put(url, category).pipe(
      catchError(this.handleError),
      //aqui esta sendo usado este objeto vazio, pois quando se faz um put no in memory database ele não retorna nada, entao nao tem um jsonDataToCategory para ser convertido para categoria
      //então 'forcamos' ele retorna o mesmo objeto recebido, no caso o category
      //se estiver trbalhando com um servidor real tem como retornar um json normalmente
      map(() => category)
    )
  }

  //metodo para excluir uma categoria
  // recebe o id da categotia a ser excluida e retorna um Observable do tipo any
  delete(id: number): Observable<any> {
    const url =`$(this.apiPath)/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }



  //PRIVATE ME THODS

  //ele recebe um array de objetos que sao as categorias do backend do servidor que ainda precisam ser convertidas para categorias para serem entendidas pelo angula como objetos desse tipo, colocou o Category[] ali pois eh o que ele retorna no final
  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  } 

  //apenas converte o json recebido em categoria
  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }

  // esse metodo recebera um erro do tipo any e retornarah um Observeble do tipo Any
  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }

  




}
