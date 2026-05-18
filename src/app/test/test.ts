import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-test',
  imports: [FormsModule, DatePipe],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
  username = "Nutzername"
  clickbar = true
  title = "Sexy Silvan"
  onButtonClick() {
    alert("Tim stinkt!");
    this.clickbar = false
  }
  filme = [{name: "Star Wars 1",
                                            datum: "21.04.2026",
                                              time: "09:00"},
                                        {name: "Star Wars 2",
                                            datum: "21.04.2026",
                                              time: "12:00"},
                                        {name: "Star Wars 3",
                                            datum: "21.04.2026",
                                              time: "15:00"}]
}

export class DatumComponent {
  birthday = new Date(1988, 3, 15); // April 15, 1988
  toggle = true; // start with true == shortDate
  get format() { return this.toggle ? 'shortDate' : 'fullDate'; }
  toggleFormat() { this.toggle = !this.toggle; }
}
