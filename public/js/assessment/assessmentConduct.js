let conductSelect;
let viewSelect;
let assessmentsHistoryViews;
let assessmentConductViews;

var assessmentConduct = (function () {
  var _doc = document;
  var lastDropDownSelection;

  function actionViewassessment() {
    assessmentConduct.show();
    console.log(actionViewassessment);
  }

  function actionViewUserAssessment() {
    if (getUserAssements() == 0) {
      createScreenNoAssessment();
    }

    let viewSelection = document.getElementById("viewWithHistorySelect");
    let viewselected = viewSelection[0].innerText;
    if (viewselected) {
      console.log(viewselected);
    } else {

    }

    viewControls.log("dropdown:" + viewselected);
    assessmentView.show(viewselected);
  }

  function actionConductAssessment() {
    const selectElement2 = document.getElementById("takeAnAssessmentWithSelect");
    if (selectElement2) {
      if (selectElement2.selectedIndex < 0)
        return;

      const selectedValue2text = selectElement2.options[selectElement2.selectedIndex].text;
      viewControls.log(selectedValue2text);
      viewControls.Clear();

      let assessmentConductViewsLocal = assessmentConductViews;
      console.log(JSON.stringify(assessmentConductViewsLocal));

      let selectedAssessment = null;

      for (let i = 0; i < assessmentConductViewsLocal.length; i++) {
        const assessment = assessmentConductViewsLocal[i];
        console.log(assessment._id);
        console.log(assessment.testname + ' - ' + new Date(assessment.date).toLocaleString());
        //
        if ((assessment.testname + ' - ' + new Date(assessment.date).toLocaleString()) === selectedValue2text) {
          selectedAssessment = assessment;
        }
      }
      assessmenthandler.Show(selectedAssessment);
      if (selectedAssessment) {

      }
    }
  }

  function getUserAssements() {
    return true;
  }

  function createScreen() {
    viewControls.Clear();
    viewControls.loadwelcomeTitle(" Please select from the below options:", "you may choose to view or you can choose to conduct an assessment.");
    viewControls.log("show");
    viewControls.updateBackbuton("main");
  }

  function startAssessment() {
    const startPage = document.getElementById("start-page");
    const questionPage = document.getElementById("question-page");
    startPage.style.display = "none";
    questionPage.style.display = "block";
    backButton.removeAttribute("disabled");
    showQuestion(currentQuestion);
  }

  function actionDropDownUpdate(selected) {
    conductSelect = document.getElementById("viewWithHistorySelect");
    if (conductSelect.length != 0) {
      // let viewselected=conductSelect.options[conductSelect.selectedIndex].text;
      console.log(viewselected);
    }

    viewSelect = document.getElementById("takeAnAssessmentWithSelect");
    if (viewSelect.length != 0) {
      //let viewselectedds=viewSelect.options[viewSelect.selectedIndex].text;
      console.log(viewSelect.length);
    }
  }

  async function addOptionsViewSelect(numOfOptions, selectElement) {
    try {

      const response = await fetch('/api/citizens/records');
      const assessments = await response.json();
      assessmentsHistoryViews = assessments;

      for (let i = 0; i < assessments.length; i++) {
        const option = document.createElement("option");
        option.classList.add("option-text");
        option.style.fontSize = "12px";
        option.value = assessments[i]._id;

        let num = parseFloat(assessments[i].score);
        let rounded = Math.round(num);

        option.textContent = "COMPLETED BY-" + assessments[i].username + "-Score:[" + rounded + "%]-" + assessments[i].testname + '-' + new Date(assessments[i].date).toLocaleString();
        console.log(option.textContent);
        selectElement.appendChild(option);
      }

      if (assessments.length > 0) {
        selectElement.setAttribute("style", "color: green;");
      } else {
        const option = document.createElement("option");
        option.value = "NA"
        option.textContent = "NA"
        selectElement.setAttribute("style", "color: red;");
      }
      selectElement.selectedIndex = 0;
    } catch (error) {
      console.error(error);
    }
  }

  async function addOptionsConductSelect(numOfOptions, selectElement) {
    try {
      const response = await fetch('/api/citizens/assessments');
      const assessments = await response.json();
      assessmentConductViews = assessments;

      for (let i = 0; i < assessments.length; i++) {
        const option = document.createElement("option");
        option.classList.add("option-text");
        option.style.fontSize = "12px";
        option.value = assessments[i]._id;

        option.textContent = assessments[i].testname + ' - ' + new Date(assessments[i].date).toLocaleString();
        console.log(option.textContent);
        selectElement.appendChild(option);
      }

      if (assessments.length > 0) {
        selectElement.setAttribute("style", "color: green;");
      } else {
        const option = document.createElement("option");
        option.value = "NA"
        option.textContent = "NA"
        selectElement.setAttribute("style", "color: red;");
      }
      selectElement.selectedIndex = 0;
    } catch (error) {
      console.error(error);
    }
  }


  function createScreenPostTest() {
    viewControls.updateTitleText("Manage Assessments");
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
    viewControls.addButton('Submit Assessment Results', actionViewassessment,
      viewControls.getColors().green, sections.displaySectionThree);
    viewControls.addButton('Discard', actionDiscardassessment,
      viewControls.getColors().red, sections.displaySectionFour);
  }

  function showQuestion(index) {
    questions = getAssessment();
    const question = document.getElementById("question");
    const answerOptions = document.getElementById("answer-options");
    question.textContent = `Question ${index + 1}: ${questions[index].question}`;
    answerOptions.innerHTML = "";
    for (let i = 0; i < questions[index].options.length; i++) {
      const option = questions[index].options[i];
      const input = document.createElement("input");
      input.type = "radio";
      input.name = "answer";
      input.value = option;
      const label = document.createElement("label");
      label.textContent = option;
      answerOptions.appendChild(input);
      answerOptions.appendChild(label);
      answerOptions.appendChild(document.createElement("br"));
    }
  }

  function nextQuestion() {
    // Save the answer and move to the next question
    const answerInput = document.querySelector('input[name="answer"]:checked');
    if (answerInput) {
      const answer = answerInput.value;
      answers.push(answer);
      currentQuestion++;
      // If there are more questions, show the next one
      if (currentQuestion < questions.length) {
        showQuestion(currentQuestion);
      } else {
        // Otherwise, show the results page
        showResults();
      }
    } else {
      alert("Please select an answer.");
    }
  }

  function showResults() {
    // Hide the question page and show the results page
    const questionPage = document.getElementById("question-page");
    const resultsPage = document.getElementById("results-page");
    questionPage.style.display = "none";
    resultsPage.style.display = "block";
    // Display the results based on the answers
    const results = calculateResults(answers);
    const score = results.score;
    const maxScore = results.maxScore;
    const resultsHeader = document.getElementById("results-header");
    const resultsText = document.getElementById("results-text");
    resultsHeader.textContent = "Results";
    resultsText.textContent = `Your score is ${score} out of ${maxScore}.`;
  }

  function calculateResults(answers) {
    // Calculate the score based on the answers (dummy implementation)
    let score = 0;
    for (let i = 0; i < answers.length; i++) {
      if (answers[i] !== "") {
        score++;
      }
    }
    const maxScore = questions.length;
    return {
      score: score,
      maxScore: maxScore
    };
  }

  function goBack() {
    // Move back to the previous question if possible
    if (currentQuestion > 0) {
      currentQuestion--;
      showQuestion(currentQuestion);
    }
  }

  function createScreenNoAssessment() {
    var sections = viewControls.getAllSections();
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

    textArea.placeholder = 'No assessments have been created yet.';
    sections.displaySectionTwo.appendChild(textArea);
    sections.displaySectionTwo.style.textAlign = 'center';

    viewControls.addButton('OK', actionViewassessment,
      viewControls.getColors().green, sections.displaySectionThree);
  }

  function viewWithHistorySelection() {
    var sections = viewControls.getAllSections();
    var selectElement = _doc.createElement("select");
    selectElement.setAttribute("id", "viewWithHistorySelect");
    addOptionsViewSelect(3, selectElement);

    selectElement.addEventListener("change", function () {
      actionDropDownUpdate(selectElement);
    });
    sections.displaySectionOne.appendChild(selectElement);
    sections.displaySectionOne.style.textAlign = 'center';
    viewControls.log("addDropDownSelection- created");
  }

  function takeAnAssessmentWithSelection() {
    var sections = viewControls.getAllSections();
    var selectElement = _doc.createElement("select");
    selectElement.setAttribute("id", "takeAnAssessmentWithSelect");

    addOptionsConductSelect(5, selectElement);
    selectElement.addEventListener("change", function () {
      actionDropDownUpdate(selectElement);
    });
    sections.displaySectionTwo.appendChild(selectElement);
    sections.displaySectionTwo.style.textAlign = 'center';
    viewControls.log("addDropDownSelection- created");
  }
  return {
    init: function () {
      console.log("assessmentConducts has been loaded!");
      // ...
    },
    addDropDownViewHistory: function () {
      viewWithHistorySelection();
    },
    addDropDownViewTakeAssessment: function () {
      takeAnAssessmentWithSelection();
    },
    addButtonConductAssessments: function () {
      var sections = viewControls.getAllSections();
      viewControls.addButton('Conduct Assessment', actionConductAssessment,
        viewControls.getColors().blue, sections.displaySectionTwo);
    },
    addButtonViewAssessments: function () {
      var sections = viewControls.getAllSections();
      viewControls.addButton('View', actionViewUserAssessment,
        viewControls.getColors().green, sections.displaySectionTwo);
    },
    show: function () {
      viewControls.updateTitleText("Conduct or View Assessment");
      createScreen();
      assessmentConduct.addButtonViewAssessments();
      assessmentConduct.addDropDownViewHistory();
      assessmentConduct.addDropDownViewTakeAssessment();
      assessmentConduct.addButtonConductAssessments();
    }
  };
})();