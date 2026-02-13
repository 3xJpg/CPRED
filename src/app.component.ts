import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitiativeTrackerComponent } from './components/initiative-tracker.component';
import { DiceRollerComponent } from './components/dice-roller.component';
import { GeneratorComponent } from './components/generator.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, InitiativeTrackerComponent, DiceRollerComponent, GeneratorComponent],
  templateUrl: './app.component.html'
})
export class AppComponent {}