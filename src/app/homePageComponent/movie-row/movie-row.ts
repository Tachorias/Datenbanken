import { Component, Input } from '@angular/core';
import { MovieCard } from '../movie-card/movie-card';
import { ViewChild, ElementRef, AfterViewInit } from '@angular/core';
@Component({
  selector: 'app-movie-row',
  imports: [MovieCard],
  templateUrl: './movie-row.html',
  styleUrl: './movie-row.css',
})
export class MovieRow {
  @Input() daten!:{
    kategorie: string,
  }
  movies = [
    { title: 'Interstellar', image: 'assets/images/interstellar.jpg', description: "Good Movie" },
    { title: 'Inception', image: 'assets/images/inception.jpg' , description: "Good Movie" },
    { title: 'Tenet', image: 'assets/images/tenet.jpg' , description: "Good Movie" },
    { title: 'Dune', image: 'assets/images/dune.jpg' , description: "Good Movie" },
    { title: 'Avatar', image: 'assets/images/avatar.jpg' , description: "Good Movie" },
    { title: 'Matrix', image: 'assets/images/matrix.jpg' , description: "Good Movie" }
  ];
  showMovies: any = [];

  currentIndex = 1; // Halts die Position des ersten sichtbaren Films
  globalFilmCount = 0;
  slideWidth = 0;

  itemsPerView = 4; // entspricht w-1/4

  ngOnInit() {
    this.showMovies = [
      ...this.movies.slice(0, Math.min(this.itemsPerView+1, this.movies.length))
    ];
  }

  private addLast(){
    this.globalFilmCount = (this.globalFilmCount + 1) % this.movies.length;
    this.showMovies.push(this.movies[(this.globalFilmCount + this.itemsPerView) % this.movies.length]);
    this.showMovies.shift();
    console.log(this.showMovies);
  }
  private addFirst() {
    this.globalFilmCount = (this.globalFilmCount - 1);
    if (this.globalFilmCount < 0) {
      this.globalFilmCount = this.movies.length - 1;
    }
    this.showMovies.unshift(this.movies[this.globalFilmCount == 0? this.movies.length -1 :(this.globalFilmCount - 1)]);
    this.showMovies.splice(this.showMovies.length-1,1);
    console.log(this.showMovies);
  }

  next() {
    this.currentIndex = 2;
    this.addLast();
   this.currentIndex = 1;
  }

  prev() {
    this.currentIndex = 0;
    this.addFirst();
    this.currentIndex = 1;
  }
  @ViewChild('track') track!: ElementRef;


  ngAfterViewInit() {
    this.calculateSlideWidth();
    window.addEventListener('resize', () => this.calculateSlideWidth());
    this.showMovies.unshift(this.movies[this.movies.length - 1])
  }

  calculateSlideWidth() {
    const el = this.track.nativeElement.querySelector('.slide');
    this.slideWidth = el.offsetWidth;
  }

  getTransform() {
    console.log(this.currentIndex);
    return `translateX(-${this.currentIndex * this.slideWidth}px)`;
  }
}
