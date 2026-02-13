import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GameStateService } from '../services/game-state.service';

@Component({
  selector: 'app-generator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="bg-[#1a1a1a] border border-[#333] p-4 h-full flex flex-col cp-border">
      <h3 class="text-xl text-[#ff3e3e] mb-4 uppercase font-bold tracking-wider">NET // DATAPOOL_GEN</h3>
      
      <!-- Tabs -->
      <div class="flex mb-4 border-b border-[#333]">
        <button 
          (click)="activeTab.set('npc')" 
          class="px-4 py-2 font-mono text-sm uppercase transition-colors"
          [class.text-[#00f0ff]]="activeTab() === 'npc'"
          [class.border-b-2]="activeTab() === 'npc'"
          [class.border-[#00f0ff]]="activeTab() === 'npc'"
          [class.text-[#666]]="activeTab() !== 'npc'"
        >NPC</button>
        <button 
          (click)="activeTab.set('mission')" 
          class="px-4 py-2 font-mono text-sm uppercase transition-colors"
          [class.text-[#fcee0a]]="activeTab() === 'mission'"
          [class.border-b-2]="activeTab() === 'mission'"
          [class.border-[#fcee0a]]="activeTab() === 'mission'"
          [class.text-[#666]]="activeTab() !== 'mission'"
        >Mission</button>
      </div>

      <!-- Input Area -->
      <div class="mb-4">
        <label class="block text-[#666] text-xs mb-1 uppercase tracking-widest">Controls</label>
        <div class="flex gap-2">
            <button 
                (click)="generate()" 
                class="cp-btn flex-grow bg-[#ff3e3e] text-black font-bold px-4 py-2 uppercase text-sm hover:bg-white transition-colors">
                GENERATE {{ activeTab() }}
            </button>
        </div>
        <div class="text-[#444] text-[10px] mt-1 font-mono uppercase">
            MODE: OFFLINE // DATABASE: LOCAL
        </div>
      </div>

      <!-- Results Area -->
      <div class="flex-grow overflow-y-auto bg-[#0a0a0a] border border-[#333] p-3 font-mono text-sm text-[#e0e0e0] relative custom-scrollbar">
        @if (result() || npcData()) {
             @if (activeTab() === 'npc' && npcData()) {
                <div class="space-y-2 animate-fade-in">
                    <div class="border-b border-[#333] pb-2 mb-2">
                        <div class="text-xl text-[#00f0ff] font-bold">{{ npcData().name }}</div>
                        <div class="text-[#666] uppercase text-xs">{{ npcData().role }} // {{ npcData().affiliation }}</div>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-2 text-xs">
                        <div class="bg-[#121212] p-1"><span class="text-[#ff3e3e]">REF:</span> {{npcData().stats?.REF}}</div>
                        <div class="bg-[#121212] p-1"><span class="text-[#ff3e3e]">DEX:</span> {{npcData().stats?.DEX}}</div>
                        <div class="bg-[#121212] p-1"><span class="text-[#ff3e3e]">BODY:</span> {{npcData().stats?.BODY}}</div>
                        <div class="bg-[#121212] p-1"><span class="text-[#ff3e3e]">EMP:</span> {{npcData().stats?.EMP}}</div>
                        <div class="bg-[#121212] p-1 col-span-2"><span class="text-[#fcee0a]">HP:</span> {{npcData().hp}} / <span class="text-[#fcee0a]">SP:</span> {{npcData().sp}}</div>
                    </div>

                    <div class="mt-4">
                        <div class="text-[#aaa] text-xs uppercase mb-1">Visuals</div>
                        <p class="text-[#ddd] italic">{{ npcData().visuals }}</p>
                    </div>

                    <div class="mt-2">
                         <div class="text-[#aaa] text-xs uppercase mb-1">Quirk/Hook</div>
                        <p>{{ npcData().quirk }}</p>
                    </div>

                    <div class="mt-4 pt-2 border-t border-[#333]">
                         <button (click)="addToCombat()" class="w-full border border-[#ff3e3e] text-[#ff3e3e] hover:bg-[#ff3e3e] hover:text-black py-1 uppercase text-xs transition-colors">
                            >> Transfer to Combat Tracker
                         </button>
                    </div>
                </div>
             } @else if (activeTab() === 'mission') {
                 <div class="whitespace-pre-wrap leading-relaxed animate-fade-in">
                    <div class="text-[#fcee0a] font-bold text-lg mb-2">NEW_CONTRACT_AVAILABLE</div>
                    {{ result() }}
                 </div>
             }
        } @else {
            <div class="text-[#444] text-center mt-10 italic">
                AWAITING_QUERY...
            </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .custom-scrollbar::-webkit-scrollbar { width: 4px; }
    .custom-scrollbar::-webkit-scrollbar-thumb { background: #333; }
    .animate-fade-in { animation: fadeIn 0.3s ease-in; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class GeneratorComponent {
  private gameState = inject(GameStateService);

  activeTab = signal<'npc' | 'mission'>('npc');
  result = signal<string>('');
  npcData = signal<any>(null);

  // Local Data Tables
  private names = ['Rico', 'Viper', 'Chrome', 'Hex', 'Spider', 'Rex', 'Nova', 'Crash', 'Misty', 'Jack', 'Ghost', 'Luna', 'Drax', 'Zero', 'Axel', 'Blaze'];
  private roles = ['Solo', 'Tech', 'Netrunner', 'Medtech', 'Nomad', 'Fixer', 'Lawman', 'Exec', 'Rockerboy'];
  private affiliations = ['Maelstrom', 'Tyger Claws', 'NCPD', 'Militech', 'Arasaka', 'Valentinos', '6th Street', 'Aldecaldos', 'Freelance'];
  private quirks = [
    'Has a chrome arm that twitches.', 'Smokes cheap synt-tobacco constantly.', 'Paranoid, checks exits.', 'Wears mirrored shades indoors.',
    'Speaks in slang heavily.', 'Has a neon tattoo on neck.', 'Owes money to a Fixer.', 'Refuses to eat real food.', 'Hums a pop song aggressively.'
  ];
  private visuals = [
    'Leather jacket with LED collar.', 'Dirty coveralls covered in grease.', 'High-end suit, slightly bloody.', 'Tactical vest and combat boots.',
    'Cybernetic eyes glowing red.', 'Bright pink mohawk.', 'Face masked by a respirator.', 'Draped in transparent raincoat.'
  ];

  // Mission Data
  private clients = ['A nervous Corp exec', 'A wounded Fixer', 'An AI construct', 'A local gang leader', 'A desperate mother'];
  private objectives = ['extract', 'assassinate', 'escort', 'sabotage', 'retrieve', 'defend'];
  private targets = ['a datashard', 'a prototype weapon', 'a rival lieutenant', 'a shipment of drugs', 'a netrunner in deep dive', 'a witness'];
  private locations = ['in the Combat Zone', 'at a high-end hotel', 'inside a moving maglev train', 'in an abandoned subway station', 'at a busy night market'];
  private twists = ['it is a trap set by NCPD', 'the target is already dead', 'a rival Edgerunner team is there', 'the pay is counterfeit', 'the target is a relative of a PC'];

  generate() {
    this.result.set('');
    this.npcData.set(null);

    if (this.activeTab() === 'npc') {
      this.generateNpc();
    } else {
      this.generateMission();
    }
  }

  private pickRandom(arr: string[]): string {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  private generateNpc() {
    const role = this.pickRandom(this.roles);
    const body = Math.floor(Math.random() * 6) + 3; // 3-9
    
    const stats = {
        REF: Math.floor(Math.random() * 6) + 3,
        DEX: Math.floor(Math.random() * 6) + 3,
        BODY: body,
        EMP: Math.floor(Math.random() * 8) + 1,
    };

    // Calculate derived stats roughly based on CP Red logic
    const hp = 10 + (5 * Math.ceil(body / 2)); 
    const sp = [4, 7, 11, 13][Math.floor(Math.random() * 4)];

    const data = {
        name: this.pickRandom(this.names),
        role: role,
        affiliation: this.pickRandom(this.affiliations),
        stats: stats,
        hp: hp,
        sp: sp,
        visuals: this.pickRandom(this.visuals),
        quirk: this.pickRandom(this.quirks)
    };
    
    this.npcData.set(data);
  }

  private generateMission() {
      const client = this.pickRandom(this.clients);
      const objective = this.pickRandom(this.objectives);
      const target = this.pickRandom(this.targets);
      const location = this.pickRandom(this.locations);
      const twist = this.pickRandom(this.twists);

      const mission = `${client} wants you to ${objective} ${target} ${location}.\n\nBUT: ${twist}.`;
      this.result.set(mission);
  }

  addToCombat() {
      const data = this.npcData();
      if (!data) return;

      this.gameState.addCombatant({
          name: data.name,
          initiative: data.stats.REF + Math.floor(Math.random() * 10) + 1,
          hp: data.hp,
          maxHp: data.hp,
          spBody: data.sp,
          spHead: data.sp,
          isEnemy: true,
          notes: `${data.role}. ${data.quirk}`
      });
      this.gameState.addLog(`Imported NPC ${data.name} from generator.`, 'gen');
  }
}