import { MatTableDataSource } from '@angular/material/table';
import { ReposService } from './repos.service';
import { ReposModel } from './repos.model';
import { Sort } from '@angular/material/sort';
import { Observable } from 'rxjs';

export class ReposDataSource extends MatTableDataSource<ReposModel> {
  orgData: ReposModel[] = [];
  apiParameter = '';
  sources: string[] = ['All', 'Sources', 'Forks', 'Archived', 'Mirrors'];
  manualSearchedString = '';
  manualTopicString = '';
  languageSelected: string[] = ['all'];
  typeSelected: string[] = ['all'];

  constructor(private service: ReposService) {
    super();
  }

  getData(): Observable<any> {
    return this.service.getDatas();
  }

  setData(response: any) {
    this.orgData = response;
    this.data = response;
    this.data.forEach((element) => {
      this.service.getTopics(element.name).subscribe((resultTopics) => {
        element.topics = resultTopics;
      })
      if (element.fork) {
        element.rep_type = 'Forks';
      } else if (element.mirror_url != null) {
        element.rep_type = 'Mirrors';
      } else if (element.archived) {
        element.rep_type = 'Archived';
      } else {
        element.rep_type = 'Sources';
      }
      if (element.language == null) {
        element.language = 'N/A';
      }
    });
  }

  /*Sort the columns */
  sortTheData(sort: Sort) {
    const data = this.data.slice();
    if (!sort.active || sort.direction === '') {
      this.data = data;
      return;
    }
    this.data = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'title':
          return this.compare(a.name, b.name, isAsc);
        case 'language':
          return this.compare(a.language, b.language, isAsc);
        case 'stargazers':
          return this.compare(a.stargazers_count, b.stargazers_count, isAsc);
        case 'lastUpdated':
          return this.compareDate(a.updated_at, b.updated_at, isAsc);
        default:
          return 0;
      }
    });
  }
  //Compare number/strings
  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  //Compere Date
  compareDate(a: Date, b: Date, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }

  setSearchTitleString(searchedString: string) {
    this.manualSearchedString = searchedString;
  }

  setSearchTopicString(searchedString: string) {
    this.manualTopicString = searchedString;
  }

  setLanguageSelected(selectedLanguages: string[]) {
    this.languageSelected = selectedLanguages;
  }

  setTypeSelected(selectedType: string[]) {
    this.typeSelected = selectedType;
  }

  applyFilter() {
    this.data = this.orgData;
    this.applyTitleFilter(this.manualSearchedString);
    this.applyLanguageFilter(this.languageSelected);
    this.applyTypeFilter(this.typeSelected);
    this.applyTopicFilter(this.manualTopicString);
  }

  applyTitleFilter(searchedString: string): void {
    if (searchedString.length === 0) {
      this.data = this.data;
    } else {
      this.data = this.data.filter((element) => {
        if (element.name.includes(searchedString)) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  applyLanguageFilter(selectedLanguages: string[]) {
    if (selectedLanguages[0] === 'all') {
      this.data = this.data;
    } else if (selectedLanguages[0] === 'none') {
      this.data = [];
    } else {
      this.data = this.data.filter((element) => {
        if (selectedLanguages.includes(element.language)) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  applyTypeFilter(selectedTypes: string[]) {
    if (selectedTypes[0] === 'all') {
      this.data = this.data;
    } else if (selectedTypes[0] === 'none') {
      this.data = [];
    } else {
      this.data = this.data.filter((element) => {
        if (selectedTypes.includes(element.rep_type)) {
          return true;
        } else {
          return false;
        }
      });
    }
  }

  applyTopicFilter(searchedString: string): void {
    if (searchedString.length === 0) {
      this.data = this.data;
    } else {
      this.data = this.data.filter((element) => {
        var found = false;
        element.topics.forEach(topic => {
          if (topic.includes(searchedString)) {
            found = true;
          }
        });
        if (found) {
          return true;
        } else {
          return false;
        }
      });
    }
  }
}
