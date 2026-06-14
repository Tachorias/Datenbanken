import { Component } from '@angular/core';
import { FormsModule} from '@angular/forms';

@Component({
  selector: 'app-test',
  imports: [FormsModule],
  templateUrl: './test.html',
  styleUrl: './test.css',
})
export class Test {
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
