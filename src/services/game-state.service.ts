import { Injectable, signal, computed } from '@angular/core';

export interface Combatant {
  id: string;
  name: string;
  initiative: number;
  hp: number;
  maxHp: number;
  spHead: number;
  spBody: number;
  isEnemy: boolean;
  notes: string;
}

export interface LogEntry {
  timestamp: Date;
  message: string;
  type: 'roll' | 'combat' | 'system' | 'gen';
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  // Combat State
  combatants = signal<Combatant[]>([]);
  activeCombatantId = signal<string | null>(null);
  round = signal<number>(1);
  
  // Logs
  logs = signal<LogEntry[]>([]);

  // Derived
  sortedCombatants = computed(() => {
    return [...this.combatants()].sort((a, b) => b.initiative - a.initiative);
  });

  private generateId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  addCombatant(combatant: Omit<Combatant, 'id'>) {
    const newCombatant = { ...combatant, id: this.generateId() };
    this.combatants.update(list => [...list, newCombatant]);
    this.addLog(`Added ${combatant.name} to initiative.`, 'combat');
  }

  removeCombatant(id: string) {
    const c = this.combatants().find(x => x.id === id);
    this.combatants.update(list => list.filter(c => c.id !== id));
    if (c) this.addLog(`Removed ${c.name} from combat.`, 'combat');
  }

  updateCombatant(id: string, updates: Partial<Combatant>) {
    this.combatants.update(list => 
      list.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  }

  nextTurn() {
    const sorted = this.sortedCombatants();
    if (sorted.length === 0) return;

    const currentId = this.activeCombatantId();
    let nextIndex = 0;

    if (currentId) {
      const currentIndex = sorted.findIndex(c => c.id === currentId);
      if (currentIndex >= 0 && currentIndex < sorted.length - 1) {
        nextIndex = currentIndex + 1;
      } else {
        // New Round
        nextIndex = 0;
        this.round.update(r => r + 1);
        this.addLog(`Round ${this.round()} started.`, 'combat');
      }
    }

    const nextId = sorted[nextIndex].id;
    this.activeCombatantId.set(nextId);
    
    // Auto heal/status check logic could go here
  }

  resetCombat() {
    this.combatants.set([]);
    this.round.set(1);
    this.activeCombatantId.set(null);
    this.addLog('Combat reset.', 'system');
  }

  addLog(message: string, type: 'roll' | 'combat' | 'system' | 'gen') {
    this.logs.update(logs => [{ timestamp: new Date(), message, type }, ...logs].slice(0, 50));
  }
}