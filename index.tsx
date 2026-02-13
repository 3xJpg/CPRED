import '@angular/compiler';
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './src/app.component';
import { provideZonelessChangeDetection } from '@angular/core';

bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection()
  ]
}).then(() => {
  console.log('Cyberpunk RED Interface // Bootstrapped Successfully');
}).catch((err) => {
  console.error('CRITICAL ERROR // SYSTEM HALT', err);
  document.body.innerHTML += `<div style="color:red; padding:20px; font-family:monospace;">SYSTEM ERROR: ${err.message}</div>`;
});

// AI Studio always uses an `index.tsx` file for all project types.
