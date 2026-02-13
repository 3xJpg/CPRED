import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService, Combatant } from '../services/game-state.service';

@Component({
  selector: 'app-initiative-tracker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-[#1a1a1a] border border-[#333] p-4 h-full flex flex-col cp-border">
      <div class="flex justify-between items-center mb-4">
        <h3 class="text-xl text-[#ff3e3e] uppercase font-bold tracking-wider">NET // COMBAT_TRACKER</h3>
        <div class="text-[#fcee0a] font-mono text-sm">ROUND: {{ gameState.round() }}</div>
      </div>

      <!-- Add New -->
      <div class="grid grid-cols-12 gap-2 mb-4 bg-[#0a0a0a] p-3 border border-[#333]">
        <div class="col-span-3">
            <input type="text" [(ngModel)]="newName" placeholder="Name" class="w-full bg-[#121212] text-white border-b border-[#333] focus:border-[#ff3e3e] outline-none px-1 text-sm">
        </div>
        <div class="col-span-2">
            <input type="number" [(ngModel)]="newInit" placeholder="Init" class="w-full bg-[#121212] text-white border-b border-[#333] focus:border-[#ff3e3e] outline-none px-1 text-sm text-center">
        </div>
        <div class="col-span-2">
            <input type="number" [(ngModel)]="newHp" placeholder="HP" class="w-full bg-[#121212] text-white border-b border-[#333] focus:border-[#ff3e3e] outline-none px-1 text-sm text-center">
        </div>
        <div class="col-span-2">
            <input type="number" [(ngModel)]="newSp" placeholder="SP" class="w-full bg-[#121212] text-white border-b border-[#333] focus:border-[#ff3e3e] outline-none px-1 text-sm text-center">
        </div>
        <div class="col-span-3 flex justify-end gap-1">
             <button (click)="add(false)" class="bg-[#00f0ff] text-black text-xs font-bold px-2 py-1 uppercase hover:bg-white clip-corner">Add PC</button>
             <button (click)="add(true)" class="bg-[#ff3e3e] text-black text-xs font-bold px-2 py-1 uppercase hover:bg-white clip-corner">Add NPC</button>
        </div>
      </div>

      <div class="flex gap-2 mb-2">
        <button (click)="gameState.nextTurn()" class="flex-grow cp-btn bg-[#fcee0a] text-black font-bold py-2 uppercase text-sm">
          Next Turn >>
        </button>
        <button (click)="gameState.resetCombat()" class="cp-btn bg-[#2a2a2a] text-[#666] font-bold py-2 px-4 uppercase text-xs hover:text-[#ff3e3e]">
          Reset
        </button>
      </div>

      <!-- List -->
      <div class="flex-grow overflow-y-auto space-y-1 pr-1 custom-scrollbar">
        @for (c of gameState.sortedCombatants(); track c.id) {
          <div 
            class="flex items-center p-2 border-l-4 transition-all duration-300 relative group"
            [class.border-[#ff3e3e]]="c.id === gameState.activeCombatantId()"
            [class.border-[#333]]="c.id !== gameState.activeCombatantId()"
            [class.bg-[#2a2a2a]]="c.id === gameState.activeCombatantId()"
            [class.bg-[#0f0f0f]]="c.id !== gameState.activeCombatantId()"
            [class.opacity-50]="c.hp <= 0"
          >
            <!-- Initiative Score -->
            <div class="w-8 font-mono text-xl font-bold text-center text-[#666] mr-2">
                {{ c.initiative }}
            </div>

            <!-- Main Info -->
            <div class="flex-grow">
                <div class="flex justify-between items-baseline">
                    <span class="font-bold text-lg tracking-wide" [class.text-[#ff3e3e]]="c.isEnemy" [class.text-[#00f0ff]]="!c.isEnemy">
                        {{ c.name }}
                    </span>
                    <button (click)="gameState.removeCombatant(c.id)" class="text-[#333] hover:text-[#ff3e3e] text-xs uppercase opacity-0 group-hover:opacity-100 transition-opacity">
                        [DELETE]
                    </button>
                </div>
                
                <div class="flex gap-4 text-xs mt-1 font-mono text-[#aaa]">
                    <div class="flex items-center gap-1">
                        <span class="text-[#ff3e3e]">HP:</span>
                        <input 
                            type="number" 
                            [ngModel]="c.hp" 
                            (ngModelChange)="updateHp(c.id, $event)"
                            class="w-12 bg-black border border-[#333] text-center text-white focus:border-[#ff3e3e] outline-none"
                        />
                        <span class="text-[#666]">/ {{c.maxHp}}</span>
                    </div>
                     <div class="flex items-center gap-1">
                        <span class="text-[#fcee0a]">SP:</span>
                        <input 
                            type="number" 
                            [ngModel]="c.spBody" 
                             (ngModelChange)="updateSp(c.id, $event)"
                            class="w-10 bg-black border border-[#333] text-center text-white focus:border-[#fcee0a] outline-none"
                        />
                    </div>
                </div>
            </div>

            <!-- Active Indicator -->
             @if (c.id === gameState.activeCombatantId()) {
                <div class="absolute right-2 top-2 w-2 h-2 bg-[#ff3e3e] rounded-full animate-pulse"></div>
             }
          </div>
        }
        @if (gameState.combatants().length === 0) {
            <div class="text-center text-[#444] mt-10 font-mono italic">
                NO_ACTIVE_SIGNALS_DETECTED
            </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .clip-corner {
      clip-path: polygon(0 0, 100% 0, 100% calc(100% - 5px), calc(100% - 5px) 100%, 0 100%);
    }
  `]
})
export class InitiativeTrackerComponent {
  gameState = inject(GameStateService);

  newName = '';
  newInit = 0;
  newHp = 20;
  newSp = 11;

  add(isEnemy: boolean) {
    if (!this.newName) return;
    
    this.gameState.addCombatant({
      name: this.newName,
      initiative: this.newInit,
      hp: this.newHp,
      maxHp: this.newHp,
      spBody: this.newSp,
      spHead: this.newSp,
      isEnemy: isEnemy,
      notes: ''
    });

    // Randomize name slightly to avoid rapid duplicates
    this.newName = '';
    this.newInit = Math.floor(Math.random() * 10) + 1;
  }

  updateHp(id: string, newHp: number) {
    this.gameState.updateCombatant(id, { hp: newHp });
  }

  updateSp(id: string, newSp: number) {
    this.gameState.updateCombatant(id, { spBody: newSp });
  }
}