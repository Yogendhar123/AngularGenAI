import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Language } from './language.enum';
@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private languageSubject = new BehaviorSubject<Language>(Language.EN); // Set default language
  language$ = this.languageSubject.asObservable();
 
 
  setLanguage(language: Language) {
    this.languageSubject.next(language);
    // console.log()
  }
}
