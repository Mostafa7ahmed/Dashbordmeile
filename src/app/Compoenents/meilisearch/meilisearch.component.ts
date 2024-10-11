import { CommonModule } from '@angular/common';
import { MeilisearchService } from './../../Core/service/meilisearch.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

declare var bootstrap: any; // Access Bootstrap modal methods

@Component({
  selector: 'app-meilisearch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './meilisearch.component.html',
  styleUrls: ['./meilisearch.component.scss'],
})
export class MeilisearchComponent implements OnInit, OnDestroy {
  meiliData: any[] = [];
  currentPage = 1;
  totalPages = 1;
  totalPagesArray: number[] = [];
  unsub: any;
  pageSize = 50;

  meilForm = new FormGroup({
    label: new FormControl(null, Validators.required),
    url: new FormControl(null, Validators.required),
    apiKey: new FormControl(null, Validators.required),
  });

  editmelie = new FormGroup({
    id: new FormControl(''),
    label: new FormControl('', Validators.required),
    url: new FormControl('', Validators.required),
    apiKey: new FormControl('', Validators.required),
  });

  constructor(private _MeilisearchService: MeilisearchService) {}

  getData(pageNumber: number = 1, pageSize: number = 40) {
    this.unsub = this._MeilisearchService.getAll(pageNumber, pageSize).subscribe({
      next: (res) => {
        console.log(res)
        this.meiliData = res.items;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => {
        console.error('Error fetching data:', err);
      },
    });
  }

  editMelie(id: string) {
    this._MeilisearchService.getMeileById(id).subscribe({
      next: (res) => {
        this.editmelie = new FormGroup({
          id: new FormControl(res.result.id),
          label: new FormControl(res.result.label, Validators.required),
          url: new FormControl(res.result.url, Validators.required),
          apiKey: new FormControl(res.result.apiKey, Validators.required),
        });
      },
      error: (err) => {
        console.error('Error fetching data for edit:', err);
      },
    });
  }

  updateMelie(): void {
    if (this.editmelie.valid) {
      this._MeilisearchService.updateMelie(this.editmelie.value).subscribe({
        next: (res) => {
          const index = this.meiliData.findIndex(item => item.id === res.id);
          if (index !== -1) {
            this.meiliData[index] = res; 
          }
          this.closeModal('#exampleModal2'); 
          console.log('Edit Done > ', res);

        },
        error: (err) => {
          console.error('Error updating item:', err);
        },
      });
    }
  }

  addMeili(data: FormGroup) {
    if (data.valid) {
      this._MeilisearchService.addMeile(data.value).subscribe({
        next: (res) => {
          console.log('Added Done > ', res);
          this.closeModal('#exampleModal'); 
     
          data.reset(); 
        },
        error: (err) => {
          console.error('Error:', err);
        },
      });
    }
  }

  deleteMeili(id: string) {
    this._MeilisearchService.deleteMeile(id).subscribe({
      next: (res) => {
        this.meiliData = this.meiliData.filter(item => item.id !== id);
        console.log('Item deleted:', res);
      },
      error: (err) => {
        console.error('Error deleting item:', err);
      },
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.getData(page);
    }
  }

  ngOnInit(): void {
    this.getData();
    this._MeilisearchService.startConnection();
  
    this._MeilisearchService.addTransferDataListener((operationType, response) => {
      console.log('Received notification:', response);
      
      const data = response.result;
  
      if (operationType === 0) { 
        this.meiliData.push(data);
      } else if (operationType === 1) {
        const index = this.meiliData.findIndex(item => item.id === data.id);
        if (index !== -1) {
          this.meiliData[index] = data;
        }
      } else if (operationType === 2) {
        this.meiliData = this.meiliData.filter(item => item.id !== data.id); 
      }
    });
  }


  ngOnDestroy(): void {
    this.unsub?.unsubscribe();
    this._MeilisearchService.stopConnection();
  }



  // Close the modal
  closeModal(idModel: string) {
    const modalElement = document.querySelector(idModel);
    const modal = bootstrap.Modal.getInstance(modalElement);
    modal.hide();
  }

}
