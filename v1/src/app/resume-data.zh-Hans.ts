import { ResumeData } from './resume-data.types';

export const resumeDataZhHans: ResumeData = {
  language: 'zh-Hans',
  labels: {
    personalia: '个人信息',
    profile: '个人简介',
    overview: '工作经历概要',
    experience: '工作经历',
    skills: 'IT 技能',
    courses: '课程与培训',
    environment: '环境',
    responsibilities: '工作内容',
    languageToggle: '语言',
    searchPlaceholder: '在经历、技能和课程中搜索',
    filtersTitle: '筛选',
    sectionsTitle: '板块',
    downloadTitle: '下载',
    downloadPdf: 'PDF',
    downloadTxt: 'TXT',
    downloadMd: 'MD',
    downloadDocx: 'DOCX',
    adsHide: '无广告模式',
    adsShow: '显示广告',
    expand: '详情',
    collapse: '收起',
    facts: {
      name: '姓名',
      title: '职位',
      location: '居住地',
      birthDate: '出生日期',
      nationality: '国籍',
      experienceSince: 'ICT 经验',
      maritalStatus: '婚姻状况'
    }
  },
  personalia: {
    name: 'Yuri Vaillant',
    title: '全栈开发者',
    location: 'Leeuwarden',
    birthDate: '25-12-1981',
    nationality: '荷兰',
    experienceSince: '自2007年起',
    maritalStatus: '同居'
  },
  profile: {
    paragraphs: [
      'Yuri 是一位注重细节的积极应用开发者。他擅长为非常规问题开发富有创意的解决方案，因此总能为每个软件问题找到合适的解决方案。他品行正直，沟通能力强，在任何情况下都能带来稳定与镇定。他曾在广泛的组织中工作并为其服务，包括政府部门，也在金融行业工作。',
      'Yuri 非常重视工作的质量。他更倾向于构建面向未来的应用，满足客户要求，同时不忽视可维护性与可扩展性。通过他一致的工作方式，确保应用结构清晰并保持清晰。',
      '在 Communication and Multimedia Design 的学习期间，他在应用的前端和后端开发方面都积累了专业能力。他在设计、排版以及程序和网站的技术层面都很擅长。',
      '近年来，他在前端开发方面积累了大量经验，并专注于构建可跨平台运行的定制应用。'
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
        responsibilities: 'Rovecom 提供的应用涵盖动物饲料和乳制品生产等领域。',
        environment: 'Angular, npm and the Atlassian stack'
      },
      {
        id: 'uniform-agri',
        period: 'Oct. 2023 - Oct. 2024',
        company: 'Uniform agri',
        role: 'Senior Front-End Developer',
        responsibilities: 'Uniform agri 通过面向奶牛养殖的软件支持牧场主。',
        environment: 'Angular, npm and the Atlassian stack'
      },
      {
        id: 'newcom-exploratio',
        period: 'Sep. 2022 - Sep. 2023',
        company: 'Newcom BV / Exploratio',
        role: 'Senior Front-End Developer',
        responsibilities: 'Exploratio 是面向医疗机构和政府部门的平台，用于开展关于患者和公民等主题的调查，并查看这些调查结果的结论。Exploratio 以在客户定制方面非常支持而著称，并持续努力更好地支持客户。',
        environment: 'Vue, vanilla javascript and the Atlassian stack'
      },
      {
        id: '12build',
        period: 'Jan. 2022 - Aug. 2022',
        company: '12Build BV',
        role: 'Senior Front-End Developer',
        responsibilities: '12Build 为大型项目承包商提供平台，帮助寻找合适的分包商来实现其项目。凭借在活跃市场细分中的较大份额，他们计划在10年内在欧洲实现至少70%的覆盖率。作为高级开发人员，我负责前端方面的决策，并使其与后端现有的遗留代码良好匹配。',
        environment: 'Vue, Vuetify, Jquery, PHP, GitLab, NPM, Jasmine, Linux, Scrum, DevOps, the Atlassian stack.'
      },
      {
        id: 'into-the-source',
        period: 'Nov. 2020 - Nov. 2021',
        company: 'Into the Source',
        role: 'Senior Front-End Developer',
        responsibilities: 'Into the Source 是一家为 Zwolle 及周边中型企业开发并维护众多网站的公司。我在那里参与搭建一款房地产工具，使居民、住房公司、房地产企业以及消防部门和 LAVS 等机构能够以保密且简单的方式交换并呈现数据。',
        environment: 'Angular, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
      },
      {
        id: 'ing',
        period: 'Jan. 2019 - Apr. 2019',
        company: 'ING Bank (seconded via Xlence Companies)',
        role: 'Senior Front-End Developer',
        responsibilities: '在 ING，我作为前端开发人员加入 CRIBS 团队，该团队负责地址的处理、核对和交付。作为前端开发，我参与 UX、通用组件和说明性文档。工作内容从修改遗留组件到为面向比利时市场的新功能制作 POC。',
        environment: 'AngularJS, Polymer, lit-html, GitLab, NPM, Jasmine, confluence, Linux, Scrum, DevOps, Artifactory, Jenkins, bower.'
      },
      {
        id: 'achmea',
        period: 'May 2018 - Dec. 2018',
        company: 'Achmea (seconded via Xlence Companies)',
        role: 'Senior Front-End Developer',
        responsibilities: '索赔与收入部门负责客户门户的多个部分。为计算并签订新保单以及查看客户数据，搭建了多个新的漏斗；一种用于吸引新客户的交互式表单。Yuri 的任务是就 angular、javascript 和 nodejs 提供指导，并对旧的 sharepoint 应用进行维护工作。',
        environment: 'TypeScript, Angular, Nodejs, Yarn, gulp, grunt, Angular 4/5/6/7, VSTS(DevOps), Azure, SiteCore, Sharepoint, SourceTree, Selenium, Jasmine, Artifactory, Chocolatey.'
      },
      {
        id: 'raet',
        period: 'May 2017 - Apr. 2018',
        company: 'Raet (seconded via ShareValue)',
        role: 'Senior Front-End Developer',
        responsibilities: '针对 UPA（Uniforme Pensioen Aangifte）模块，构建了一个基于 Angular 的通用客户端应用，使企业能够查看并处理其养老金申报。该客户端以通用方式构建，便于无缝连接到其他模块。Yuri 负责该客户端应用的整体设计与开发。',
        environment: 'TypeScript, angular-CLI, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular4/5, TFS, WebPack, LoDash.'
      },
      {
        id: 'belastingdienst',
        period: 'Dec. 2016 - Apr. 2017',
        company: 'Belastingdienst (seconded via ShareValue)',
        role: 'Senior Front-End Developer / Consultant',
        responsibilities: '为确保这些应用的前端构建一致且稳健，成立了 JavaScript Competence Centre。JSCC 为希望使用 javascript 及相关技术的项目提供支持。Yuri 因其 TypeScript 能力以及在 Angular 2/4 和 Polymer 等框架上的经验而被引入，并参与了架构要素的记录、统一构建流程的定义以及单页应用的实现等工作。',
        environment: 'JavaScript, TypeScript, IntelliJ, webkit, NPM, Gulp, ES2015, ES2016, REST, Polymer, Angular 4/5, TFS, Atlassian, Moment.js, WebPack.'
      },
      {
        id: 'garansys',
        period: 'Oct. 2016 - Nov. 2016',
        company: 'Garansys (seconded via Ordina)',
        role: 'Full Stack Developer .net',
        responsibilities: '针对 Pincvision，Garansys 接到建立一个用于管理申报和提交的门户的任务。Yuri 在截止日期前不久作为前端开发人员加入，主要负责实现任务模块、修复缺陷以及进行因持续洞察产生的调整。在完成工作时，他留下了一个功能完备、经过全面测试并被认可的应用。',
        environment: 'C#, Entity framework, REST, Angular, MVC, HTML, CSS, Javascript, Angular, Underscore, Moment.js.'
      },
      {
        id: 'noordhoff',
        period: 'Feb. 2016 - Jun. 2016',
        company: 'Noordhoff (seconded via Ordina)',
        role: 'C#.net Developer',
        responsibilities: '2016 年初，UWLR 2.1 标准正式生效。该标准使各方能够更容易地交换学生数据和学习成果。Yuri 的任务是从 Noordhoff 与第三方建立多种连接。主要目标是构建尽可能通用的系统，使得在他完成工作后，各方仍能相对容易地进行对接。',
        environment: 'C#, MEF, SOAP, REST, UWLR.'
      },
      {
        id: 'iddink-schoolmaster-2013',
        period: 'Dec. 2013 - Feb. 2016',
        company: 'Iddink B.V. (Schoolmaster B.V.)',
        role: 'Front-End Developer',
        responsibilities: '为使 Magister 更易于学生访问，构建了一个基于 Web 的门户，学生和家长可以在其中查看与学业进度相关的结果和信息。',
        environment: 'HTML, CSS, JavaScript, Jquery, scss/sass, AngularJS 1, TFS, Continuous Integration, TDD, Agile/Scrum, Selenium.'
      },
      {
        id: 'iddink-schoolmaster-2012',
        period: 'Sep. 2012 - Dec. 2013',
        company: 'Iddink BV (Schoolmaster B.V.)',
        role: 'Front-End Developer',
        responsibilities: '针对新的平板学生应用 Mata，Yuri 构建了前端。为此先建立与 Magister 服务器的连接，然后确保应用在所有使用的平台（iPad、Android 和 ChromeBook）上外观一致并具有相同功能。',
        environment: 'C#, HTML, CSS, JavaScript, TFS, Coffeescript.'
      },
      {
        id: 'espria',
        period: 'Apr. 2012 - May 2012',
        company: 'Espria (via Atos)',
        role: 'SharePoint Developer',
        responsibilities: '应 Espria 的要求，Yuri 研究了将 Microsoft EPM 中管理的项目迁移到 SharePoint 2010 的可能性。为此他编写了一份报告，列出所有可用工具及其优缺点。此外，他还开发了一种可手动完成迁移的工具。',
        environment: 'SharePoint 2010, Microsoft EPM, Visual Studio 2010.'
      },
      {
        id: 'sociale-dienst-walcheren',
        period: 'Oct. 2011 - Mar. 2012',
        company: 'Sociale Dienst Walcheren (via Atos)',
        role: 'SharePoint Developer',
        responsibilities: 'Yuri 在员工门户和数字柜台上实现了多项调整，包括将系统连接到内部打印服务器、与当地信用银行的连接以及一个 Word 加载项。',
        environment: 'ASP.Net, SharePoint 2007, Microsoft Office Add-ins, CAML, SQL, Entity Framework, Windows Server 2003.'
      },
      {
        id: 'gemeente-groningen',
        period: 'Dec. 2011 - Jan. 2012',
        company: 'Gemeente Groningen (via Atos)',
        role: 'Application Developer',
        responsibilities: '在格罗宁根市政厅，Yuri 参与了数字柜台的开发。在那里他学习了 Linux 和 Java，当时数字柜台使用的就是这些软件。',
        environment: 'Java, Linux, SQL.'
      },
      {
        id: 'accell-it',
        period: 'Jun. 2011 - Oct. 2011',
        company: 'Accell IT (via Atos)',
        role: 'Web Application Developer',
        responsibilities: 'Accell IT（为 Batavus 等提供 IT 服务）希望对现有遗留软件应用单元测试。Yuri 搭建了一个独立运行的系统，能够自动生成单元测试和集成测试。',
        environment: 'ASP.Net, C#, Visual Studio, embedded databases, xml, Unit Testing, TFS.'
      },
      {
        id: 'avebe',
        period: 'Mar. 2011 - Apr. 2011',
        company: 'Avebe (via Atos)',
        role: 'Sharepoint Developer',
        responsibilities: 'Yuri 受邀对 Avebe 员工门户进行多项调整，包括将使用的文档格式从 XML 切换为 PDF。',
        environment: 'SharePoint 2003, C#, SQL, CAML.'
      },
      {
        id: 'malawi',
        period: 'Dec. 2010 - Mar. 2011',
        company: 'Malawi (via Atos)',
        role: 'Application Developer',
        responsibilities: '在非洲的马拉维开展了一个促进农业的项目。Yuri 参与构建该项目的行政管理软件。',
        environment: 'C#, Sharepoint 2010, ASP.Net, SQL, CAML, CQRS, TFS.'
      }
    ]
  },
  skills: {
    groups: [
      {
        title: '企业',
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
        title: '前端',
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
        title: '操作系统与版本控制',
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
        title: '方法论',
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
