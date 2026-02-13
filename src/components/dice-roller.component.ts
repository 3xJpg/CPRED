import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameStateService } from '../services/game-state.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dice-roller',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-[#1a1a1a] border border-[#333] p-4 h-full flex flex-col cp-border">
      <h3 class="text-xl text-[#ff3e3e] mb-4 uppercase font-bold tracking-wider">NET // Roller</h3>
      
      <div class="grid grid-cols-2 gap-2 mb-4">
        <button (click)="rollD10()" class="cp-btn bg-[#ff3e3e] text-black font-bold py-3 px-4 uppercase text-sm tracking-wider hover:bg-white">
          ROLL D10
        </button>
        <button (click)="rollD6()" class="cp-btn bg-[#2a2a2a] text-[#ff3e3e] border border-[#ff3e3e] font-bold py-3 px-4 uppercase text-sm tracking-wider hover:bg-[#333]">
          ROLL D6
        </button>
      </div>

      <div class="flex gap-2 mb-6">
        <input 
          type="number" 
          [(ngModel)]="customCount" 
          class="bg-black border border-[#333] text-white p-2 w-16 text-center focus:border-[#ff3e3e] outline-none"
          min="1" max="20"
        />
        <span class="self-center text-[#666]">d</span>
        <select [(ngModel)]="customDie" class="bg-black border border-[#333] text-white p-2 w-20 focus:border-[#ff3e3e] outline-none">
          <option [value]="6">6</option>
          <option [value]="10">10</option>
          <option [value]="100">100</option>
        </select>
        <button (click)="rollCustom()" class="cp-btn flex-grow bg-[#fcee0a] text-black font-bold uppercase text-sm">
          Roll
        </button>
      </div>

      <div class="flex-grow overflow-y-auto space-y-2 pr-1 custom-scrollbar">
        @for (log of recentRolls(); track log.timestamp) {
          <div class="text-sm p-2 border-l-2 border-[#333] bg-[#0f0f0f]">
            <span class="text-[#666] text-xs">[{{ log.timestamp | date:'HH:mm:ss' }}]</span>
            <span class="text-[#e0e0e0] ml-2">{{ log.message }}</span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
  `]
})
export class DiceRollerComponent {
  private gameState = inject(GameStateService);
  
  customCount = 1;
  customDie = 6;

  // Computed signal filter for rolls only
  recentRolls = this.gameState.logs;

  rollD10() {
    const val = Math.floor(Math.random() * 10) + 1;
    let msg = `Rolled D10: [${val}]`;
    
    if (val === 10) {
      // Exploding 10 logic for CP Red
      const explode = Math.floor(Math.random() * 10) + 1;
      msg += ` !CRIT! (+${explode}) = Total: ${val + explode}`;
    } else if (val === 1) {
       msg += ` !FUMBLE!`;
    }

    this.gameState.addLog(msg, 'roll');
  }

  rollD6() {
     const val = Math.floor(Math.random() * 6) + 1;
     this.gameState.addLog(`Rolled D6: [${val}]`, 'roll');
  }

  rollCustom() {
    let total = 0;
    const rolls = [];
    for(let i=0; i<this.customCount; i++) {
      const r = Math.floor(Math.random() * this.customDie) + 1;
      rolls.push(r);
      total += r;
    }
    this.gameState.addLog(`Rolled ${this.customCount}d${this.customDie}: [${rolls.join(', ')}] = ${total}`, 'roll');
  }
}