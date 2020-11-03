import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

import { from, Observable, throwError } from 'rxjs'
import { map, catchError, flatMap } from 'rxjs/operators'

import { Entry } from './entry.model'
// import { EntriesModule } from '../entries.module';

@Injectable({
  providedIn: 'root'
})
export class EntryService {

  private apiPath: string = "api/entries"

  constructor(private http: HttpClient ) { }

  // toda vez que for chamaso o getAll ele vai retornar um array de categorias (este array foi definido no model e está no backend)
  getAll(): Observable<Entry[]>{ // return fazer uma requisicao para retornar essas categorias
    return this.http.get(this.apiPath).pipe(
      catchError(this.handleError), //passa o cachError que eh da biblioteca rxjs para a variavel handleError
      map(this.jsonDataToEntries) // esse jsonDataToEntries recebe do backend as categorias, então eh so converter para categoria pois esse json não vem nesse type para o angular
    )  
  }



  //metodo que retorna uma categoria especifica dependendo do id que a pessoa passar
  // ele receberá um id e retornará um observeble do tipo Entry
  getById(id: number): Observable<Entry> {
    //a url sera uma interpolação contendo o caminho da api barra o id da categoria que eu quero acessar
    const url =`${this.apiPath}/${id}`;

    return this.http.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToEntry), //nesse caso é jsonDataToEntry e não jsonDataToEntries como foi usado no getAll pois aqui ele retorna apenas uma categoria e nao um array delas 
    )
  }

  //metodo de criacao de uma categoria
  //recebe um objeto do tipo entry e retorna um Observeble do tipo entry
  create(entry: Entry): Observable<Entry> {
    return this.http.post(this.apiPath, entry).pipe( // o entry aqui siguinifica o corpo da requisicao post que esta sendo feita
      catchError(this.handleError),
      map(this.jsonDataToEntry),
    )
  }

  //metodo de edicao de um dos campos de uma categoria
  update(entry: Entry): Observable<Entry> {
    const url = `${this.apiPath}/${entry.id}`;

    return this.http.put(url, entry).pipe(
      catchError(this.handleError),
      //aqui esta sendo usado este objeto vazio, pois quando se faz um put no in memory database ele não retorna nada, entao nao tem um jsonDataToEntry para ser convertido para categoria
      //então 'forcamos' ele retorna o mesmo objeto recebido, no caso o entry
      //se estiver trbalhando com um servidor real tem como retornar um json normalmente
      map(() => entry)
    )
  }

  //metodo para excluir uma categoria
  // recebe o id da categotia a ser excluida e retorna um Observable do tipo any
  delete(id: number): Observable<any> {
    const url =`${this.apiPath}/${id}`;
    return this.http.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }



  //PRIVATE ME THODS

  //ele recebe um array de objetos que sao as categorias do backend do servidor que ainda precisam ser convertidas para categorias para serem entendidas pelo angula como objetos desse tipo, colocou o Entry[] ali pois eh o que ele retorna no final
  private jsonDataToEntries(jsonData: any[]): Entry[] {

    // console.log(jsonData[0] as Entry);
    // console.log(Object.assign(new Entry(), jsonData[0]));

    const entries: Entry[] = [];
    jsonData.forEach(element => {
      const entry = Object.assign(new Entry(), element);
      entries.push(entry)
    });
    return entries;
  } 

  //apenas converte o json recebido em categoria
  private jsonDataToEntry(jsonData: any): Entry {
    return Object.assign(new Entry(), jsonData);
  }

  // esse metodo recebera um erro do tipo any e retornarah um Observeble do tipo Any
  private handleError(error: any): Observable<any> {
    console.log("ERRO NA REQUISIÇÃO => ", error);
    return throwError(error);
  }

  




}
