import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Gender } from '../models';

@Component({
  selector: 'app-gender',
  templateUrl: './gender.component.html',
  styleUrls: ['./gender.component.scss']
})
export class GenderComponent implements OnInit {
  public current: string;
  public day: string;

  constructor(private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.paramMap.pipe(
      map(params => params.get('gender'))
    ).subscribe(gender => {
      this.current = Gender[gender];
      if (this.router.url.includes('day')) {
        const segments = this.router.url.split('/');
        this.day = segments[segments.length - 1];
      } else {
        this.day = null;
      }
      console.log(this.day);
    });
  }
}
