import { Injectable } from '@angular/core';

// AI Service Disabled for Local/Offline Mode
@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  constructor() {}
  
  // Stubs for compatibility if invoked
  async generateContent(prompt: string, systemInstruction?: string): Promise<string> {
    return "AI_DISABLED";
  }

  async generateJson(prompt: string, schema: any): Promise<any> {
    return {};
  }
}