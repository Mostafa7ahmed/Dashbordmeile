import { CommonModule } from '@angular/common';
import { MeilisearchService } from './../../Core/service/meilisearch.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Meilisearch } from '../../Core/interface/meilisearch';
import { SiganlRService } from '../../Core/service/siganl-r.service';

declare var bootstrap: any; // Access Bootstrap modal methods

@Component({
  selector: 'app-meilisearch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './meilisearch.component.html',
  styleUrls: ['./meilisearch.component.scss'],
})
export class MeilisearchComponent implements OnInit, OnDestroy {
  meiliData: Meilisearch[] = [];
  currentPage :number  = 1;
  totalPages  :number = 1;
  movenext:boolean=false;
  movePrevious:boolean=false;

  totalPagesArray: number[] = [];
  unsub: any;
  pageSize:number = 5;
  search :string= '';
  meilForm = this.createFormGroup();
  editmelie = this.createEditFormGroup();

  constructor(private meilisearchService: MeilisearchService, private signalR: SiganlRService) {}

  private createFormGroup(): FormGroup {
    return new FormGroup({
      label: new FormControl(null, Validators.required),
      url: new FormControl(null, Validators.required),
      apiKey: new FormControl(null, Validators.required),
    });
  }

  private createEditFormGroup(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      label: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      apiKey: new FormControl('', Validators.required),
    });
  }

  ngOnInit(): void {
    this.getData();
    this.setupSignalRConnection();
  }

  private setupSignalRConnection(): void {
    this.signalR.startConnection();
    this.signalR.addListener("NotifyMeiliSearchAsync",(operationType, response) => {
      this.handleSignalRNotification(operationType, response.result);
    });
  }

  private handleSignalRNotification(operationType: number, data: Meilisearch): void {
    switch (operationType) {
      case 0: // Add
        this.meiliData.push(data);
        break;
      case 1: // Update
        const index = this.meiliData.findIndex(item => item.id === data.id);
        if (index !== -1) {
          this.meiliData[index] = data;
        }
        break;
      case 2: // Delete
        this.meiliData = this.meiliData.filter(item => item.id !== data.id);
        break;
      default:
        console.warn('Unknown operation type:', operationType);
    }
  }

  getData(page: number = this.currentPage): void {
    this.unsub = this.meilisearchService.getAll(page, this.pageSize, this.search).subscribe({
      next: res => this.handleGetDataSuccess(res),
      error: err => console.error('Error fetching data:', err),
    });
  }

  private handleGetDataSuccess(res: { items: Meilisearch[], currentPage: number, totalPages: number , moveNext:boolean, movePrevious:boolean}): void {
    this.meiliData = res.items;
    this.currentPage = res.currentPage;
    this.totalPages = res.totalPages;
    this.movenext= res.moveNext;
    this.movePrevious=res.movePrevious
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  editMelie(id: string): void {
    this.meilisearchService.getMelieById(id).subscribe({
      next: res => this.populateEditForm(res.result),
      error: err => console.error('Error fetching data for edit:', err),
    });
  }

  private populateEditForm(data: Meilisearch): void {
    this.editmelie.setValue({
      id: data.id,
      label: data.label,
      url: data.url,
      apiKey: data.apiKey,
    });
  }

  updateMelie(): void {
    if (this.editmelie.valid) {
      this.meilisearchService.updateMelie(this.editmelie.value).subscribe({
        next: res => this.handleUpdateSuccess(res),
        error: err => console.error('Error updating item:', err),
      });
    }
  }

  private handleUpdateSuccess(res: Meilisearch): void {
    const index = this.meiliData.findIndex(item => item.id === res.id);
    if (index !== -1) {
      this.meiliData[index] = res;
    }
    this.closeModal('#exampleModal2');
    console.log('Edit Done > ', res);
  }

  addMeili(data: FormGroup): void {
    if (data.valid) {
      this.meilisearchService.addMelie(data.value).subscribe({
        next: res => this.handleAddSuccess(res, data),
        error: err => console.error('Error adding item:', err),
      });
    }
  }

  private handleAddSuccess(res: Meilisearch, data: FormGroup): void {
    console.log('Added Done > ', res);
    this.closeModal('#exampleModal');
    data.reset();
  }

  deleteMeili(id: string): void {
    this.meilisearchService.deleteMelie(id).subscribe({
      next: res => {
        this.meiliData = this.meiliData.filter(item => item.id !== id);
        console.log('Item deleted:', res);
      },
      error: err => console.error('Error deleting item:', err),
    });
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getData(page);
    }
  }

  searchMeili(): void {
    this.currentPage = 1;
    this.getData(this.currentPage); 
  }

  ngOnDestroy(): void {
    this.unsub?.unsubscribe();
    this.signalR.stopConnection();
  }

  // Close the modal
  closeModal(idModel: string): void {
    const modalElement = document.querySelector(idModel);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal?.hide();
  }
}
