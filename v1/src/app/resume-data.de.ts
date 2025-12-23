import { ResumeData } from './resume-data.types';

export const resumeDataDe: ResumeData = {
    language: 'de',
    labels: {
      personalia: 'Personliche Daten',
      profile: 'Personliches Profil',
      overview: 'Kurzuberblick Berufserfahrung',
      experience: 'Berufserfahrung',
      skills: 'IT-Kenntnisse',
      courses: 'Kurse und Ausbildungen',
      environment: 'Umgebung',
      responsibilities: 'Aufgaben',
      languageToggle: 'Sprache',
      searchPlaceholder: 'Suche in Erfahrung, Kenntnissen und Kursen',
      filtersTitle: 'Filter',
      sectionsTitle: 'Sektionen',
      downloadTitle: 'Download',
      downloadPdf: 'PDF',
      downloadTxt: 'TXT',
      downloadMd: 'MD',
      downloadDocx: 'DOCX',
      expand: 'Details',
      collapse: 'Ausblenden',
      facts: {
        name: 'Name',
        title: 'Funktion',
        location: 'Wohnort',
        birthDate: 'Geburtsdatum',
        nationality: 'Nationalitat',
        experienceSince: 'ICT-Erfahrung',
        maritalStatus: 'Familienstand'
      }
    },
    personalia: {
      name: 'Yuri Vaillant',
      title: 'Full-Stack-Entwickler',
      location: 'Leeuwarden',
      birthDate: '25-12-1981',
      nationality: 'Niederlandisch',
      experienceSince: 'Seit 2007',
      maritalStatus: 'In Lebensgemeinschaft'
    },
    profile: {
      paragraphs: [
        'Yuri ist ein engagierter Anwendungsentwickler mit Blick furs Detail. Er ist stark darin, kreative Losungen fur ungewohnliche Probleme zu entwickeln und findet daher immer eine passende Losung fur jedes softwarebezogene Problem. Er besitzt einen integeren Charakter, ist kommunikativ und ein beruhigender Faktor in jeder Situation. Er hat in und fur ein breites Spektrum von Organisationen gearbeitet, darunter die offentliche Hand, aber auch im Finanzsektor.',
        'Yuri legt grossen Wert auf Qualitat in seiner Arbeit. Er strebt vorzugsweise zukunftssichere Anwendungen an, die den Anforderungen des Auftraggebers entsprechen und dabei Wartbarkeit und Erweiterbarkeit nicht aus den Augen verlieren. Durch seine konsistente Arbeitsweise sorgt er dafur, dass Anwendungen ubersichtlich aufgebaut sind und bleiben.',
        'Wahrend der Ausbildung Communication and Multimedia Design hat er Expertise im Entwickeln von Front- und Back-End von Anwendungen erworben. Er ist versiert in Gestaltung, Layout sowie den technischen Aspekten von Programmen und Websites.',
        'In den letzten Jahren hat er viel Erfahrung in der Front-End-Entwicklung gesammelt und sich auf die Erstellung von massgeschneiderten Anwendungen konzentriert, die plattformunabhangig funktionieren.'
      ]
    },
    overview: {
      items: [
        { company: 'Rovecom', role: 'Senior Front-End Developer', period: 'Nov. 2024 - Nov. 2025' },
        { company: 'Uniform agri', role: 'Senior Front-End Developer', period: 'Oct. 2023 - Oct. 2024' },
        { company: 'Newcom', role: 'Senior Front-End Developer', period: 'Sep. 2022 - Sep. 2023' },
        { company: '12Build', role: 'Senior Front-End Developer', period: 'Jan. 2022 - Aug. 2022' },
        { company: 'Into the Source', role: 'Senior Front-End Developer', period: 'Nov. 2020 - Nov. 2021' },
        { company: 'Adivare', role: 'Senior Front-End Developer', period: 'Aug. 2020 - Oct. 2020' },
        { company: 'ING Bank', role: 'Senior Front-End Developer', period: 'Jan. 2019 - Apr. 2019' },
        { company: 'Achmea', role: 'Senior Front-End Developer', period: 'May 2018 - Dec. 2018' },
        { company: 'Raet', role: 'Senior Front-End Developer', period: 'May 2017 - Apr. 2018' },
        { company: 'Belastingdienst', role: 'Senior Front-End Developer', period: 'Dec. 2016 - Apr. 2017' },
        { company: 'Garansys', role: 'Full Stack Developer', period: 'Oct. 2016 - Nov. 2016' },
        { company: 'Noordhoff', role: 'Full Stack Developer', period: 'Feb. 2016 - Jun. 2016' },
        { company: 'Schoolmaster B.V. (Iddink BV)', role: 'Senior Front-End Developer', period: 'Dec. 2013 - Feb. 2016' },
        { company: 'Espria', role: 'Sharepoint Developer', period: 'Apr. 2012 - May 2012' },
        { company: 'Sociale Dienst Walcheren', role: 'Sharepoint Developer', period: 'Oct. 2011 - Mar. 2012' },
        { company: 'Gemeente Groningen', role: 'Application Developer', period: 'Dec. 2011 - Jan. 2012' },
        { company: 'Accell IT', role: 'Web Application Developer', period: 'Jun. 2011 - Oct. 2011' },
        { company: 'Avebe', role: 'Sharepoint Developer', period: 'Mar. 2011 - Apr. 2011' },
        { company: 'Malawi', role: 'Application Developer', period: 'Dec. 2010 - Mar. 2011' }
      ]
    },
    experience: {
      items: [
        {
          id: 'rovecom',
          period: 'Nov. 2024 - Nov. 2025',
          company: 'Rovecom',
          role: 'Senior Front-End Developer',
          responsibilities: 'Rovecom bietet Anwendungen unter anderem fur Tierfutter und Milchproduktion.',
          environment: 'Angular, npm and the Atlassian stack'
        },
        {
          id: 'uniform-agri',
          period: 'Oct. 2023 - Oct. 2024',
          company: 'Uniform agri',
          role: 'Senior Front-End Developer',
          responsibilities: 'Uniform agri unterstutzt Viehhalter mit Software fur Milchvieh.',
          environment: 'Angular, npm and the Atlassian stack'
        },
        {
          id: 'newcom-exploratio',
          period: 'Sep. 2022 - Sep. 2023',
          company: 'Newcom BV / Exploratio',
          role: 'Senior Front-End Developer',
          responsibilities: 'Exploratio ist die Plattform fur Pflegeeinrichtungen und Behorden, um unter anderem Untersuchungen uber Patienten und Burger durchzufuhren und Schlussfolgerungen aus diesen Ergebnissen einzusehen. Exploratio gilt als sehr unterstutzend bei kundenspezifischen Anpassungen und bemuht sich fortlaufend, Kunden noch besser zu unterstutzen.',
          environment: 'Vue, vanilla javascript and the Atlassian stack'
        },
        {
          id: '12build',
          period: 'Jan. 2022 - Aug. 2022',
          company: '12Build BV',
          role: 'Senior Front-End Developer',
          responsibilities: '12Build erleichtert Auftragnehmern grosser Projekte das Finden geeigneter Subunternehmer fur die Umsetzung ihrer Projekte. Mit einer grossen Mehrheit im aktiven Marktsegment streben sie eine Abdeckung von mindestens 70 % in Europa innerhalb eines Zeitraums von 10 Jahren an. Als Senior Developer war es meine Verantwortung, Entscheidungen im Front-End zu treffen und sie gut an bestehenden Legacy-Code im Back-End anzupassen.',
          environment: 'Vue, Vuetify, Jquery, PHP, GitLab, NPM, Jasmine, Linux, Scrum, DevOps, the Atlassian stack.'
        },
        {
          id: 'into-the-source',
          period: 'Nov. 2020 - Nov. 2021',
          company: 'Into the Source',
          role: 'Senior Front-End Developer',
          responsibilities: 'Into the Source ist ein Unternehmen, das eine Vielzahl von Websites fur mittelstandische Unternehmen in Zwolle und Umgebung entwickelt und wartet. Dort habe ich an der Einrichtung eines Immobilien-Tools gearbeitet, mit dem Bewohner, Wohnungsbaugesellschaften, Immobilienunternehmen und Organisationen wie die Feuerwehr und das LAVS Daten austauschen und vertraulich sowie einfach sichtbar machen konnen.',
          environment: 'Angular, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
        },
        {
          id: 'ing',
          period: 'Jan. 2019 - Apr. 2019',
          company: 'ING Bank (seconded via Xlence Companies)',
          role: 'Senior Front-End Developer',
          responsibilities: 'Bei ING war ich als Front-ender fur CRIBS aktiv, das Team, das fur die Verarbeitung, Kontrolle und Lieferung von Adressen verantwortlich ist. Als Front-ender habe ich an UX, generischen Komponenten und beschreibender Dokumentation mitgewirkt. Die Arbeiten reichten von Anpassungen in Legacy-Komponenten bis zum Ausarbeiten von POCs fur neue Funktionalitat fur den belgischen Markt.',
          environment: 'AngularJS, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
        },
        {
          id: 'achmea',
          period: 'May 2018 - Dec. 2018',
          company: 'Achmea (seconded via Xlence Companies)',
          role: 'Senior Front-End Developer',
          responsibilities: 'Die Abteilung Schaden und Einkommen verwaltet verschiedene Teile des Kundenportals. Fur die Berechnung und den Abschluss neuer Policen sowie das Einsehen von Kundendaten wurden mehrere neue Funnels aufgebaut; eine Art interaktive Formulare, die auf die Gewinnung neuer Kunden ausgerichtet sind. Yuri hatte die Aufgabe, Begleitung im Bereich Angular, JavaScript und Nodejs zu bieten sowie Wartungsarbeiten an der alteren SharePoint-Anwendung durchzufuhren.',
          environment: 'TypeScript, Angular, Nodejs, Yarn, gulp, grunt, Angular 4/5/6/7, VSTS(DevOps), Azure, SiteCore, Sharepoint, SourceTree, Selenium, Jasmine, Artifactory, Chocolatey.'
        },
        {
          id: 'raet',
          period: 'May 2017 - Apr. 2018',
          company: 'Raet (seconded via ShareValue)',
          role: 'Senior Front-End Developer',
          responsibilities: 'Fur das Modul UPA (Uniforme Pensioen Aangifte) wurde eine generische Client-Anwendung in Angular aufgebaut, mit der Unternehmen ihre Rentenerklarungen einsehen und verarbeiten konnen. Dieser Client wurde generisch aufgebaut, sodass er ohne grossen Aufwand an andere Module angeschlossen werden kann. Yuri war hier verantwortlich fur die Ausarbeitung und Entwicklung der vollstandigen Client-Anwendung.',
          environment: 'TypeScript, angular-CLI, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular4/5, TFS, WebPack, LoDash.'
        },
        {
          id: 'belastingdienst',
          period: 'Dec. 2016 - Apr. 2017',
          company: 'Belastingdienst (seconded via ShareValue)',
          role: 'Senior Front-End Developer / Consultant',
          responsibilities: 'Um sicherzustellen, dass das Front-End dieser Anwendungen einheitlich und robust gebaut ist, wurde das JavaScript Competence Centre gegrundet. Das JSCC bietet Unterstutzung fur Projekte, die JavaScript und verwandte Techniken verwenden wollen. Yuri wurde wegen seiner Kompetenz mit TypeScript und Erfahrung mit Frameworks wie Angular 2/4 und Polymer hinzugezogen und arbeitete unter anderem an der Dokumentation architektonischer Aspekte, der Definition eines einheitlichen Build-Prozesses und der Implementierung von Single Page Applications.',
          environment: 'JavaScript, TypeScript, IntelliJ, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular 4/5, TFS, Atlassian, Moment.js, WebPack.'
        },
        {
          id: 'garansys',
          period: 'Oct. 2016 - Nov. 2016',
          company: 'Garansys (seconded via Ordina)',
          role: 'Full Stack Developer .net',
          responsibilities: 'Fur Pincvision erhielt Garansys den Auftrag, ein Portal zu erstellen, uber das Deklarationen und Einreichungen verwaltet werden. Yuri wurde relativ kurz vor der Deadline als Frontend-Entwickler hinzugezogen, mit der Hauptaufgabe, ein Aufgabenmodul zu implementieren, Bugs zu beheben und Anpassungen vorzunehmen, die aus fortschreitender Einsicht entstanden sind. Bei Abschluss seiner Arbeiten hat Yuri eine funktionierende, vollstandig getestete und abgenommene Anwendung hinterlassen.',
          environment: 'C#, Entity framework, REST, Angular, MVC, HTML, CSS, Javascript, Angular, Underscore, Moment.js.'
        },
        {
          id: 'noordhoff',
          period: 'Feb. 2016 - Jun. 2016',
          company: 'Noordhoff (seconded via Ordina)',
          role: 'C#.net Developer',
          responsibilities: 'Anfang 2016 trat der UWLR-2.1-Standard offiziell in Kraft. Dieser Standard erleichtert den Austausch von Schuler- und Lernergebnisdaten zwischen Parteien. Yuri sollte von Noordhoff aus verschiedene Anbindungen an Dritte aufsetzen. Hauptziel war es, ein moglichst generisches System aufzubauen, damit auch nach Abschluss seiner Arbeiten Parteien relativ einfach angebunden werden konnen.',
          environment: 'C#, MEF, SOAP, REST, UWLR.'
        },
        {
          id: 'iddink-schoolmaster-2013',
          period: 'Dec. 2013 - Feb. 2016',
          company: 'Iddink B.V. (Schoolmaster B.V.)',
          role: 'Front-End Developer',
          responsibilities: 'Um Magister besser fur Schuler erreichbar zu machen, wurde ein webbasiertes Portal aufgebaut, uber das Schuler und Eltern relevante Ergebnisse und Informationen uber ihren schulischen Fortschritt einsehen konnen.',
          environment: 'HTML, CSS, JavaScript, Jquery, scss/sass, AngularJS 1, TFS, Continuous Integration, TDD, Agile/Scrum, Selenium.'
        },
        {
          id: 'iddink-schoolmaster-2012',
          period: 'Sep. 2012 - Dec. 2013',
          company: 'Iddink BV (Schoolmaster B.V.)',
          role: 'Front-End Developer',
          responsibilities: 'Fur die neue Schuler-Tablet-App Mata hat Yuri das Front-End gebaut. Dazu wurde zunachst die Verbindung zu den Magister-Servern aufgebaut, um anschliessend sicherzustellen, dass die App auf allen verwendeten Plattformen (iPad, Android und ChromeBook) genau gleich aussieht und dieselbe Funktionalitat hat.',
          environment: 'C#, HTML, CSS, JavaScript, TFS, Coffeescript.'
        },
        {
          id: 'espria',
          period: 'Apr. 2012 - May 2012',
          company: 'Espria (via Atos)',
          role: 'SharePoint Developer',
          responsibilities: 'Auf Wunsch von Espria hat Yuri die Moglichkeiten fur die Migration von in Microsoft EPM verwalteten Projekten nach SharePoint 2010 untersucht. Hierzu erstellte er einen Bericht, in dem alle verfugbaren Tools sowie deren Vor- und Nachteile dargestellt werden. Ausserdem arbeitete er an einem Tool, mit dem dies manuell durchgefuhrt werden kann.',
          environment: 'SharePoint 2010, Microsoft EPM, Visual Studio 2010.'
        },
        {
          id: 'sociale-dienst-walcheren',
          period: 'Oct. 2011 - Mar. 2012',
          company: 'Sociale Dienst Walcheren (via Atos)',
          role: 'SharePoint Developer',
          responsibilities: 'Hier wurden von Yuri mehrere Anpassungen im Mitarbeiterportal und im digitalen Schalter umgesetzt, darunter die Anbindung des Systems an einen internen Druckserver, eine Anbindung an die ortliche Kreditbank sowie ein Word-Add-in.',
          environment: 'ASP.Net, SharePoint 2007, Microsoft Office Add-ins, CAML, SQL, Entity Framework, Windows Server 2003.'
        },
        {
          id: 'gemeente-groningen',
          period: 'Dec. 2011 - Jan. 2012',
          company: 'Gemeente Groningen (via Atos)',
          role: 'Application Developer',
          responsibilities: 'Bei der Gemeinde Groningen war Yuri an der Entwicklung des digitalen Schalters beteiligt. Dort lernte er unter anderem, mit Linux und Java zu arbeiten, der damals verwendeten Software fur den digitalen Schalter.',
          environment: 'Java, Linux, SQL.'
        },
        {
          id: 'accell-it',
          period: 'Jun. 2011 - Oct. 2011',
          company: 'Accell IT (via Atos)',
          role: 'Web Application Developer',
          responsibilities: 'Accell IT (IT unter anderem fur Batavus) suchte nach einer Moglichkeit, Unit-Testing auf bestehende Legacy-Software anzuwenden. Yuri richtete ein unabhangig laufendes System ein, das sowohl Unit-Tests als auch Integrationstests automatisch erstellt.',
          environment: 'ASP.Net, C#, Visual Studio, embedded databases, xml, Unit Testing, TFS.'
        },
        {
          id: 'avebe',
          period: 'Mar. 2011 - Apr. 2011',
          company: 'Avebe (via Atos)',
          role: 'Sharepoint Developer',
          responsibilities: 'Hier wurde Yuri beauftragt, mehrere Anpassungen am Mitarbeiterportal von Avebe zu realisieren, darunter der Wechsel von XML zu PDF als verwendetes Dokumentformat.',
          environment: 'SharePoint 2003, C#, SQL, CAML.'
        },
        {
          id: 'malawi',
          period: 'Dec. 2010 - Mar. 2011',
          company: 'Malawi (via Atos)',
          role: 'Application Developer',
          responsibilities: 'In Malawi, Afrika, wurde ein Projekt zur Forderung der Landwirtschaft aufgebaut. Yuri arbeitete am Aufbau der Verwaltungssoftware dafur mit.',
          environment: 'C#, Sharepoint 2010, ASP.Net, SQL, CAML, CQRS, TFS.'
        }
      ]
    },
    skills: {
      groups: [
        {
          title: 'Enterprise',
          items: [
            'SQL / Embedded Databases',
            'JAVA / Spring',
            'MEF',
            'MVCx',
            'C# / Linq / WPF / .net',
            'Visual Studio',
            'NodeJs / NPM',
            'SOAP',
            'REST',
            'CQRS',
            'CURL',
            'Selenium/Xpath~CSS-selectors'
          ]
        },
        {
          title: 'Front-End',
          items: [
            'JavaScript / EcmaScript',
            'TypeScript',
            'Polymer',
            'Adobe CS',
            'JQuery',
            'Xamarin',
            'HTML / CSS',
            'SCSS / SASS',
            'Gulp / Grunt / Bower',
            'Webpack',
            'Jasmine / Chutzpah',
            'Angular (JS, 2/4/5/6/7, CLI)',
            'Vue(2,3)',
            'React/Redux',
            'Rxjs Observables',
            'Lodash/Underscore/Lambda/',
            'moment'
          ]
        },
        {
          title: 'Betriebssysteme & Versionskontrolle',
          items: [
            'Android',
            'TFS / VSTS',
            'Windows',
            'Linux (bash)',
            'Git',
            'SVN',
            'Atlassian (Jira/Bitbucket/Confluence)'
          ]
        },
        {
          title: 'Methoden',
          items: [
            'MVC',
            'Agile / Scrum',
            'RUP',
            'UML',
            'Automated Testing',
            'CI / CD',
            'BDD / DDD / TDD',
            'HATEOAS'
          ]
        }
      ]
    },
    courses: {
      items: [
        'Sitecore',
        '70-480: Programming in HTML5 with JavaScript and CSS3 (Certificate)',
        'Programming in C# (Certificate)',
        'ECMAScript 5.1 (Course)',
        'Training Azure & Cloud Services (Course)',
        'Training Angular (Course)',
        'Web Applications Development (Certificate)',
        'Design Patterns & Web Development (Course)',
        'C#.Net & SharePoint (Certificate)',
        'Entrepreneurship (Course)',
        'Concepting (Course)',
        '3D Design (Course)',
        'Application Development (Course)'
      ]
    }
  };

