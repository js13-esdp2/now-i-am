import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.sass']
})
export class HomeComponent implements OnInit {
  @ViewChild('f') form!: NgForm;
  isLoading = false;
  isSearched = false;

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  onSubmit(): void {
    this.isLoading = true;
    this.isSearched = true;
    const searchTitle = (this.form.value).search;
    void this.router.navigate(['/statistic'], {queryParams: {title: searchTitle}})
  }
}
