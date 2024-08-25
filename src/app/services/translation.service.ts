import { ChangeDetectorRef, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

enum TranslationKeys {
  TotalMachinesWorkingNormally = 'total_machines_working_normally',
  // Add more keys as needed
}

enum Language {
  EN = 'en',
  JA = 'ja',
  DE = 'de',
  SV = 'sv'
}
 
interface Translations {
  [key: string]: string;
}
 
interface LanguageTranslations {
  [Language.EN]: Translations;
  [Language.JA]: Translations;
  [Language.DE]: Translations;
  [Language.SV]: Translations;
}
 





@Injectable({
  providedIn: 'root',
})
export class TranslationService {

  
  activeLanguage = '';
  private subject = new Subject<void>();


  private language: Language = Language.EN;
  
  private translations: LanguageTranslations = {
    [Language.EN]: {
      [TranslationKeys.TotalMachinesWorkingNormally]: 'Total machines working normally',
      // Add more translations for English
    },
    [Language.JA]: {
      [TranslationKeys.TotalMachinesWorkingNormally]: '正常に稼働しているマシン全体',
      // Add more translations for Japanese
    },
    [Language.DE]: {
      [TranslationKeys.TotalMachinesWorkingNormally]: 'Insgesamt normal arbeitende Maschinen',
      // Add more translations for German
    },
    [Language.SV]: {
      [TranslationKeys.TotalMachinesWorkingNormally]: 'Totalt maskiner som fungerar normalt',
      // Add more translations for Swedish
    }
  };
 
  getActiveLanguage(): Language {
    return this.language;
    
  }
 
  setLanguage(lang: Language): void {
    this.language = lang;
  }
 
  translate(key: TranslationKeys): string {
    return this.translations[this.language][key] || key;
  }


  getRefreshEvent(): Observable<any> {
    return this.subject.asObservable();
  }

  sendRefreshEvent() {
    this.subject.next();
  }

  setActiveLanguage(language: string) {
    this.activeLanguage = language;
    console.log(this.getActiveLangauge());
    console.log( this.activeLanguage,"test")
    this.sendRefreshEvent();
  }

  getActiveLangauge() {
    return this.activeLanguage;
  }

  initializeLanguage() {
    console.log(this.getCachedLanguage());
    if (this.getCachedLanguage() == 'ja') {
      this.setActiveLanguage('ja');
    }else if(this.getCachedLanguage() == 'ko'){
      this.setActiveLanguage('ko')

    }else if(this.getCachedLanguage() == 'de'){
      this.setActiveLanguage('de')

    }else if(this.getCachedLanguage() == 'sv'){
      this.setActiveLanguage('sv')

    }else if(this.getCachedLanguage() == 'it'){
      this.setActiveLanguage('it')

    } else {
      this.setActiveLanguage('en');
    }
  }

  getCachedLanguage() {
    var name = 'googtrans=';
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
      var c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length).split('/').pop();
      }
    }
    return '';
  }
}
