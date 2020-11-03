import { element } from 'protractor';
import { Component, OnInit } from '@angular/core';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { } // serviços são passados como dependência no construtor 

  ngOnInit(): void {
    this.entryService.getAll().subscribe(
      entries => this.entries = entries,
      error => alert('Erro ao carragar a lista')
    )
  }

  deleteEntry(entry) {
    const mustDelete = confirm('Deseja realmente excluir item?');

    if (mustDelete){
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(element => element != entry),
        () => alert("Erro ao tentar excluir")
      )
    }
   
  }

}
