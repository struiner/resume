import { ResumeData } from './resume-data.types';

export const resumeDataNl: ResumeData = {
    language: 'nl',
    labels: {
      personalia: 'Personalia',
      profile: 'Persoonlijk profiel',
      overview: 'Verkort overzicht werkervaring',
      experience: 'Werkervaring',
      skills: 'IT kennis',
      courses: 'Cursussen en opleidingen',
      environment: 'Omgeving',
      responsibilities: 'Werkzaamheden',
      languageToggle: 'Taal',
      searchPlaceholder: 'Zoek in ervaring, vaardigheden en opleidingen',
      filtersTitle: 'Filters',
      sectionsTitle: 'Secties',
      downloadTitle: 'Download',
      downloadPdf: 'PDF',
      downloadTxt: 'TXT',
      downloadMd: 'MD',
      downloadDocx: 'DOCX',
      adsHide: 'ga advertentievrij',
      adsShow: 'toon advertenties',
      adsReveal: 'Welke advertenties?',
      expand: 'Details',
      collapse: 'Verbergen',
      facts: {
        name: 'Naam',
        title: 'Functie',
        location: 'Woonplaats',
        birthDate: 'Geboortedatum',
        nationality: 'Nationaliteit',
        experienceSince: 'ICT werkervaring',
        maritalStatus: 'Burgerlijke staat',
        favoriteColor: 'Favoriete kleur',
        favoriteFramework: 'Favoriete framework',
        driversLicense: 'Rijbewijs'
      }
    },
    personalia: {
      name: 'Yuri Vaillant',
      title: 'Full-stack Developer',
      location: 'Leeuwarden',
      birthDate: '25-12-1981',
      nationality: 'Nederlands',
      experienceSince: 'Sinds 2007',
      maritalStatus: 'Samenwonend',
      favoriteColor: 'Groen',
      favoriteFramework: 'Angular',
      driversLicense: 'B'
    },
    profile: {
      paragraphs: [
        'Yuri is een gedreven applicatieontwikkelaar met een scherp oog voor detail. Hij blinkt uit in het bedenken van creatieve oplossingen voor complexe en niet-alledaagse vraagstukken en weet softwarematige uitdagingen steevast te vertalen naar doordachte, werkbare oplossingen. Met zijn integere karakter, sterke communicatieve vaardigheden en kalme houding is hij een stabiele en prettige factor binnen elk team. Yuri heeft ervaring opgedaan binnen een breed scala aan organisaties, variërend van de overheid tot de financiële sector.',
        'Kwaliteit staat centraal in zijn werk. Yuri richt zich bij voorkeur op toekomstbestendige applicaties die niet alleen voldoen aan de wensen van de opdrachtgever, maar ook goed onderhoudbaar en eenvoudig uitbreidbaar zijn. Door zijn gestructureerde en consistente werkwijze bouwt hij applicaties die overzichtelijk blijven, ook op de lange termijn.',
        'Tijdens zijn opleiding Communicatie en Multimedia Design heeft Yuri zich ontwikkeld tot een allround developer met kennis van zowel front-end als back-end ontwikkeling. Hij combineert gevoel voor vormgeving en lay-out met een solide technische basis, waardoor hij complete en goed doordachte applicaties en websites realiseert.',
        'In de afgelopen jaren heeft Yuri zich verder gespecialiseerd in front-end ontwikkeling en het bouwen van maatwerkapplicaties die platformonafhankelijk functioneren. Daarbij verliest hij gebruiksvriendelijkheid, performance en duurzaamheid nooit uit het oog.'
      ]
    },
    overview: {
      items: [
        { company: 'Rovecom', role: 'Sr. Front-End Developer', period: 'Nov. 2024 - Nov. 2025' },
        { company: 'Uniform agri', role: 'Sr. Front-End Developer', period: 'Okt. 2023 - Okt. 2024' },
        { company: 'Newcom', role: 'Sr. Front-End Developer', period: 'Sep. 2022 - Sep. 2023' },
        { company: '12Build', role: 'Sr. Front-End Developer', period: 'Jan. 2022 - Aug. 2022' },
        { company: 'Into the Source', role: 'Sr. Front-End Developer', period: 'Nov. 2020 - Nov. 2021' },
        { company: 'Adivare', role: 'Sr. Front-End Developer', period: 'Aug. 2020 - Okt. 2020' },
        { company: 'ING Bank', role: 'Sr. Front-End Developer', period: 'Jan. 2019 - Apr. 2019' },
        { company: 'Achmea', role: 'Sr. Front-End Developer', period: 'Mei 2018 - Dec. 2018' },
        { company: 'Raet', role: 'Sr. Front-End Developer', period: 'Mei 2017 - Apr. 2018' },
        { company: 'Belastingdienst', role: 'Sr. Front-End Developer', period: 'Dec. 2016 - Apr. 2017' },
        { company: 'Garansys', role: 'Full Stack Developer', period: 'Okt. 2016 - Nov. 2016' },
        { company: 'Noordhoff', role: 'Full Stack Developer', period: 'Feb. 2016 - Jun. 2016' },
        { company: 'Schoolmaster B.V. (Iddink BV)', role: 'Sr. Front-End Developer', period: 'Dec. 2013 - Feb. 2016' },
        { company: 'Espria', role: 'Sharepoint Developer', period: 'Apr. 2012 - Mei 2012' },
        { company: 'Sociale Dienst Walcheren', role: 'Sharepoint Developer', period: 'Okt. 2011 - Mrt. 2012' },
        { company: 'Gemeente Groningen', role: 'Application Developer', period: 'Dec. 2011 - Jan. 2012' },
        { company: 'Accell IT', role: 'Web Application Developer', period: 'Jun. 2011 - Okt. 2011' },
        { company: 'Avebe', role: 'Sharepoint Developer', period: 'Mrt. 2011 - Apr. 2011' },
        { company: 'Malawi', role: 'Application Developer', period: 'Dec. 2010 - Mrt. 2011' }
      ]
    },
    experience: {
      items: [
        {
          id: 'rovecom',
          period: 'Nov. 2024 - Nov. 2025',
          company: 'Rovecom',
          role: 'Sr. Front-End Developer',
          responsibilities: 'Rovecom bied toepassingen voor onder andere diervoeders en melkproductie.',
          environment: 'Angular, npm en de Atlassian stack'
        },
        {
          id: 'uniform-agri',
          period: 'Okt. 2023 - Okt. 2024',
          company: 'Uniform agri',
          role: 'Sr. Front-End Developer',
          responsibilities: 'Uniform agri ondersteund veehouders met software voor melkvee.',
          environment: 'Angular, npm en de Atlassian stack'
        },
        {
          id: 'newcom-exploratio',
          period: 'Sep. 2022 - Sep. 2023',
          company: 'Newcom BV / Exploratio',
          role: 'Sr. Front-End Developer',
          responsibilities: 'Exploratio is het platform voor zorginstellingen en overheidsinstanties om onderzoeken over onder andere patienten en burgers uit te voeren en om conclusies aan de resultaten van deze onderzoeken in te zien. Exploratio heeft een naam erg faciliterend te zijn in hun maatwerk naar klanten, en doet voortdurend haar best om klanten nog beter te faciliteren.',
          environment: 'Vue, vanilla javascript en de Atlassian stack'
        },
        {
          id: '12build',
          period: 'Jan. 2022 - Augustus 2022',
          company: '12Build BV',
          role: 'Sr. Front-End Developer',
          responsibilities: '12Build faciliteert aannemers van grote projecten in het vinden van geschikte subcontractors voor het realiseren van hun projecten. Met een ruime meerderheid binnen het actieve marktsegment ambieren ze een dekking van minimaal 70% over europa binnen een periode van 10 jaar. Als senior developer was het mijn verantwoordelijkheid keuzes te maken op front-end gebied, en deze goed aan te laten sluiten op reeds bestaande legacy code in de back-end.',
          environment: 'Vue, Vuetify, Jquery, PHP, GitLab, NPM, Jasmine, Linux, Scrum, DevOps, de Atlassian stack.'
        },
        {
          id: 'into-the-source',
          period: 'Nov. 2020 - Nov. 2021',
          company: 'Into the Source',
          role: 'Sr. Front-End Developer',
          responsibilities: 'Into the source is een onderneming die een legio aan sites ontwikkeld en onderhoud voor middelgrote bedrijven in Zwolle en omstreken. Hier ben ik aan de slag gegaan met het opzetten van een vastgoed-tool waarmee zowel bewoners, woningcorporaties, vastgoedondernemingen en instanties zoals bijvoorbeeld de brandweer en het LAVS gegevens kunnen uitwisselen en inzichtelijk maken op een vertrouwelijke, simpele manier.',
          environment: 'Angular, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
        },
        {
          id: 'ing',
          period: 'Jan. 2019 - Apr. 2019',
          company: 'ING Bank (gedetacheerd via Xlence Companies)',
          role: 'Sr. Front-End Developer',
          responsibilities: 'Bij ING ben ik actief geweest als front-ender voor CRIBS, het team wat verantwoordelijk is voor de verwerking, controle en aanlevering van adressen. Als front-ender dacht ik mee over UX, generieke componenten en beschrijvende documentatie. Werkzaamheden varieerden van aanpassingen maken in legacy componenten tot POC\'s uitwerken voor nieuwe functionaliteit gericht op de Belgische markt.',
          environment: 'AngularJS, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
        },
        {
          id: 'achmea',
          period: 'Mei 2018 - December 2018',
          company: 'Achmea (gedetacheerd via Xlence Companies)',
          role: 'Sr. Front-End Developer',
          responsibilities: 'De afdeling Schade en Inkomen heeft verscheidene onderdelen van het klantportaal onder zijn beheer. Voor het berekenen en afsluiten van nieuwe polissen en het inzien van klantgegevens zijn een aantal nieuwe funnels opgezet; een soort interactieve formulieren, gericht op het verwerven van nieuwe klanten. Het was Yuri\'s taak om begeleiding te bieden op het gebied van angular, javascript en nodejs, alsmede het doen van onderhoudswerkzaamheden aan de oudere sharepoint applicatie.',
          environment: 'TypeScript, Angular, Nodejs, Yarn, gulp, grunt, Angular 4/5/6/7, VSTS(DevOps), Azure, SiteCore, Sharepoint, SourceTree, Selenium, Jasmine, Artifactory, Chocolatey.'
        },
        {
          id: 'raet',
          period: 'Mei 2017 - April 2018',
          company: 'Raet (gedetacheerd via ShareValue)',
          role: 'Sr. Front-End Developer',
          responsibilities: 'Voor de module UPA (Uniforme Pensioen Aangifte) is een generieke client applicatie opgezet in Angular waarmee bedrijven hun pensioen declaraties kunnen inzien en verwerken. Deze client werd generiek opgezet, zodat deze zonder veel moeite aangesloten kan worden op andere modules. Yuri is hier verantwoordelijk voor het uitwerken en ontwikkelen van de volledige client applicatie.',
          environment: 'TypeScript, angular-CLI, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular4/5, TFS, WebPack, LoDash.'
        },
        {
          id: 'belastingdienst',
          period: 'December 2016 - April 2017',
          company: 'Belastingdienst (gedetacheerd via ShareValue)',
          role: 'Sr. Front-End Developer / Consultant',
          responsibilities: 'Om er zorg voor te dragen dat de front-end van deze applicaties eenduidig en robuust gebouwd is, is het JavaScript Competence Centre opgericht. Het JSCC biedt ondersteuning aan projecten die gebruik willen maken van javascript en verwante technieken. Yuri is hier bijgehaald vanwege zijn competentie met TypeScript en ervaring met frameworks zoals Angular 2/4 en Polymer, en heeft onder andere gewerkt aan het vastleggen van architecturale aspecten, het definieren van een eenduidig bouwproces, het implementeren van Single Page Applications.',
          environment: 'JavaScript, TypeScript, IntelliJ, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular 4/5, TFS, Atlassian, Moment.js, WebPack.'
        },
        {
          id: 'garansys',
          period: 'Oktober 2016 - November 2016',
          company: 'Garansys (gedetacheerd via Ordina)',
          role: 'Full Stack Developer .net',
          responsibilities: 'Voor Pincvision heeft Garansys de opdracht gekregen een portaal te maken waarmee declaraties en aangiftes worden beheerd. Yuri is hier redelijk kort voor de deadline ingeschakeld als Frontend developer, met als voornaamste taak het implementeren van een taken-module, het repareren van bugs en het maken van aanpassingen die zijn ontstaan uit voortschrijdend inzicht. Bij afronding van zijn werkzaamheden heeft Yuri hier een functionerend, volledig getest en goed bevonden applicatie achter gelaten.',
          environment: 'C#, Entity framework, REST, Angular, MVC, HTML, CSS, Javascript, Angular, Underscore, Moment.js.'
        },
        {
          id: 'noordhoff',
          period: 'Februari 2016 - Juni 2016',
          company: 'Noordhoff (gedetacheerd via Ordina)',
          role: 'C#.net Developer',
          responsibilities: 'Begin 2016 is de UWLR 2.1 standaard officieel van kracht. Deze standaard maakt het voor partijen eenvoudig om leerlinggegevens en leerresultaten uit te wisselen. Het was aan Yuri om vanuit Noordhoff diverse koppelingen op te zetten met derden. Hoofdzaak was een zo generiek mogelijk systeem op te zetten zodat ook na het afronden van zijn werkzaamheden vrij eenvoudig partijen konden worden gekoppeld.',
          environment: 'C#, MEF, SOAP, REST, UWLR.'
        },
        {
          id: 'iddink-schoolmaster-2013',
          period: 'December 2013 - Februari 2016',
          company: 'Iddink B.V. (Schoolmaster B.V.)',
          role: 'Front-End Developer',
          responsibilities: 'Om Magister beter bereikbaar te maken voor leerlingen is ingezet op een web-based portaal waarop leerlingen en ouders relevante resultaten en informatie kunnen inzien over hun voortgang op school.',
          environment: 'HTML, CSS, JavaScript, Jquery, scss/sass, AngularJS 1, TFS, Continuous Integration, TDD, Agile/Scrum, Selenium.'
        },
        {
          id: 'iddink-schoolmaster-2012',
          period: 'September 2012 - December 2013',
          company: 'Iddink BV (Schoolmaster B.V.)',
          role: 'Front-End Developer',
          responsibilities: 'Voor de nieuwe leerlingen app voor tablets, Mata, heeft Yuri de front end gebouwd. Hiervoor is eerst de verbinding met de Magister Servers opgezet, om er vervolgens voor te zorgen dat de app er op alle gebruikte platformen (iPad, Android en ChromeBook) precies hetzelfde uitziet, en dezelfde functionaliteit heeft.',
          environment: 'C#, HTML, CSS, JavaScript, TFS, Coffeescript.'
        },
        {
          id: 'espria',
          period: 'April 2012 - Mei 2012',
          company: 'Espria (via Atos)',
          role: 'SharePoint Developer',
          responsibilities: 'Op verzoek van Espria heeft Yuri gekeken naar de mogelijkheden voor de migratie van projecten beheerd in Microsoft EPM naar SharePoint 2010. Hiertoe heeft hij een rapport opgesteld waarin alle beschikbare tools en hun voor en nadelen uiteen worden gezet. Daarnaast heeft hij gewerkt aan een tool waarmee dit handmatig gedaan kan worden.',
          environment: 'SharePoint 2010, Microsoft EPM, Visual Studio 2010.'
        },
        {
          id: 'sociale-dienst-walcheren',
          period: 'Oktober 2011 - Maart 2012',
          company: 'Sociale Dienst Walcheren (via Atos)',
          role: 'SharePoint Developer',
          responsibilities: 'Hier is door Yuri een aantal aanpassingen gerealiseerd in het medewerkerportaal en het digitale loket, waaronder de koppeling van het systeem met een interne printserver, een koppeling met de plaatselijke kredietbank en een Word add-in.',
          environment: 'ASP.Net, SharePoint 2007, Microsoft Office Add-ins, CAML, SQL, Entity Framework, Windows Server 2003.'
        },
        {
          id: 'gemeente-groningen',
          period: 'December 2011 - Januari 2012',
          company: 'Gemeente Groningen (via Atos)',
          role: 'Application Developer',
          responsibilities: 'Bij de Gemeente Groningen is Yuri betrokken bij de ontwikkeling van het digitale loket. Hier heeft hij onder andere met Linux en Java leren werken, op dat moment de software die gebruikt werd voor het digitale loket.',
          environment: 'Java, Linux, SQL.'
        },
        {
          id: 'accell-it',
          period: 'Juni 2011 - Oktober 2011',
          company: 'Accell IT (via Atos)',
          role: 'Web Application Developer',
          responsibilities: 'Accell IT (IT voor onder meer Batavus) zocht naar de mogelijkheid om unit-testing toe te passen op bestaande legacy software. Yuri heeft een onafhankelijk draaiend systeem opgezet dat zowel Unit-Tests als Integratie Tests automatisch aanmaakt.',
          environment: 'ASP.Net, C#, Visual Studio, embedded databases, xml, Unit Testing, TFS.'
        },
        {
          id: 'avebe',
          period: 'Maart 2011 - April 2011',
          company: 'Avebe (via Atos)',
          role: 'Sharepoint Developer',
          responsibilities: 'Hier is Yuri ingeschakeld voor het realiseren van een aantal aanpassingen aan het medewerkerportaal van Avebe, waaronder de overstap van XML naar PDF als gebruikt documentformaat.',
          environment: 'SharePoint 2003, C#, SQL, CAML.'
        },
        {
          id: 'malawi',
          period: 'December 2010 - Maart 2011',
          company: 'Malawi (via Atos)',
          role: 'Application Developer',
          responsibilities: 'In Malawi, Afrika is een project opgezet om landbouw te stimuleren. Yuri heeft meegewerkt aan het opzetten van de administratieve software hiervoor.',
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
          title: 'OS & Source Control',
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
          title: 'Methodieken',
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
        '70-480: Programming in HTML5 with JavaScript and CSS3 (Certificaat)',
        'Programming in C# (Certificaat)',
        'ECMAScript 5.1 (Cursus)',
        'Training Azure & Cloud Services (Cursus)',
        'Training Angular (Cursus)',
        'Web Applications Development (Certificaat)',
        'Design Patterns & Web Development (Cursus)',
        'C#.Net & SharePoint (Certificaat)',
        'Ondernemen (Cursus)',
        'Concepting (Cursus)',
        '3D Design (Cursus)',
        'Application Development (Cursus)'
      ]
    }
  };
