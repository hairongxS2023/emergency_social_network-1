var assessmentCreate = (function() {
  // Private methods and properties
  var _doc = document; // Store document object as a private variable
  const questions_main = [];
  let questionCount = 0;
  let testnamemain;



  function actionDeleteButton()
  {
    var selectElement = _doc.getElementById("takeAnAssessmentWithSelect");
    var selectedIndex = selectElement.selectedIndex;
    var selectedOption = selectElement.options[selectedIndex];
    var selectedItem = selectedOption.innerText;
    console.log("Selected item:", selectedItem);
    


    fetch(`/api/citizens/assessments/${selectedItem}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      // handle success response
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
    
    selectedOption.innerHTML ='';

  }


  function actionDonebutton(){

    testnamemain = inputField.value;
    if((testnamemain==null)||(testnamemain==""))
    {
      assessmentCreate.showStartscreen();
      return;
    }else
    {
      const assessmentDataMain = {
        testname: testnamemain,
        questions: questions_main
      };
     console.log(JSON.stringify(assessmentDataMain));
  
      fetch('/api/assessments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(assessmentDataMain)
      })
      .then(response => {
        if (response.ok) {
          
          // handle successful response here
        } else {
          // handle error response here
        }
      })
      .catch(error => {
        // handle network error here
      });
  
    
  
      assessmentCreate.showStartscreen();

  
    }

    
   
  }


  async function addOptionsConductSelect(numOfOptions, selectElement)
   {

      while (selectElement.firstChild) 
      {
        selectElement.removeChild(selectElement.firstChild);
      }
      selectElement.selectedIndex = 0;
            
    try {
      const response = await fetch('/api/citizens/assessments');
      const assessments = await response.json();
      assessmentConductViews =assessments;

      for (let i = 0; i < assessments.length; i++) 
      {
        const option = document.createElement("option");
        option.classList.add("option-text");
        option.style.fontSize = "12px";
        option.value = assessments[i]._id;

        option.textContent = assessments[i].testname;
        console.log(option.textContent);
        selectElement.appendChild(option);
      }

      if(assessments.length>0){
        selectElement.setAttribute("style", "color: green;");
      }else {
        const option = document.createElement("option");
        option.value="NA"
        option.textContent ="NA"
        selectElement.setAttribute("style", "color: red;");
      }
      selectElement.selectedIndex = 0;
    } catch (error) {
      console.error(error);
    }
  }

  function addDeleteButton()
  {
    





    let button = _doc.createElement('button');
    button.setAttribute('id', 'DmyButton');
    button.setAttribute('type', 'button');
    button.setAttribute('class', 'btn btn-primary');
    button.addEventListener('click', actionDeleteButton);
    button.textContent = 'Delete';
    button.style.width = '100%';
    button.style.padding = '5px';
    document.body.style.padding = '0';
    document.body.style.margin = 'displaySectionFour0';

    displaySectionOne = _doc.querySelector('.displaySectionOne');
    displaySectionOne.style.padding = '0';
    displaySectionOne.style.margin = '0';



    displaySectionOne.appendChild(button);
    viewControls.log("addDeleteButton");
    
  }


  function takeAnAssessmentWithSelection()
  {
    var sections = viewControls.getAllSections();
    var selectElement = _doc.createElement("select");
    selectElement.setAttribute("id", "takeAnAssessmentWithSelect");


    addOptionsConductSelect(5, selectElement);
    selectElement.selectedIndex = 0; 


    selectElement.addEventListener("change", function() {
      //actionDropDownUpdate(selectElement);
    });
    sections.displaySectionOne.appendChild(selectElement);
    //sections.displaySectionOne.style.textAlign = 'center';
    viewControls.log("addDropDownSelection- created");
  }

  
  function createScreen()
  {

   // questions_main=null;;
    questionCount = 0;
    testnamemain =null

    viewControls.updateTitleText("Welcome to Create Assessment");
    viewControls.updateBackbuton("main");
    viewControls.Clear();


    let label = document.createElement('label');
    label.setAttribute('for', 'inputField');
    label.textContent = ' Delete a previously created assessment: ';
    label.classList.add('form-label', 'mr-2');
    label.style.textAlign = 'center';
    label.style.fontWeight = 'bold';

    let hr = document.createElement('hr');

    displaySectionOne = _doc.querySelector('.displaySectionOne');
    displaySectionOne.style.padding = '0';
    displaySectionOne.style.margin = '0';


    // toptitle = _doc.querySelector('.topnav');
    // toptitle.style.padding = '0';
    // toptitle.style.margin = '1';

    
    //toptitle.appendChild(hr);

    displaySectionOne.appendChild(hr);

    displaySectionOne.appendChild(label);

    displaySectionOne.appendChild(hr);
    takeAnAssessmentWithSelection();
    displaySectionOne.appendChild(hr);
    addDeleteButton();
    displaySectionOne.appendChild(hr);
    assessmentCreate.addDoneButton();
    displaySectionOne.appendChild(hr);
    assessmentCreate.addPreviewQuestionTool();
    displaySectionOne.appendChild(hr);
    assessmentCreate.addQuestionTool();
    displaySectionOne.appendChild(hr);


  }


  function clearAllRadios()
  {
    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach((radio) => {
        const radioButtonsContainer = radio.parentNode.parentNode;
        radioButtonsContainer.style.outline = '';
        radio.checked = false;
    });
  }

  function checkRadiosValidation(){
  const selectedRadio = document.querySelector('input[name="answer"]:checked');
  if (!selectedRadio) {
    const radioButtons = document.querySelectorAll('input[name="answer"]');
    radioButtons.forEach((radio) => {
      radio.style.outline = '2px solid red';
  
      radio.addEventListener('change', () => {
        radioButtons.forEach((r) => {
          r.style.outline = '';
        });
      });
    });
    return false;
  }else{
    return true;
  }
}
  
function geninputFeild(sectiontarget) {

  let label = document.createElement('label');
  label.setAttribute('for', 'inputField');
  label.textContent = 'Test Name: ';
  label.classList.add('form-label', 'mr-2');
  label.style.textAlign = 'left';
  label.style.fontWeight = 'bold';

  sectiontarget.appendChild(label);
  let inputField = document.createElement('input');
  inputField.setAttribute('type', 'text');
  inputField.setAttribute('id', 'inputField');
  sectiontarget.appendChild(inputField);
  return sectiontarget;
}


function addAnswerQuestionTool() {
  displaySectionThree = document.querySelector('.displaySectionThree');
  assessmentPreview = document.createElement('fieldset');
  let table = document.createElement('table');
  assessmentPreview.appendChild(table);

  let row = document.createElement('tr');
  table.appendChild(row);

  let choicesCell = document.createElement('td');
  let choices = ['Choice 1', 'Choice 2', 'Choice 3'];

  for (let i = 0; i < choices.length; i++) {
    let choiceRow = document.createElement('tr');
    choicesCell.appendChild(choiceRow);

    let choiceInputCell = document.createElement('td');
    let choiceLabel = document.createElement('label');
    choiceLabel.setAttribute('for', 'choice' + i);
    choiceLabel.textContent = 'Choice ' + (i + 1) + ':';
    let choiceTextField = document.createElement('input');
    choiceTextField.setAttribute('type', 'text');
    choiceTextField.setAttribute('id', 'choice' + i);
    choiceInputCell.appendChild(choiceLabel);
    choiceInputCell.appendChild(choiceTextField);
    choiceRow.appendChild(choiceInputCell);

    let radioCell = document.createElement('td');
    let radioLabel = document.createElement('label');
    radioLabel.setAttribute('for', 'radio' + i);
    let choiceInput = document.createElement('input');
    choiceInput.setAttribute('type', 'radio');
    choiceInput.setAttribute('id', 'radio' + i);
    choiceInput.setAttribute('name', 'answer');
    choiceInput.setAttribute('value', choices[i]);
    radioLabel.appendChild(choiceInput);
    radioLabel.appendChild(document.createTextNode(choices[i]));
    radioCell.appendChild(radioLabel);
    choiceRow.appendChild(radioCell);
  }

  row.appendChild(choicesCell);

  let legend = document.createElement('legend');
  legend.textContent = 'Generate Answers:';
  legend.style.textAlign = 'left';
  assessmentPreview.appendChild(legend);
  assessmentPreview.appendChild(legend);
  displaySectionThree.appendChild(assessmentPreview);

  let submitButton = document.createElement('button');
  submitButton.textContent = 'Submit';
  submitButton.style.float = 'right';

  assessmentPreview.appendChild(submitButton);
}


function getAssessmentName() {
  const inputField = document.getElementById('inputField'); // Get the input element by its ID
  const inputValue = inputField.value; // Get the value of the input element
  console.log(inputValue); // Output: "Hello, world!"
  return inputField.value;
}


  // Public methods and properties
  return {
    init: function() {
      console.log("assessmentCreate has been loaded!");
      // ...
    },


    addQuestionTool: function() {
      const displaySectionTwo = document.querySelector('.displaySectionTwo');
      const displaySectionOne = document.querySelector('.displaySectionOne');
      const assessmentPreview = document.createElement('fieldset');
      assessmentPreview.classList.add('form-group', 'mt-3');
      const legend = document.createElement('legend');
      legend.textContent = 'Generate Questions';
      legend.classList.add('col-form-label');
      legend.classList.add('mr-2');
      legend.style.textAlign = 'left';

      legend.textContent = 'Generate Questions';
      legend.classList.add('col-form-label', 'mr-2');
      legend.style.textAlign = 'left';
      assessmentPreview.appendChild(legend);


      const maxNumberOfquestions = 2;
      const questionRow = document.createElement('div');
      questionRow.classList.add('form-group');

      const questionLabel = document.createElement('label');
      questionLabel.textContent = 'Question Text:';
      questionLabel.classList.add('col-form-label', 'mr-2');
      questionLabel.style.textAlign = 'left';
      questionLabel.style.display = 'block';
      questionLabel.style.width = '100%';


      // legendMain.textContent = 'Preview';
      // legendMain.classList.add('col-form-label', 'mt-3');
      // legendMain.style.textAlign = 'left';
 
      
      questionRow.appendChild(questionLabel);

      const questionTextField = document.createElement('input');
      questionTextField.setAttribute('type', 'text');
      questionTextField.setAttribute('id', 'questionText');
      questionTextField.classList.add('form-control');
      questionTextField.classList.add('mr-2');
      questionTextField.classList.add('rounded');
      questionTextField.classList.add('form-control', 'mr-2', 'rounded');
      questionTextField.style.display = 'block';
      questionTextField.style.width = '100%';
      questionTextField.style.padding = '5';


      questionTextField.style.borderRadius = '5px';
      questionTextField.style.padding = '7px';
      questionTextField.style.fontSize = '14px';
      questionTextField.style.border = '2px solid gray';
      questionTextField.style.textAlign = 'left';
      questionTextField.style.display = 'block';


      questionRow.appendChild(questionTextField);
      assessmentPreview.appendChild(questionRow);
      
  


      for (let i = 1; i <= maxNumberOfquestions; i++) {
        const choiceRow = document.createElement('div');
        choiceRow.classList.add('form-group');
      
        const choiceLabel = document.createElement('label');
        choiceLabel.textContent = `Choice ${i}:`;
        choiceLabel.classList.add('col-form-label');
        choiceLabel.classList.add('mr-2');
        choiceRow.appendChild(choiceLabel);
      
        const choiceTextField = document.createElement('input');
        choiceTextField.setAttribute('type', 'text');
        choiceTextField.setAttribute('id', `choice${i}`);
        choiceTextField.classList.add('form-control');
        choiceTextField.classList.add('mr-2');


        choiceTextField.style.borderRadius = '5px';
        choiceTextField.style.padding = '7px';
        choiceTextField.style.fontSize = '14px';
        choiceTextField.style.border = '2px solid gray';
        choiceTextField.style.width = '100%'; 

        choiceRow.appendChild(choiceTextField);
        assessmentPreview.appendChild(choiceRow);
      
        const choiceRadio = document.createElement('input');
        choiceRadio.setAttribute('type', 'radio');
        choiceRadio.setAttribute('name', 'answer');
        choiceRadio.setAttribute('value', `choice${i}`);
        choiceLabel.appendChild(choiceRadio);
      }
      
      // for (let i = 1; i <= maxNumberOfquestions; i++) {
      //     const choiceRow = document.createElement('div');
      //     choiceRow.classList.add('form-group');
      //     const choiceLabel = document.createElement('label');
      //     choiceLabel.textContent = `Choice ${i}:`;
      //     choiceLabel.classList.add('col-form-label');
      //     choiceLabel.classList.add('mr-2');
      //     choiceRow.appendChild(choiceLabel);

      //     const choiceTextField = document.createElement('input');
      //     choiceTextField.setAttribute('type', 'text');
      //     choiceTextField.setAttribute('id', `choice${i}`);
      //     choiceTextField.classList.add('form-control');
      //     choiceTextField.classList.add('mr-2');
      //     choiceRow.appendChild(choiceTextField);
      //     assessmentPreview.appendChild(choiceRow);
  
      //     const choiceRadio = document.createElement('input');
      //     choiceRadio.setAttribute('type', 'radio');
      //     choiceRadio.setAttribute('name', 'answer');
      //     choiceRadio.setAttribute('value', `choice${i}`);
      //     choiceLabel.appendChild(choiceRadio);
      // }

      const submitButton = document.createElement('button');
      submitButton.textContent = 'Add';
      submitButton.classList.add('btn');
      submitButton.classList.add('btn-primary');
      submitButton.style.float = 'right';
      assessmentPreview.appendChild(submitButton);
  
      submitButton.addEventListener('click', () => 
      {


        
            const inputField = document.getElementById('inputField');
            inputField.addEventListener('change', () => {
                if (inputField.value.trim() === '') {
                    inputField.style.outline = '2px solid red';
                    return;
                } else {
                    inputField.style.outline = '';
                }
            });
      
            if (inputField.value.trim() === '') {
             // alert('Please enter a test name!');
              inputField.style.outline = '2px solid red';
              return;
          }
      
          inputField.style.outline = '';
  
        const choiceTextFields = document.querySelectorAll('input[type="text"]');
        choiceTextFields.forEach(choiceTextField => {
          if (choiceTextField.value.trim() === '') {
            choiceTextField.style.outline = '2px solid red';
            return;
          } else {
            choiceTextField.style.outline = '';
          }
        });


          const assessmentName = getAssessmentName();
          // legendMain.textContent = `Preview('${assessmentName}')`;
          // legendMain.style.textAlign = 'left';



         let validRadios= checkRadiosValidation();
          if(!validRadios)
          {
            return;
          }

 

            // Add event listener to question text field
          const questionTextField = document.getElementById('questionText');
          questionTextField.addEventListener('change', () => {
            if (questionTextField.value.trim() === '') {
              questionTextField.style.outline = '2px solid red';
              return;
            } else {
              questionTextField.style.outline = '';
            }
          });

          
          questionCount++;
          const questionText = document.getElementById('questionText').value;
          const choices = [];
          for (let i = 1; i <= maxNumberOfquestions; i++) {
              const choiceText = document.getElementById(`choice${i}`).value;
              if (choiceText.trim() === '') {
               // viewControls.loadwelcomeTitle("you must fill out all items before question can be added.");
                  return;
              }
              const isCorrect = document.querySelector(`input[name="answer"][value="choice${i}"]`).checked;
              choices.push({
                  text: choiceText,
                  isCorrect: isCorrect
              });
          }



    
          const questionData = {
              question: questionText,
              choices: choices
          };

          questions_main.push(questionData);
          
          if (assessmentPreviewMain.children.length <= 5) {
  
              // Check if question text is empty
              if (questionText.trim() === '') {
                  //alert('Please enter a question!');
                  return;
              }
  
              // Update preview with new question
              const questionDiv = document.createElement('div');
            questionDiv.classList.add('question-preview');

            // Add question text to preview
            const questionTextDiv = document.createElement('div');
            questionTextDiv.textContent = `Question(${questionCount})${questionText}`;
            questionTextDiv.classList.add('question-text');
            questionTextDiv.classList.add('mr-2');
            questionTextDiv.style.textAlign = 'left';

            questionDiv.appendChild(questionTextDiv);

            // Add answer choices to preview
            const choicesDiv = document.createElement('div');
            choicesDiv.classList.add('answer-choices');
            choices.forEach(choice => {
                const choiceDiv = document.createElement('div');
                choiceDiv.classList.add('answer-choice');

                // Add radio button for answer
                const choiceInput = document.createElement('input');
                choiceInput.setAttribute('type', 'radio');
                choiceInput.setAttribute('name', `question-${questionCount}-answer`);
                choiceInput.setAttribute('value', choice.text);
                //choiceDiv.appendChild(choiceInput);

                // Add label for answer
                const choiceLabel = document.createElement('label');
                choiceLabel.setAttribute('for', `question-${questionCount}-answer`);
                const choiceLabelText = choice.isCorrect ? `${choice.text}<====(Correct)\r\n` : `${choice.text}\r\n`;
                choiceLabel.textContent = choiceLabelText;
                choiceLabel.classList.add('col-form-label');
                choiceLabel.classList.add('mr-2');
                choiceDiv.appendChild(choiceLabel);
                choicesDiv.appendChild(choiceDiv);
            });
            questionDiv.appendChild(choicesDiv);

            const removeButton = document.createElement('button');
            removeButton.textContent = 'Remove';
            removeButton.classList.add('btn');
            removeButton.classList.add('btn-danger');
            removeButton.style.float = 'right';
            removeButton.addEventListener('click', () => {

              if(questionCount==1)
              {
                //limit to 1 to avoide zero recounting
              }else
              {
                questionCount--;
              }

                questionDiv.remove();
                questions_main.pop();

                // Update question numbers
                const questionDivs = assessmentPreviewMain.querySelectorAll('.question-preview');
                questionDivs.forEach((div, index) => {
                    div.querySelector('.question-text').textContent = `Question(${index + 1}) ${div.querySelector('.question-text').textContent.slice(11)}`;
                });
            });

            const questionDivs = assessmentPreviewMain.querySelectorAll('.question-preview');
            questionDivs.forEach((div, index) => {
                console.log(div.querySelector('.question-text').textContent);
            });

            let assessmentName = getAssessmentName();

            assessmentDataMain = {
                asessmentName: assessmentName,
                questions: questions_main
            };
            console.log(assessmentDataMain);
            questionDiv.appendChild(removeButton);
            assessmentPreviewMain.appendChild(questionDiv);
        } else {
            alert('Maximum number of questions reached!');
        }

      
          clearAllRadios();

          choiceTextFields.forEach(choiceTextField => 
            {
            if (choiceTextField.value.trim() === '') 
            {
              choiceTextField.style.outline = '2px solid red';
              return;
            } else 
            {
              choiceTextField.style.outline = '';
            }
            if (choiceTextField.id !== 'inputField') 
            {
              choiceTextField.value = '';
            }

          });
          
          let assessmentNamed = getAssessmentName();
          legendMain.textContent = `Preview('${assessmentNamed}')`;
          legendMain.style.textAlign = 'left';
          questionCount = 0;

    });

    displaySectionTwo.appendChild(assessmentPreview);
},  
addPreviewQuestionTool: function() {
      const displaySectionOne = document.querySelector('.displaySectionOne');
      const label = document.createElement('label');
      label.setAttribute('for', 'inputField');
      label.textContent = 'Create Assessment:';
      label.classList.add('col-form-label');
      label.classList.add('mr-2');
      label.style.textAlign = 'center';
      label.style.fontWeight = 'bold';
      displaySectionOne.appendChild(label);

      let hr = document.createElement('hr');
      displaySectionOne.appendChild(hr);

      const inputField = document.createElement('input');
      inputField.setAttribute('type', 'text');
      inputField.setAttribute('id', 'inputField');
      inputField.classList.add('form-control');
      inputField.classList.add('mr-2');
      inputField.classList.add('rounded');
      inputField.classList.add('form-control', 'mr-2', 'rounded');
      
      inputField.style.borderRadius = '5px';
      inputField.style.padding = '7px';
      inputField.style.fontSize = '14px';
      inputField.style.border = '2px solid gray';
      inputField.style.width = '100%'; 

      displaySectionOne.appendChild(inputField);
  
      // const updateButton = document.createElement('button');
      // updateButton.textContent = 'Update';
      // updateButton.classList.add('btn');
      // updateButton.classList.add('btn-primary');
      // updateButton.addEventListener('click', () => {
      //     assessmentName = getAssessmentName();
  
      //     legendMain.textContent = `Preview('${assessmentName}')`;
      //     legendMain.style.textAlign = 'left';
      // });
  
      // displaySectionOne.appendChild(updateButton);
  
      const startPage = document.getElementById('start-page');
            startPage.style.padding = '5';

            
           

      assessmentPreviewMain = document.createElement('fieldset');
      //assessmentPreviewMain.style.backgroundColor = 'lightgray';
      assessmentPreviewMain.style.backgroundColor = '#f2f2f2';
      assessmentPreviewMain.style.padding = '5px';
      assessmentPreviewMain.classList.add('border');
      assessmentPreviewMain.classList.add('p-3');
      assessmentPreviewMain.style.overflow = 'auto';
      assessmentPreviewMain.style.height = '250px';
      //assessmentPreviewMain.style.backgroundColor = 'lightgray';
      assessmentPreviewMain.style.borderRadius = '10px';


      let labelPreview = document.createElement('label');
      labelPreview.style.padding = '5px';
      labelPreview.setAttribute('for', 'inputField');
    //  labelPreview.textContent = 'Preview: ';
      labelPreview.classList.add('form-label', 'mr-2');
      labelPreview.style.textAlign = 'left';
      displaySectionOne.appendChild(labelPreview);

      legendMain = document.createElement('legend');
      //legendMain.textContent = '';
      //legendMain.style.padding = '5px';
      // legendMain.classList.add('col-form-label', 'mt-3');
      // legendMain.style.textAlign = 'left';
      // legendMain.style.borderRadius = '10px';
      // legendMain.style.display = 'block';
      // legendMain.style.width = '100%';
      //legendMain.style.maxHeight = '300px';
      assessmentPreviewMain.appendChild(legendMain);
      

      
  

  
      displaySectionOne.appendChild(assessmentPreviewMain);
  
      viewControls.log("addPreviewQuestionTool");
  },
    addDoneButton: function()
    {
      let button = _doc.createElement('button');
      button.setAttribute('id', 'DmyButton');
      button.setAttribute('type', 'button');
      button.setAttribute('class', 'btn btn-primary');
      button.addEventListener('click', actionDonebutton);
      button.textContent = 'Done';
      displaySectionFour = _doc.querySelector('.displaySectionFour');
      displaySectionFour.style.padding = '0';
      displaySectionFour.style.margin = '0';
      button.style.width = '100%';
      button.style.padding = '5px';
      document.body.style.padding = '0';
      document.body.style.margin = '0';
      displaySectionFour.appendChild(button);
      displaySectionFour.style.textAlign = 'left';
      viewControls.log("addDoneButton");
      
      
      
      return button;
    },
    showStartscreen: function()
    {
      viewControls.updateTitleText("Welcome to Self Assessments");
      viewControls.showMainscreen();
    }
    ,
    show: function()
    {
       createScreen();
    }

  };
})();