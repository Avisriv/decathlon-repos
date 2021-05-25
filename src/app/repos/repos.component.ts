import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatPaginator } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ReposDataSource } from './repos.datasource';
import { FilterRow, ReposModel } from './repos.model';
import { ReposService } from './repos.service';

@Component({
  selector: 'app-repos',
  templateUrl: './repos.component.html',
  styleUrls: ['./repos.component.css'],
})
export class ReposComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = [
    'title',
    'language',
    'stargazers',
    'lastUpdated',
    'topics'
  ];
  dataSource = new ReposDataSource(this.service);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  searchUserForm!: FormGroup;
  responseArray: ReposModel[] = [];

  languages: string[] = [];
  languagesOptions = [{}];

  languageFilters: FilterRow[] = [];
  typeFilters: FilterRow[] = [{ key: 'Sources', value: 'Sources' },
  { key: 'Forks', value: 'Forks' },
  { key: 'Archived', value: 'Archived' },
  { key: 'Mirrors', value: 'Mirrors' }];
  topicFilters = [{ key: '', value: '' }];
  @ViewChild('allSelectedLang') private allSelectedLang!: MatOption;
  @ViewChild('allSelectedType') private allSelectedType!: MatOption;
  @ViewChild('allSelectedTopic') private allSelectedTopic!: MatOption;

  constructor(private service: ReposService) {}

  ngOnInit(): void {
    var self = this;
    this.initFormControls();
    this.getData();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  initFormControls() {
    this.searchUserForm = new FormGroup({
      languageSelector: new FormControl('', [Validators.required]),
      typeSelector: new FormControl(''),
      topicSelector: new FormControl(''),
    });
    this.searchUserForm.controls.typeSelector.patchValue([
      ...this.typeFilters.map((item) => item.key),
      0,
    ]);
  }

  getData() {
    var self = this;
    this.dataSource.getData().subscribe((response) => {
      self.dataSource.setData(response);
      self.responseArray = response;
      self.responseArray.forEach((element) => {
        if (!self.languages.includes(element.language)) {
          self.languageFilters.push({
            key: element.language,
            value: element.language,
          });
          self.languages.push(element.language);
        }
      });
      self.searchUserForm.controls.languageSelector.patchValue([
        ...self.languageFilters.map((item) => item.key),
        0,
      ]);
    });
  }

  toggleSingleLang() {
    if (this.allSelectedLang.selected) {
      this.allSelectedLang.deselect();
    }
    if (
      this.searchUserForm.controls.languageSelector.value.length ==
      this.languageFilters.length
    ) {
      this.dataSource.setLanguageSelected(['all']);
      this.dataSource.applyFilter();
      this.allSelectedLang.select();
    } else {
      var selectedLangs: string[] = this.searchUserForm.controls.languageSelector.value;
      this.dataSource.setLanguageSelected(selectedLangs.length > 0 ? selectedLangs: ['none']);
      this.dataSource.applyFilter();
    }
    return false;
  }

  toggleAllLang() {
    this.dataSource.setLanguageSelected(this.allSelectedLang.selected? ['all']: ['none']);
    this.dataSource.applyFilter();
    if (this.allSelectedLang.selected) {
      console.log([...this.languageFilters.map((item) => item.key), 0]);
      this.searchUserForm.controls.languageSelector.patchValue([
        ...this.languageFilters.map((item) => item.key),
        0,
      ]);
    } else {
      this.searchUserForm.controls.languageSelector.patchValue([]);
    }
  }

  toggleSingleType() {
    if (this.allSelectedType.selected) {
      this.allSelectedType.deselect();
    }
    if (
      this.searchUserForm.controls.typeSelector.value.length ==
      this.typeFilters.length
    ) {
      this.dataSource.setTypeSelected(['all']);
      this.dataSource.applyFilter();
      this.allSelectedType.select();
    } else {
      var selectedTypes: string[] = this.searchUserForm.controls.typeSelector.value;
      this.dataSource.setTypeSelected(selectedTypes.length > 0 ? selectedTypes: ['none']);
      this.dataSource.applyFilter();
    }
    return false;
  }

  toggleAllType() {
    this.dataSource.setTypeSelected(this.allSelectedType.selected? ['all']: ['none']);
    this.dataSource.applyFilter();
    if (this.allSelectedType.selected) {
      this.searchUserForm.controls.typeSelector.patchValue([
        ...this.typeFilters.map((item) => item.key),
        0,
      ]);
    } else {
      this.searchUserForm.controls.typeSelector.patchValue([]);
    }
  }

  sortData(sort: Sort) {
    this.dataSource.sortTheData(sort);
  }

  applyFilterTitle(event: KeyboardEvent): void {
    this.dataSource.setSearchTitleString((event.target as HTMLInputElement).value);
    this.dataSource.applyFilter();
  }

  
  applyFilterTopic(event: KeyboardEvent): void {
    this.dataSource.setSearchTopicString((event.target as HTMLInputElement).value);
    this.dataSource.applyFilter();
  }
}
