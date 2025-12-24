import { ResumeData } from './resume-data.types';

export const resumeDataEn: ResumeData = {
    language: 'en',
    labels: {
      personalia: 'Personal details',
      profile: 'Personal profile',
      overview: 'Condensed work experience',
      experience: 'Work experience',
      skills: 'IT knowledge',
      courses: 'Courses and training',
      environment: 'Environment',
      responsibilities: 'Responsibilities',
      languageToggle: 'Language',
      searchPlaceholder: 'Search across experience, skills, and courses',
      filtersTitle: 'Filters',
      sectionsTitle: 'Sections',
      downloadTitle: 'Download',
      downloadPdf: 'PDF',
      downloadTxt: 'TXT',
      downloadMd: 'MD',
      downloadDocx: 'DOCX',
      adsHide: 'go ad free',
      adsShow: 'show ads',
      adsReveal: 'What ads?',
      expand: 'Details',
      collapse: 'Hide',
      facts: {
        name: 'Name',
        title: 'Role',
        location: 'Location',
        birthDate: 'Date of birth',
        nationality: 'Nationality',
        experienceSince: 'ICT experience',
        maritalStatus: 'Marital status'
      }
    },
    personalia: {
      name: 'Yuri Vaillant',
      title: 'Full-stack Developer',
      location: 'Leeuwarden',
      birthDate: '25-12-1981',
      nationality: 'Dutch',
      experienceSince: 'Since 2007',
      maritalStatus: 'Cohabiting'
    },
    profile: {
      paragraphs: [
        'Yuri is a driven application developer with an eye for detail. He is strong in developing creative solutions for non-standard problems, and therefore always finds a fitting solution for any software problem. He has an integer character, is communicatively skilled, and a calming factor in any situation. He has worked within and for a wide range of organizations, including government, as well as in the financial sector.',
        'Yuri attaches great value to quality in his work. He prefers future-proof applications that meet the client\'s requirements while keeping maintainability and extensibility in view. Through his consistent way of working he ensures applications are built clearly and remain so.',
        'During the Communication and Multimedia Design program he gained expertise in developing both the front and back end of applications. He is skilled in design, layout, and the technical aspects of programs and websites.',
        'In recent years he has gained extensive experience in front-end development and has focused on creating custom applications that function platform independently.'
      ]
    },
    overview: {
      items: [
        { company: 'Rovecom', role: 'Sr. Front-End Developer', period: 'Nov. 2024 - Nov. 2025' },
        { company: 'Uniform agri', role: 'Sr. Front-End Developer', period: 'Oct. 2023 - Oct. 2024' },
        { company: 'Newcom', role: 'Sr. Front-End Developer', period: 'Sep. 2022 - Sep. 2023' },
        { company: '12Build', role: 'Sr. Front-End Developer', period: 'Jan. 2022 - Aug. 2022' },
        { company: 'Into the Source', role: 'Sr. Front-End Developer', period: 'Nov. 2020 - Nov. 2021' },
        { company: 'Adivare', role: 'Sr. Front-End Developer', period: 'Aug. 2020 - Oct. 2020' },
        { company: 'ING Bank', role: 'Sr. Front-End Developer', period: 'Jan. 2019 - Apr. 2019' },
        { company: 'Achmea', role: 'Sr. Front-End Developer', period: 'May 2018 - Dec. 2018' },
        { company: 'Raet', role: 'Sr. Front-End Developer', period: 'May 2017 - Apr. 2018' },
        { company: 'Belastingdienst', role: 'Sr. Front-End Developer', period: 'Dec. 2016 - Apr. 2017' },
        { company: 'Garansys', role: 'Full Stack Developer', period: 'Oct. 2016 - Nov. 2016' },
        { company: 'Noordhoff', role: 'Full Stack Developer', period: 'Feb. 2016 - Jun. 2016' },
        { company: 'Schoolmaster B.V. (Iddink BV)', role: 'Sr. Front-End Developer', period: 'Dec. 2013 - Feb. 2016' },
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
          role: 'Sr. Front-End Developer',
          responsibilities: 'Rovecom provides applications for, among others, animal feed and milk production.',
          environment: 'Angular, npm and the Atlassian stack'
        },
        {
          id: 'uniform-agri',
          period: 'Oct. 2023 - Oct. 2024',
          company: 'Uniform agri',
          role: 'Sr. Front-End Developer',
          responsibilities: 'Uniform agri supports cattle farmers with software for dairy cattle.',
          environment: 'Angular, npm and the Atlassian stack'
        },
        {
          id: 'newcom-exploratio',
          period: 'Sep. 2022 - Sep. 2023',
          company: 'Newcom BV / Exploratio',
          role: 'Sr. Front-End Developer',
          responsibilities: 'Exploratio is the platform for care institutions and government agencies to conduct research into, among other things, patients and citizens, and to view conclusions from those results. Exploratio has a name for being very facilitating in their custom work for clients, and continuously does its best to support clients even better.',
          environment: 'Vue, vanilla javascript and the Atlassian stack'
        },
        {
          id: '12build',
          period: 'Jan. 2022 - August 2022',
          company: '12Build BV',
          role: 'Sr. Front-End Developer',
          responsibilities: '12Build facilitates contractors of large projects in finding suitable subcontractors to realize their projects. With a large majority in the active market segment they aim for coverage of at least 70% across Europe within a 10-year period. As a senior developer it was my responsibility to make front-end choices and align them well with existing legacy code in the back end.',
          environment: 'Vue, Vuetify, Jquery, PHP, GitLab, NPM, Jasmine, Linux, Scrum, DevOps, the Atlassian stack.'
        },
        {
          id: 'into-the-source',
          period: 'Nov. 2020 - Nov. 2021',
          company: 'Into the Source',
          role: 'Sr. Front-End Developer',
          responsibilities: 'Into the source is a company that develops and maintains many sites for mid-sized companies in Zwolle and surrounding areas. Here I worked on setting up a real estate tool through which residents, housing corporations, real estate companies, and agencies such as the fire department and LAVS can exchange data and make it visible in a confidential, simple way.',
          environment: 'Angular, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
        },
        {
          id: 'ing',
          period: 'Jan. 2019 - Apr. 2019',
          company: 'ING Bank (seconded via Xlence Companies)',
          role: 'Sr. Front-End Developer',
          responsibilities: 'At ING I worked as a front-ender for CRIBS, the team responsible for processing, checking and delivering addresses. As a front-ender I contributed to UX, generic components and descriptive documentation. Work ranged from making changes in legacy components to working out POCs for new functionality aimed at the Belgian market.',
          environment: 'AngularJS, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
        },
        {
          id: 'achmea',
          period: 'May 2018 - December 2018',
          company: 'Achmea (seconded via Xlence Companies)',
          role: 'Sr. Front-End Developer',
          responsibilities: 'The Claims and Income department manages various parts of the customer portal. For calculating and closing new policies and viewing customer data, several new funnels were set up; a kind of interactive forms aimed at acquiring new customers. Yuri\'s task was to provide guidance in angular, javascript and nodejs, as well as performing maintenance work on the older sharepoint application.',
          environment: 'TypeScript, Angular, Nodejs, Yarn, gulp, grunt, Angular 4/5/6/7, VSTS(DevOps), Azure, SiteCore, Sharepoint, SourceTree, Selenium, Jasmine, Artifactory, Chocolatey.'
        },
        {
          id: 'raet',
          period: 'May 2017 - April 2018',
          company: 'Raet (seconded via ShareValue)',
          role: 'Sr. Front-End Developer',
          responsibilities: 'For the UPA module (Uniforme Pensioen Aangifte), a generic client application was set up in Angular allowing companies to view and process their pension declarations. This client was set up generically so it could be connected to other modules without much effort. Yuri was responsible for elaborating and developing the complete client application.',
          environment: 'TypeScript, angular-CLI, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular4/5, TFS, WebPack, LoDash.'
        },
        {
          id: 'belastingdienst',
          period: 'December 2016 - April 2017',
          company: 'Belastingdienst (seconded via ShareValue)',
          role: 'Sr. Front-End Developer / Consultant',
          responsibilities: 'To ensure the front end of these applications is built consistently and robustly, the JavaScript Competence Centre was founded. The JSCC supports projects that want to use javascript and related techniques. Yuri was brought in because of his competence with TypeScript and experience with frameworks such as Angular 2/4 and Polymer, and worked on aspects such as documenting architecture, defining a consistent build process, and implementing Single Page Applications.',
          environment: 'JavaScript, TypeScript, IntelliJ, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular 4/5, TFS, Atlassian, Moment.js, WebPack.'
        },
        {
          id: 'garansys',
          period: 'October 2016 - November 2016',
          company: 'Garansys (seconded via Ordina)',
          role: 'Full Stack Developer .net',
          responsibilities: 'For Pincvision, Garansys received the assignment to create a portal through which declarations and filings are managed. Yuri was brought in fairly close to the deadline as a Frontend developer, with the main task of implementing a task module, fixing bugs and making adjustments that arose due to evolving insight. At completion of his work he left a functioning, fully tested and approved application.',
          environment: 'C#, Entity framework, REST, Angular, MVC, HTML, CSS, Javascript, Angular, Underscore, Moment.js.'
        },
        {
          id: 'noordhoff',
          period: 'February 2016 - June 2016',
          company: 'Noordhoff (seconded via Ordina)',
          role: 'C#.net Developer',
          responsibilities: 'In early 2016 the UWLR 2.1 standard officially came into effect. This standard makes it easy for parties to exchange student data and learning results. Yuri was tasked with setting up various connections with third parties from Noordhoff. The main objective was to set up a system as generic as possible so that even after completion of his work parties could be connected relatively easily.',
          environment: 'C#, MEF, SOAP, REST, UWLR.'
        },
        {
          id: 'iddink-schoolmaster-2013',
          period: 'December 2013 - February 2016',
          company: 'Iddink B.V. (Schoolmaster B.V.)',
          role: 'Front-End Developer',
          responsibilities: 'To make Magister more accessible to students, a web-based portal was created where students and parents can view relevant results and information about their progress at school.',
          environment: 'HTML, CSS, JavaScript, Jquery, scss/sass, AngularJS 1, TFS, Continuous Integration, TDD, Agile/Scrum, Selenium.'
        },
        {
          id: 'iddink-schoolmaster-2012',
          period: 'September 2012 - December 2013',
          company: 'Iddink BV (Schoolmaster B.V.)',
          role: 'Front-End Developer',
          responsibilities: 'For the new student tablet app, Mata, Yuri built the front end. For this the connection to the Magister Servers was first set up, and then the app was made to look and function exactly the same on all platforms used (iPad, Android and ChromeBook).',
          environment: 'C#, HTML, CSS, JavaScript, TFS, Coffeescript.'
        },
        {
          id: 'espria',
          period: 'April 2012 - May 2012',
          company: 'Espria (via Atos)',
          role: 'SharePoint Developer',
          responsibilities: 'At the request of Espria, Yuri looked into the possibilities for migrating projects managed in Microsoft EPM to SharePoint 2010. To this end he created a report outlining all available tools and their pros and cons. In addition, he worked on a tool that enables this to be done manually.',
          environment: 'SharePoint 2010, Microsoft EPM, Visual Studio 2010.'
        },
        {
          id: 'sociale-dienst-walcheren',
          period: 'October 2011 - March 2012',
          company: 'Sociale Dienst Walcheren (via Atos)',
          role: 'SharePoint Developer',
          responsibilities: 'Here Yuri implemented several changes in the employee portal and the digital counter, including linking the system to an internal print server, a link with the local credit bank, and a Word add-in.',
          environment: 'ASP.Net, SharePoint 2007, Microsoft Office Add-ins, CAML, SQL, Entity Framework, Windows Server 2003.'
        },
        {
          id: 'gemeente-groningen',
          period: 'December 2011 - January 2012',
          company: 'Gemeente Groningen (via Atos)',
          role: 'Application Developer',
          responsibilities: 'At the Municipality of Groningen, Yuri was involved in the development of the digital counter. Here he learned to work with Linux and Java, at that time the software used for the digital counter.',
          environment: 'Java, Linux, SQL.'
        },
        {
          id: 'accell-it',
          period: 'June 2011 - October 2011',
          company: 'Accell IT (via Atos)',
          role: 'Web Application Developer',
          responsibilities: 'Accell IT (IT for among others Batavus) sought the possibility to apply unit testing to existing legacy software. Yuri set up an independent system that automatically creates both unit tests and integration tests.',
          environment: 'ASP.Net, C#, Visual Studio, embedded databases, xml, Unit Testing, TFS.'
        },
        {
          id: 'avebe',
          period: 'March 2011 - April 2011',
          company: 'Avebe (via Atos)',
          role: 'Sharepoint Developer',
          responsibilities: 'Here Yuri was engaged to implement several adjustments to the Avebe employee portal, including the switch from XML to PDF as the document format used.',
          environment: 'SharePoint 2003, C#, SQL, CAML.'
        },
        {
          id: 'malawi',
          period: 'December 2010 - March 2011',
          company: 'Malawi (via Atos)',
          role: 'Application Developer',
          responsibilities: 'In Malawi, Africa a project was set up to stimulate agriculture. Yuri contributed to setting up the administrative software for this.',
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
