var viewControls = (function() {
    // Private methods and properties
    let debugMode = true;
    const buttonColors = {blue: '#34495E', red: 'FF0000',green: '34495E',white:'CF2A27'};
    let backURL;
    var _doc = document; // Store document object as a private variable
    var sections = {
      toptitle: _doc.querySelector('.toptitle'),
      displaySectionOne: _doc.querySelector('.displaySectionOne'),
      displaySectionTwo: _doc.querySelector('.displaySectionTwo'),
      displaySectionThree: _doc.querySelector('.displaySectionThree'),
      welcomeCitizenSection: _doc.querySelector('.welcomeCitizenSection')
    };
  
    
    function getSections()
    {
      return sections;
    }

    function actionCreateassessment() {

      assessmentCreate.show();

    
    }
    function goback() {
      window.history.back();
    }

    function actionBackAssessment()
    {
      goback();
    }

    function actionStartAnAssessment()
    {
      assessmentConduct.show();

    }

    function gobackto(urlpath)
    {
      backURL=urlpath; //window.location.href = urlpath;

      const buttonBack = document.querySelector('.back-button');
      buttonBack.addEventListener('click',smartGoback);
    } 
   
    function smartGoback()
    {
      
      if(backURL=="view")
      {
        viewControls.updateTitleText("Welcome to Assessments");
        assessmentView.show();

      }else if(backURL=="conduct")
      {
        assessmentConduct.show();
      }
      else if(backURL=="main")
      {
        assessmentCreate.showStartscreen();
      }else
      {
        window.location.href =backURL; 
      }
   
    }

    return {
      init: function() {
        console.log("viewControls has been loaded!");
      },

      addButton: function(buttonName,actionViewassessment,color,subSection)
      {
        var button = _doc.createElement('button');
        button.setAttribute('id', button+'-'+buttonName);
        button.setAttribute('type', 'button');
        button.setAttribute('class', 'btn btn-primary rounded-pill myButton_create');
        button.setAttribute('style', 'background-color:'+color+'; font-weight: bold; letter-spacing: 0.5px; text-shadow: none; border: none; outline: none; border-radius: 5px;');
        button.addEventListener('click', actionViewassessment);
        button.textContent = buttonName;
        sections = viewControls.getAllSections();
        subSection.appendChild(button);
        subSection.style.textAlign = 'center';
        

        
        // var button = _doc.createElement('button');
        // button.setAttribute('id', button+'-'+buttonName);
        // button.setAttribute('type', 'button');
        // button.setAttribute('class', 'myButton_create');
        // button.setAttribute('style', 'background-color:'+color+';\
        // color: white;\
        // border: none;\
        // padding: 10px 20px;\
        // text-align: center;\
        // text-decoration: none;\
        // display: inline-block;\
        // font-size: 16px;\
        // margin: 4px 2px;\
        // cursor: pointer;');
        // button.addEventListener('click', actionViewassessment);
        // button.textContent = buttonName;
        // sections = viewControls.getAllSections();
        // subSection.appendChild(button);
        // subSection.style.textAlign = 'center';
        return button;
      },
      clearTitleText:function()
      {
        var topheader = document.querySelector('.active');
        topheader.innerText = '';
        topheader.style.color = 'white';
      },
      updateTitleText:function(message)
      {
        var topheader = document.querySelector('.active');
        topheader.innerText = message;
        topheader.style.color = 'white';
      },
      Clear:function() {

        sections.toptitle = _doc.querySelector('.toptitle');
        sections.toptitle.innerHTML = '';
        
        sections.displaySectionOne = _doc.querySelector('.displaySectionOne');
        sections.displaySectionOne.innerHTML = '';

        sections.displaySectionTwo = _doc.querySelector('.displaySectionTwo');
        sections.displaySectionTwo.innerHTML = '';

        sections.displaySectionThree = _doc.querySelector('.displaySectionThree');
        sections.displaySectionThree.innerHTML = '';

        sections.displaySectionFour = _doc.querySelector('.displaySectionFour');
        sections.displaySectionFour.innerHTML = '';
        

        sections.welcomeCitizenSection = _doc.querySelector('.welcomeCitizenSection');
        sections.welcomeCitizenSection.innerHTML = '';
        this.log("screen cleared");
        return sections;
      },
      addbuttonStartAnAssessment: function() {
        viewControls.addButton('Conduct or View Assesments',actionStartAnAssessment,
        viewControls.getColors().blue,sections.displaySectionFour);
      },
      addbuttonCreateAssessment: function() {
        viewControls.addButton('Manage Assessments',actionCreateassessment,
        viewControls.getColors().green,sections.displaySectionFour);

      },
  
      addbuttonBackAssessment: function() {
       
        viewControls.addButton('Back',actionBackAssessment,
        viewControls.getColors().white,sections.displaySectionFour);
      },
      log: function(msg) {
        if(debugMode)
        {
          console.log(msg);
        }
      },
      updateBackbuton: function(path) {
        gobackto(path);

      },
      loadwelcomeTitle: function(userMessage,textMessage) {
        sections.toptitle = _doc.querySelector('.toptitle');
        var welcomeMessage = "<h3>" + (userMessage ? userMessage : "") + "</h3>" + "<p>" + (textMessage ? textMessage : "") + "</p>";
        sections.toptitle.innerHTML = welcomeMessage;
        this.log("loadwelcomeTitle- created");

        return welcomeMessage;
      },
      getColors: function(){return buttonColors},
      getAllSections: function()
      {
        return getSections();
      },
      showMainscreen: function() {

        viewControls.updateTitleText("Create or Conduct a Self Assessment");
        viewControls.updateBackbuton("/ESN_directory_page");
        viewControls.Clear();
        viewControls.loadwelcomeTitle("Assessments Main Menu:","Please make a selection below:");
        viewControls.addbuttonCreateAssessment();
        viewControls.addbuttonStartAnAssessment();
        viewControls.addbuttonBackAssessment();
      },
    };

    
  })();
  
  