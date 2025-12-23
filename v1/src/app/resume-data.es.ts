import { ResumeData } from './resume-data.types';

export const resumeDataEs: ResumeData = {
  language: 'es',
  labels: {
    personalia: 'Datos personales',
    profile: 'Perfil personal',
    overview: 'Resumen de experiencia laboral',
    experience: 'Experiencia laboral',
    skills: 'Conocimientos IT',
    courses: 'Cursos y formaciones',
    environment: 'Entorno',
    responsibilities: 'Actividades',
    languageToggle: 'Idioma',
    searchPlaceholder: 'Buscar en experiencia, habilidades y cursos',
    filtersTitle: 'Filtros',
    sectionsTitle: 'Secciones',
    downloadTitle: 'Descargar',
    downloadPdf: 'PDF',
    downloadTxt: 'TXT',
    downloadMd: 'MD',
    downloadDocx: 'DOCX',
    expand: 'Detalles',
    collapse: 'Ocultar',
    facts: {
      name: 'Nombre',
      title: 'Funcion',
      location: 'Lugar',
      birthDate: 'Fecha de nacimiento',
      nationality: 'Nacionalidad',
      experienceSince: 'Experiencia ICT',
      maritalStatus: 'Estado civil'
    }
  },
  personalia: {
    name: 'Yuri Vaillant',
    title: 'Desarrollador full-stack',
    location: 'Leeuwarden',
    birthDate: '25-12-1981',
    nationality: 'Neerlandes',
    experienceSince: 'Desde 2007',
    maritalStatus: 'En convivencia'
  },
  profile: {
    paragraphs: [
      'Yuri es un desarrollador de aplicaciones motivado y detallista. Es fuerte en el desarrollo de soluciones creativas para problemas poco habituales y siempre encuentra una solucion adecuada para cada problema de software. Tiene un caracter integro, se comunica bien y es un factor de calma en cualquier situacion. Ha trabajado dentro y para una amplia variedad de organizaciones, incluida la Administracion publica, asi como en el sector financiero.',
      'Yuri valora mucho la calidad en su trabajo. Prefiere aplicaciones preparadas para el futuro que cumplan los requisitos del cliente sin perder de vista el mantenimiento y la extensibilidad. Gracias a su forma de trabajar consistente, consigue que las aplicaciones esten construidas de forma clara y lo sigan estando.',
      'Durante la formacion en Communication and Multimedia Design adquirio experiencia en el desarrollo tanto del front-end como del back-end de aplicaciones. Es competente en diseno, maquetacion y aspectos tecnicos de programas y sitios web.',
      'En los ultimos anos ha adquirido mucha experiencia en desarrollo front-end y se ha centrado en crear aplicaciones a medida que funcionan de manera independiente de la plataforma.'
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
        responsibilities: 'Rovecom ofrece aplicaciones, entre otras, para piensos y produccion de leche.',
        environment: 'Angular, npm and the Atlassian stack'
      },
      {
        id: 'uniform-agri',
        period: 'Oct. 2023 - Oct. 2024',
        company: 'Uniform agri',
        role: 'Senior Front-End Developer',
        responsibilities: 'Uniform agri apoya a los ganaderos con software para ganado lechero.',
        environment: 'Angular, npm and the Atlassian stack'
      },
      {
        id: 'newcom-exploratio',
        period: 'Sep. 2022 - Sep. 2023',
        company: 'Newcom BV / Exploratio',
        role: 'Senior Front-End Developer',
        responsibilities: 'Exploratio es la plataforma para instituciones sanitarias y organismos publicos para realizar investigaciones sobre, entre otras cosas, pacientes y ciudadanos, y para ver conclusiones a partir de los resultados de esas investigaciones. Exploratio tiene fama de ser muy facilitador en su personalizacion para clientes y hace continuamente todo lo posible por apoyar aun mejor a los clientes.',
        environment: 'Vue, vanilla javascript and the Atlassian stack'
      },
      {
        id: '12build',
        period: 'Jan. 2022 - Aug. 2022',
        company: '12Build BV',
        role: 'Senior Front-End Developer',
        responsibilities: '12Build facilita a los contratistas de grandes proyectos encontrar subcontratistas adecuados para realizar sus proyectos. Con una amplia mayoria dentro del segmento de mercado activo, aspiran a una cobertura de al menos el 70 % en Europa en un periodo de 10 anos. Como desarrollador senior, era mi responsabilidad tomar decisiones en el front-end y alinearlas bien con el codigo legacy existente en el back-end.',
        environment: 'Vue, Vuetify, Jquery, PHP, GitLab, NPM, Jasmine, Linux, Scrum, DevOps, the Atlassian stack.'
      },
      {
        id: 'into-the-source',
        period: 'Nov. 2020 - Nov. 2021',
        company: 'Into the Source',
        role: 'Senior Front-End Developer',
        responsibilities: 'Into the Source es una empresa que desarrolla y mantiene una gran cantidad de sitios para empresas medianas en Zwolle y alrededores. Alli me puse a trabajar en la creacion de una herramienta inmobiliaria con la que residentes, corporaciones de vivienda, empresas inmobiliarias y organismos como los bomberos y el LAVS pueden intercambiar datos y hacerlos visibles de manera confidencial y sencilla.',
        environment: 'Angular, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
      },
      {
        id: 'ing',
        period: 'Jan. 2019 - Apr. 2019',
        company: 'ING Bank (seconded via Xlence Companies)',
        role: 'Senior Front-End Developer',
        responsibilities: 'En ING trabaje como front-ender para CRIBS, el equipo responsable del procesamiento, control y entrega de direcciones. Como front-ender aporte a la UX, componentes genericos y documentacion descriptiva. Las tareas variaron desde ajustes en componentes legacy hasta elaborar POC para nuevas funcionalidades destinadas al mercado belga.',
        environment: 'AngularJS, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
      },
      {
        id: 'achmea',
        period: 'May 2018 - Dec. 2018',
        company: 'Achmea (seconded via Xlence Companies)',
        role: 'Senior Front-End Developer',
        responsibilities: 'El departamento de Danos e Ingresos gestiona varias partes del portal del cliente. Para calcular y contratar nuevas polizas y consultar datos de clientes, se crearon varios funnels nuevos; una especie de formularios interactivos orientados a captar nuevos clientes. La tarea de Yuri fue brindar apoyo en angular, javascript y nodejs, asi como realizar trabajos de mantenimiento en la antigua aplicacion de sharepoint.',
        environment: 'TypeScript, Angular, Nodejs, Yarn, gulp, grunt, Angular 4/5/6/7, VSTS(DevOps), Azure, SiteCore, Sharepoint, SourceTree, Selenium, Jasmine, Artifactory, Chocolatey.'
      },
      {
        id: 'raet',
        period: 'May 2017 - Apr. 2018',
        company: 'Raet (seconded via ShareValue)',
        role: 'Senior Front-End Developer',
        responsibilities: 'Para el modulo UPA (Uniforme Pensioen Aangifte) se creo una aplicacion cliente generica en Angular con la que las empresas pueden ver y procesar sus declaraciones de pension. Este cliente se creo de forma generica para poder conectarse a otros modulos sin mucho esfuerzo. Yuri fue responsable de elaborar y desarrollar la aplicacion cliente completa.',
        environment: 'TypeScript, angular-CLI, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular4/5, TFS, WebPack, LoDash.'
      },
      {
        id: 'belastingdienst',
        period: 'Dec. 2016 - Apr. 2017',
        company: 'Belastingdienst (seconded via ShareValue)',
        role: 'Senior Front-End Developer / Consultant',
        responsibilities: 'Para garantizar que el front-end de estas aplicaciones se construya de manera uniforme y robusta, se creo el JavaScript Competence Centre. El JSCC ofrece apoyo a proyectos que quieren utilizar javascript y tecnicas relacionadas. Yuri fue incorporado por su competencia con TypeScript y experiencia con frameworks como Angular 2/4 y Polymer, y trabajo, entre otras cosas, en documentar aspectos arquitectonicos, definir un proceso de build uniforme e implementar Single Page Applications.',
        environment: 'JavaScript, TypeScript, IntelliJ, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular 4/5, TFS, Atlassian, Moment.js, WebPack.'
      },
      {
        id: 'garansys',
        period: 'Oct. 2016 - Nov. 2016',
        company: 'Garansys (seconded via Ordina)',
        role: 'Full Stack Developer .net',
        responsibilities: 'Para Pincvision, Garansys recibio el encargo de crear un portal con el que se gestionan declaraciones y presentaciones. Yuri fue incorporado relativamente cerca del plazo como desarrollador front-end, con la principal tarea de implementar un modulo de tareas, corregir bugs y realizar ajustes surgidos por una vision en evolucion. Al finalizar su trabajo dejo una aplicacion funcional, totalmente probada y aprobada.',
        environment: 'C#, Entity framework, REST, Angular, MVC, HTML, CSS, Javascript, Angular, Underscore, Moment.js.'
      },
      {
        id: 'noordhoff',
        period: 'Feb. 2016 - Jun. 2016',
        company: 'Noordhoff (seconded via Ordina)',
        role: 'C#.net Developer',
        responsibilities: 'A principios de 2016 el estandar UWLR 2.1 entro oficialmente en vigor. Este estandar facilita a las partes el intercambio de datos de alumnos y resultados de aprendizaje. Yuri debia configurar desde Noordhoff diversas conexiones con terceros. El objetivo principal era crear un sistema lo mas generico posible para que, incluso despues de finalizar su trabajo, se pudieran conectar partes con relativa facilidad.',
        environment: 'C#, MEF, SOAP, REST, UWLR.'
      },
      {
        id: 'iddink-schoolmaster-2013',
        period: 'Dec. 2013 - Feb. 2016',
        company: 'Iddink B.V. (Schoolmaster B.V.)',
        role: 'Front-End Developer',
        responsibilities: 'Para hacer Magister mas accesible para los alumnos se creo un portal web en el que alumnos y padres pueden consultar resultados e informacion relevantes sobre su progreso escolar.',
        environment: 'HTML, CSS, JavaScript, Jquery, scss/sass, AngularJS 1, TFS, Continuous Integration, TDD, Agile/Scrum, Selenium.'
      },
      {
        id: 'iddink-schoolmaster-2012',
        period: 'Sep. 2012 - Dec. 2013',
        company: 'Iddink BV (Schoolmaster B.V.)',
        role: 'Front-End Developer',
        responsibilities: 'Para la nueva app de alumnos para tabletas, Mata, Yuri construyo el front-end. Para ello primero se establecio la conexion con los servidores de Magister, y luego se garantizo que la app se viera exactamente igual y tuviera la misma funcionalidad en todas las plataformas usadas (iPad, Android y ChromeBook).',
        environment: 'C#, HTML, CSS, JavaScript, TFS, Coffeescript.'
      },
      {
        id: 'espria',
        period: 'Apr. 2012 - May 2012',
        company: 'Espria (via Atos)',
        role: 'SharePoint Developer',
        responsibilities: 'A peticion de Espria, Yuri investigo las posibilidades de migracion de proyectos gestionados en Microsoft EPM a SharePoint 2010. Para ello elaboro un informe en el que se detallan todas las herramientas disponibles y sus ventajas y desventajas. Ademas, trabajo en una herramienta con la que esto puede hacerse manualmente.',
        environment: 'SharePoint 2010, Microsoft EPM, Visual Studio 2010.'
      },
      {
        id: 'sociale-dienst-walcheren',
        period: 'Oct. 2011 - Mar. 2012',
        company: 'Sociale Dienst Walcheren (via Atos)',
        role: 'SharePoint Developer',
        responsibilities: 'Aqui Yuri realizo varias adaptaciones en el portal de empleados y el mostrador digital, incluida la conexion del sistema con un servidor de impresion interno, una conexion con el banco de credito local y un complemento de Word.',
        environment: 'ASP.Net, SharePoint 2007, Microsoft Office Add-ins, CAML, SQL, Entity Framework, Windows Server 2003.'
      },
      {
        id: 'gemeente-groningen',
        period: 'Dec. 2011 - Jan. 2012',
        company: 'Gemeente Groningen (via Atos)',
        role: 'Application Developer',
        responsibilities: 'En el Ayuntamiento de Groningen, Yuri participo en el desarrollo del mostrador digital. Alli aprendio, entre otras cosas, a trabajar con Linux y Java, el software que se utilizaba en ese momento para el mostrador digital.',
        environment: 'Java, Linux, SQL.'
      },
      {
        id: 'accell-it',
        period: 'Jun. 2011 - Oct. 2011',
        company: 'Accell IT (via Atos)',
        role: 'Web Application Developer',
        responsibilities: 'Accell IT (IT entre otros para Batavus) buscaba la posibilidad de aplicar unit-testing a software legacy existente. Yuri configuro un sistema independiente que genera automaticamente tanto pruebas unitarias como pruebas de integracion.',
        environment: 'ASP.Net, C#, Visual Studio, embedded databases, xml, Unit Testing, TFS.'
      },
      {
        id: 'avebe',
        period: 'Mar. 2011 - Apr. 2011',
        company: 'Avebe (via Atos)',
        role: 'Sharepoint Developer',
        responsibilities: 'Aqui Yuri fue contratado para realizar varias adaptaciones en el portal de empleados de Avebe, incluida la transicion de XML a PDF como formato de documento utilizado.',
        environment: 'SharePoint 2003, C#, SQL, CAML.'
      },
      {
        id: 'malawi',
        period: 'Dec. 2010 - Mar. 2011',
        company: 'Malawi (via Atos)',
        role: 'Application Developer',
        responsibilities: 'En Malawi, Africa, se puso en marcha un proyecto para estimular la agricultura. Yuri colaboro en la puesta en marcha del software administrativo para este proyecto.',
        environment: 'C#, Sharepoint 2010, ASP.Net, SQL, CAML, CQRS, TFS.'
      }
    ]
  },
  skills: {
    groups: [
      {
        title: 'Empresa',
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
        title: 'SO y control de versiones',
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
        title: 'Metodologias',
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
