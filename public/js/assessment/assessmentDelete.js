var assessmentDelete = (function() {

  var _doc = document; 
  let testResults;

  function actionAbortDiscard()
  {
    assessmentView.show();
  }
  function actionDiscard()
  {
    let substrings = testResults.split('-');
    //"COMPLETED BY-sdadada-Score:[0%]-Assessment#1-Flood Preparedness-4/12/2023, 5:25:43 AM"
    assessmentDelete.deleteAssessment(substrings[3]);


    assessmentConduct.show();
  }


  function createScreen()
  {
    viewControls.Clear();
    sections = viewControls.getAllSections();

    const title = _doc.createElement('h2');
    title.textContent = 'Confirm Discard:';
    sections.displaySectionOne.appendChild(title);
    sections.displaySectionOne.style.textAlign = 'center';


    const warningtext = _doc.createElement('h3');
    warningtext.textContent = 'Are you sure you want to delete assessment?';
    sections.displaySectionOne.appendChild(warningtext);
    sections.displaySectionOne.style.textAlign = 'center';

    viewControls.addButton('Yes',actionDiscard,
    viewControls.getColors().red,sections.displaySectionThree);

    viewControls.addButton('No',actionAbortDiscard,
    viewControls.getColors().green,sections.displaySectionFour);

 

    viewControls.updateBackbuton("view");
  }

  return {
    init: function() {
      console.log("assessmentdelete has been loaded!");
    },
    deleteAssessment: function(testsNameid)
    {
      const assessmentId = testsNameid; // Replace with the ID of the assessment you want to delete
      fetch(`/api/citizens/records/${assessmentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })
        .then(response => {
          if (response.ok) {
            console.log('Assessment deleted successfully');
          } else {
            throw new Error('Failed to delete assessment');
          }
        })
        .catch(error => {
          console.error(error);
        });

      console.log("delete assessmsent "+testsNameid)
    },    
    show: function(targettestname)
    {
      testResults=targettestname;

     viewControls.updateBackbuton("view");
     viewControls.Clear();
      createScreen();
      }
  };
})();