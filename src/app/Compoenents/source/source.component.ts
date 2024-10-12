import { CommonModule } from '@angular/common';
import { SourceService } from '../../Core/service/source.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Source } from '../../Core/interface/source';
import { SiganlRService } from '../../Core/service/siganl-r.service';
declare var bootstrap: any;

@Component({
  selector: 'app-source',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './source.component.html',
  styleUrls: ['./source.component.scss']
})
export class SourceComponent implements OnInit {
  meiliData: Source[] = [];
  currentPage = 1;
  totalPages = 1;
  totalPagesArray: number[] = [];
  pageSize = 5;
  search: string = '';
  movenext:boolean =false;
  movePrevious:boolean =false;


  sourceForm: FormGroup = this.createSourceForm();
  editsource: FormGroup = this.createEditSourceForm();

  constructor(private _sourceService: SourceService, private signalR: SiganlRService) { }

  ngOnInit() {
    this.getData();
    this.initializeSignalR();
  }

  // Form creation methods
  private createSourceForm(): FormGroup {
    return new FormGroup({
      label: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      database: new FormControl('', Validators.required),
      type: new FormControl(0),
    });
  }

  private createEditSourceForm(): FormGroup {
    return new FormGroup({
      id: new FormControl(''),
      label: new FormControl('', Validators.required),
      database: new FormControl('', Validators.required),
      url: new FormControl('', Validators.required),
      type: new FormControl(0),
    });
  }

  // Fetch paginated data
  private getData(pageNumber: number = 1): void {
    this._sourceService.getAll(pageNumber, this.pageSize, this.search).subscribe({
      next: (res) => {
        this.meiliData = res.items;
        this.currentPage = res.currentPage;
        this.totalPages = res.totalPages;
        this.movenext= res.moveNext;
        this.movePrevious=res.movePrevious
        this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
      },
      error: (err) => console.error('Error fetching data:', err),
    });
  }

  // Edit source
  editSource(id: string): void {
    this._sourceService.getSourceById(id).subscribe({
      next: (res) => this.populateEditSourceForm(res.result),
      error: (err) => console.error('Error fetching data for edit:', err),
    });
  }

  private populateEditSourceForm(data: Source): void {
    this.editsource.patchValue(data);
  }

  // Update source
  updateSource(): void {
    if (this.editsource.valid) {
      this._sourceService.updateSource(this.editsource.value).subscribe({
        next: (res) => this.handleUpdateSourceResponse(res),
        error: (err) => console.error('Error updating item:', err),
      });
    }
  }

  private handleUpdateSourceResponse(res: Source): void {
    const index = this.meiliData.findIndex(item => item.id === res.id);
    if (index !== -1) {
      this.meiliData[index] = res;
    }
    this.closeModal('editSource');
    console.log('Edit Done >', res);
  }

  // Add new source
  addSource(data: FormGroup): void {
    if (data.valid) {
      const formData = { ...data.value, type: 0 };
      this._sourceService.addSource(formData).subscribe({
        next: (res) => this.handleAddSourceResponse(res),
        error: (err) => console.error('Error:', err),
      });
    }
  }

  private handleAddSourceResponse(res: Source): void {
    console.log('Success:', res);
    this.closeModal('addSourceModal');
    this.resetForm();
  }

  // Delete a source
  deleteMeili(id: string): void {
    this._sourceService.deleteSource(id).subscribe({
      next: (res) => this.handleDeleteSourceResponse(id, res),
      error: (err) => console.error('Error deleting item:', err),
    });
  }

  private handleDeleteSourceResponse(id: string, res: any): void {
    this.meiliData = this.meiliData.filter(item => item.id !== id);
    console.log('Item deleted:', res);
  }

  // Handle pagination
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.getData(page);
    }
  }

  // Search sources
  searchMeili(): void {
    this.currentPage = 1;
    this.getData(this.currentPage);
  }

  // Close modal
  closeModal(modalId: string): void {
    const modalElement = document.getElementById(modalId);
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement!);
    modal.hide();
  }

  // Reset form
  resetForm(): void {
    this.sourceForm.reset({ label: '', url: '', type: 0, database: '' });
  }

  // Initialize SignalR
  private initializeSignalR(): void {
    this.signalR.startConnection();
    this.signalR.addListener("NotifySourceAsync", this.handleSignalRNotification.bind(this));
  }

  private handleSignalRNotification(operationType: number, response: any): void {
    console.log('Received notification:', response);
    const data = response.result;

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
        this.meiliData = this.meiliData.filter(item => item.id !== data);
        break;
    }
  }

  ngOnDestroy(): void {
    this.signalR.stopConnection();
  }

}
