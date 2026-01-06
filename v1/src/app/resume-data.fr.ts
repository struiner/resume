import { ResumeData } from './resume-data.types';

export const resumeDataFr: ResumeData = {
    language: 'fr',
    labels: {
      personalia: 'Informations personnelles',
      profile: 'Profil personnel',
      overview: 'Apercu synthetique de l\'experience',
      experience: 'Experience professionnelle',
      skills: 'Connaissances IT',
      courses: 'Cours et formations',
      environment: 'Environnement',
      responsibilities: 'Activites',
      languageToggle: 'Langue',
      searchPlaceholder: 'Rechercher dans l\'experience, les competences et les formations',
      filtersTitle: 'Filtres',
      sectionsTitle: 'Sections',
      downloadTitle: 'Telecharger',
      downloadPdf: 'PDF',
      downloadTxt: 'TXT',
      downloadMd: 'MD',
      downloadDocx: 'DOCX',
      adsHide: 'aller sans pub',
      adsShow: 'afficher les pubs',
      adsReveal: 'Quelles pubs ?',
      expand: 'Details',
      collapse: 'Masquer',
      facts: {
        name: 'Nom',
        title: 'Fonction',
        location: 'Lieu',
        birthDate: 'Date de naissance',
        nationality: 'Nationalite',
        experienceSince: 'Experience ICT',
        maritalStatus: 'Etat civil',
        favoriteColor: 'Couleur preferee',
        favoriteFramework: 'Framework prefere',
        driversLicense: 'Permis de conduire'
      }
    },
    personalia: {
      name: 'Yuri Vaillant',
      title: 'Developpeur full-stack',
      location: 'Leeuwarden',
      birthDate: '25-12-1981',
      nationality: 'Neerlandais',
      experienceSince: 'Depuis 2007',
      maritalStatus: 'En concubinage',
      favoriteColor: 'Vert',
      favoriteFramework: 'Angular',
      driversLicense: 'B'
    },
    profile: {
      paragraphs: [
        'Yuri est un developpeur d\'applications motive avec le souci du detail. Il est fort dans le developpement de solutions creatives pour des problemes non ordinaires et trouve donc toujours une solution adaptee a chaque probleme logiciel. Il a un caractere integre, est communicatif et un facteur apaisant dans chaque situation. Il a travaille au sein et pour un large eventail d\'organisations, notamment l\'Etat, mais aussi dans le secteur financier.',
        'Yuri attache une grande importance a la qualite de son travail. Il privilegie des applications perennes qui repondent aux exigences du client tout en gardant a l\'esprit la maintenabilite et l\'extensibilite. Grace a sa maniere de travailler coherente, il veille a ce que les applications soient et restent construites de maniere claire.',
        'Pendant la formation Communication and Multimedia Design, il a acquis une expertise dans le developpement du front-end comme du back-end des applications. Il est competent en conception, mise en page et aspects techniques des programmes et des sites web.',
        'Ces dernieres annees, il a acquis une grande experience en developpement front-end et s\'est concentre sur la creation d\'applications sur mesure qui fonctionnent independamment de la plateforme.'
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
          responsibilities: 'Rovecom propose des applications notamment pour les aliments pour animaux et la production laitiere.',
          environment: 'Angular, npm and the Atlassian stack'
        },
        {
          id: 'uniform-agri',
          period: 'Oct. 2023 - Oct. 2024',
          company: 'Uniform agri',
          role: 'Senior Front-End Developer',
          responsibilities: 'Uniform agri soutient les eleveurs avec des logiciels pour le betail laitier.',
          environment: 'Angular, npm and the Atlassian stack'
        },
        {
          id: 'newcom-exploratio',
          period: 'Sep. 2022 - Sep. 2023',
          company: 'Newcom BV / Exploratio',
          role: 'Senior Front-End Developer',
          responsibilities: 'Exploratio est la plateforme pour les etablissements de soins et les organismes publics afin de mener des recherches, entre autres, sur des patients et des citoyens, et pour consulter les conclusions issues de ces resultats. Exploratio a la reputation d\'etre tres facilitant dans la personnalisation pour les clients et fait continuellement de son mieux pour les accompagner encore mieux.',
          environment: 'Vue, vanilla javascript and the Atlassian stack'
        },
        {
          id: '12build',
          period: 'Jan. 2022 - Aug. 2022',
          company: '12Build BV',
          role: 'Senior Front-End Developer',
          responsibilities: '12Build facilite les entrepreneurs de grands projets dans la recherche de sous-traitants adaptes pour realiser leurs projets. Avec une large majorite sur le segment actif du marche, ils ambitionnent une couverture d\'au moins 70 % en Europe sur une periode de 10 ans. En tant que developpeur senior, j\'avais la responsabilite de faire des choix front-end et de bien les faire correspondre au code legacy existant en back-end.',
          environment: 'Vue, Vuetify, Jquery, PHP, GitLab, NPM, Jasmine, Linux, Scrum, DevOps, the Atlassian stack.'
        },
        {
          id: 'into-the-source',
          period: 'Nov. 2020 - Nov. 2021',
          company: 'Into the Source',
          role: 'Senior Front-End Developer',
          responsibilities: 'Into the Source est une entreprise qui developpe et maintient de nombreux sites pour des entreprises de taille moyenne a Zwolle et dans les environs. J\'y ai travaille sur la mise en place d\'un outil immobilier permettant aux residents, aux societes de logement, aux entreprises immobilieres et a des organismes comme les pompiers et le LAVS d\'echanger des donnees et de les rendre visibles de maniere confidentielle et simple.',
          environment: 'Angular, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
        },
        {
          id: 'ing',
          period: 'Jan. 2019 - Apr. 2019',
          company: 'ING Bank (seconded via Xlence Companies)',
          role: 'Senior Front-End Developer',
          responsibilities: 'Chez ING, j\'ai ete actif comme front-ender pour CRIBS, l\'equipe responsable du traitement, du controle et de la livraison des adresses. En tant que front-ender, j\'ai contribue a l\'UX, aux composants generiques et a la documentation descriptive. Les travaux allaient d\'ajustements dans des composants legacy a l\'elaboration de POC pour de nouvelles fonctionnalites destinees au marche belge.',
          environment: 'AngularJS, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
        },
        {
          id: 'achmea',
          period: 'May 2018 - Dec. 2018',
          company: 'Achmea (seconded via Xlence Companies)',
          role: 'Senior Front-End Developer',
          responsibilities: 'Le departement Sinistres et Revenus gere plusieurs parties du portail client. Pour le calcul et la souscription de nouvelles polices ainsi que la consultation des donnees client, plusieurs nouveaux funnels ont ete mis en place; une sorte de formulaires interactifs visant a acquerir de nouveaux clients. La tache de Yuri etait d\'offrir un accompagnement sur angular, javascript et nodejs, ainsi que d\'effectuer la maintenance de l\'ancienne application sharepoint.',
          environment: 'TypeScript, Angular, Nodejs, Yarn, gulp, grunt, Angular 4/5/6/7, VSTS(DevOps), Azure, SiteCore, Sharepoint, SourceTree, Selenium, Jasmine, Artifactory, Chocolatey.'
        },
        {
          id: 'raet',
          period: 'May 2017 - Apr. 2018',
          company: 'Raet (seconded via ShareValue)',
          role: 'Senior Front-End Developer',
          responsibilities: 'Pour le module UPA (Uniforme Pensioen Aangifte), une application client generique a ete realisee en Angular permettant aux entreprises de consulter et de traiter leurs declarations de pension. Cette application client a ete concue de maniere generique afin d\'etre raccordee facilement a d\'autres modules. Yuri etait responsable de la conception et du developpement complet de l\'application client.',
          environment: 'TypeScript, angular-CLI, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular4/5, TFS, WebPack, LoDash.'
        },
        {
          id: 'belastingdienst',
          period: 'Dec. 2016 - Apr. 2017',
          company: 'Belastingdienst (seconded via ShareValue)',
          role: 'Senior Front-End Developer / Consultant',
          responsibilities: 'Afin de garantir que le front-end de ces applications soit construit de maniere uniforme et robuste, le JavaScript Competence Centre a ete cree. Le JSCC offre un soutien aux projets qui souhaitent utiliser javascript et des techniques associees. Yuri a ete recrute en raison de sa competence en TypeScript et de son experience avec des frameworks tels qu\'Angular 2/4 et Polymer, et a notamment travaille sur la documentation des aspects architecturaux, la definition d\'un processus de build uniforme et l\'implementation de Single Page Applications.',
          environment: 'JavaScript, TypeScript, IntelliJ, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular 4/5, TFS, Atlassian, Moment.js, WebPack.'
        },
        {
          id: 'garansys',
          period: 'Oct. 2016 - Nov. 2016',
          company: 'Garansys (seconded via Ordina)',
          role: 'Full Stack Developer .net',
          responsibilities: 'Pour Pincvision, Garansys a recu la mission de creer un portail permettant de gerer les declarations et les depots. Yuri a ete integre assez peu avant la date limite en tant que developpeur front-end, avec pour tache principale l\'implementation d\'un module de taches, la correction de bugs et la realisation de modifications issues d\'une evolution des besoins. A l\'issue de sa mission, il a laisse une application fonctionnelle, entierement testee et approuvee.',
          environment: 'C#, Entity framework, REST, Angular, MVC, HTML, CSS, Javascript, Angular, Underscore, Moment.js.'
        },
        {
          id: 'noordhoff',
          period: 'Feb. 2016 - Jun. 2016',
          company: 'Noordhoff (seconded via Ordina)',
          role: 'C#.net Developer',
          responsibilities: 'Debut 2016, la norme UWLR 2.1 est officiellement entree en vigueur. Cette norme facilite l\'echange de donnees d\'eleves et de resultats scolaires entre les parties. Yuri devait mettre en place depuis Noordhoff diverses connexions avec des tiers. L\'objectif principal etait de mettre en place un systeme aussi generique que possible afin que, meme apres la fin de ses travaux, des parties puissent etre connectees relativement facilement.',
          environment: 'C#, MEF, SOAP, REST, UWLR.'
        },
        {
          id: 'iddink-schoolmaster-2013',
          period: 'Dec. 2013 - Feb. 2016',
          company: 'Iddink B.V. (Schoolmaster B.V.)',
          role: 'Front-End Developer',
          responsibilities: 'Pour rendre Magister plus accessible aux eleves, un portail web a ete mis en place permettant aux eleves et aux parents de consulter des resultats et des informations pertinents sur leur progression scolaire.',
          environment: 'HTML, CSS, JavaScript, Jquery, scss/sass, AngularJS 1, TFS, Continuous Integration, TDD, Agile/Scrum, Selenium.'
        },
        {
          id: 'iddink-schoolmaster-2012',
          period: 'Sep. 2012 - Dec. 2013',
          company: 'Iddink BV (Schoolmaster B.V.)',
          role: 'Front-End Developer',
          responsibilities: 'Pour la nouvelle application eleves pour tablettes, Mata, Yuri a realise le front-end. Pour cela, la connexion aux serveurs Magister a d\'abord ete mise en place, puis l\'application a ete rendue identique en apparence et en fonctionnement sur toutes les plateformes utilisees (iPad, Android et ChromeBook).',
          environment: 'C#, HTML, CSS, JavaScript, TFS, Coffeescript.'
        },
        {
          id: 'espria',
          period: 'Apr. 2012 - May 2012',
          company: 'Espria (via Atos)',
          role: 'SharePoint Developer',
          responsibilities: 'A la demande d\'Espria, Yuri a etudie les possibilites de migration des projets geres dans Microsoft EPM vers SharePoint 2010. Pour cela, il a etabli un rapport exposant tous les outils disponibles et leurs avantages et inconvenients. En outre, il a travaille sur un outil permettant de le faire manuellement.',
          environment: 'SharePoint 2010, Microsoft EPM, Visual Studio 2010.'
        },
        {
          id: 'sociale-dienst-walcheren',
          period: 'Oct. 2011 - Mar. 2012',
          company: 'Sociale Dienst Walcheren (via Atos)',
          role: 'SharePoint Developer',
          responsibilities: 'Yuri a realise plusieurs adaptations dans le portail des employes et le guichet numerique, notamment la connexion du systeme a un serveur d\'impression interne, une connexion avec la banque de credit locale et un add-in Word.',
          environment: 'ASP.Net, SharePoint 2007, Microsoft Office Add-ins, CAML, SQL, Entity Framework, Windows Server 2003.'
        },
        {
          id: 'gemeente-groningen',
          period: 'Dec. 2011 - Jan. 2012',
          company: 'Gemeente Groningen (via Atos)',
          role: 'Application Developer',
          responsibilities: 'A la commune de Groningen, Yuri a participe au developpement du guichet numerique. Il y a notamment appris a travailler avec Linux et Java, les logiciels utilises a l\'epoque pour le guichet numerique.',
          environment: 'Java, Linux, SQL.'
        },
        {
          id: 'accell-it',
          period: 'Jun. 2011 - Oct. 2011',
          company: 'Accell IT (via Atos)',
          role: 'Web Application Developer',
          responsibilities: 'Accell IT (IT notamment pour Batavus) cherchait a mettre en place des tests unitaires sur des logiciels legacy existants. Yuri a mis en place un systeme autonome qui cree automatiquement des tests unitaires et des tests d\'integration.',
          environment: 'ASP.Net, C#, Visual Studio, embedded databases, xml, Unit Testing, TFS.'
        },
        {
          id: 'avebe',
          period: 'Mar. 2011 - Apr. 2011',
          company: 'Avebe (via Atos)',
          role: 'Sharepoint Developer',
          responsibilities: 'Yuri a ete engage pour realiser plusieurs adaptations du portail des employes d\'Avebe, dont le passage de XML a PDF comme format de document utilise.',
          environment: 'SharePoint 2003, C#, SQL, CAML.'
        },
        {
          id: 'malawi',
          period: 'Dec. 2010 - Mar. 2011',
          company: 'Malawi (via Atos)',
          role: 'Application Developer',
          responsibilities: 'Au Malawi, en Afrique, un projet a ete mis en place pour stimuler l\'agriculture. Yuri a participe a la mise en place du logiciel administratif pour ce projet.',
          environment: 'C#, Sharepoint 2010, ASP.Net, SQL, CAML, CQRS, TFS.'
        }
      ]
    },
    skills: {
      groups: [
        {
          title: 'Entreprise',
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
          title: 'OS & controle de source',
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
          title: 'Methodologies',
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
