var assessmentView = (function() {
    let testResults;
    var _doc = document; // Store document object as a private variable
    function actionDiscardassessment()
    {
      assessmentDelete.show(testResults);
    }

    function actionViewassessment()
    {
      assessmentConduct.show();
    }


    function createScreen(testResults)
    {

      const testResultsdata=testResults;
      viewControls.Clear();
      viewControls.updateTitleText("View a Self Assessment");
      sections = viewControls.getAllSections();

      const title = document.createElement('h2');
      title.textContent = 'Assessment Results:';
      sections.displaySectionOne.appendChild(title);
      sections.displaySectionOne.style.textAlign = 'center';



      const textArea = document.createElement('textarea');
      textArea.setAttribute('rows', '5');
      textArea.setAttribute('cols', '50');
      textArea.style.resize = 'none';

      textArea.placeholder = testResultsdata;
      sections.displaySectionTwo.appendChild(textArea);
      sections.displaySectionTwo.style.textAlign = 'center';

      
      viewControls.addButton('Done',actionViewassessment,
      viewControls.getColors().green,sections.displaySectionThree);

      viewControls.addButton('Discard',actionDiscardassessment,
      viewControls.getColors().red,sections.displaySectionFour);
      
    }



    
    function createScreenPostTest()
    {
      viewControls.updateTitleText("View a Create an Assessment");
      viewControls.Clear();
      sections = viewControls.getAllSections();

      const title = document.createElement('h2');
      title.textContent = 'Assessment Results:';
      sections.displaySectionOne.appendChild(title);
      sections.displaySectionOne.style.textAlign = 'center';

      const textArea = document.createElement('textarea');
      textArea.setAttribute('rows', '5');
      textArea.setAttribute('cols', '50');
      textArea.style.resize = 'none';

      textArea.placeholder = 'Enter assessment details';
      sections.displaySectionTwo.appendChild(textArea);
      sections.displaySectionTwo.style.textAlign = 'center';

      
      viewControls.addButton('Submit Assessment Results',actionViewassessment,
      viewControls.getColors().green,sections.displaySectionThree);
      viewControls.addButton('Discard',actionDiscardassessment,
      viewControls.getColors().red,sections.displaySectionFour);
    }


    return {
      init: function() {
        console.log("assessmentView has been loaded!");
      },
      showPostTest: function()
      {
        createScreenPostTest();
      },
      show: function(testresultsloc) 
      {

       testResults=testresultsloc;


        viewControls.updateTitleText("Conduct Assessments");
        viewControls.updateBackbuton("conduct");
        createScreen(testResults);
      }
    };
  })();