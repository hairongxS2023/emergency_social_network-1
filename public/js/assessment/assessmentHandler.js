
var assessmenthandler = (function () {
    var _doc = document;
    let assessmentControl = {};
    let questions = [{}];
    let assessmentObj=[];
    let assessmentFinid='';
    let finishedAssessment;
    let assessmentId;
    let firstQuestionDisplayed = -1;
    let lastQuestionDisplayed = -1;

    function getuserjwt() {
        const cookie = getCookie('access_token');
      //  const token = cookie.get('access_token');
        const decodedToken = JSON.parse(atob(cookie.split('.')[1]));
        const username = decodedToken.username.toLowerCase();
        return username;
      }


      function getCookie(name) {
        const cookies = document.cookie.split("; ");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].split("=");
          //console.log("in index.js Cookie: ",cookie);
          if (cookie[0] === name) {
            return cookie[1];
          }
        }
        return null;
      }
      
    function createScreen() {

        var sections = viewControls.getAllSections();
        // create a new div element with id 'jquery-script-menu'
        var jqueryScriptMenu = document.createElement('div');
        jqueryScriptMenu.id = 'jquery-script-menu';

        // create div elements with classes 'jquery-script-center' and 'jquery-script-clear'
        var jqueryScriptCenter = document.createElement('div');
        jqueryScriptCenter.classList.add('jquery-script-center');
        var jqueryScriptClear = document.createElement('div');
        jqueryScriptClear.classList.add('jquery-script-clear');

        // append the 'jquery-script-clear' div to the 'jquery-script-center' div
        jqueryScriptCenter.appendChild(jqueryScriptClear);

        // append the 'jquery-script-center' div to the 'jquery-script-menu' div
        jqueryScriptMenu.appendChild(jqueryScriptCenter);

        // create a new div element with class 'wrapper'
        var wrapper = document.createElement('div');
        wrapper.classList.add('wrapper');

        // create a new div element with class 'main'
        var main = document.createElement('div');
        main.classList.add('main');

        // create a new h1 element with class 'title'
        var title = document.createElement('h1');
        title.classList.add('title');
        title.innerText = 'Assessment';

        // create a new div element with class 'question-container'
        var questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');

        // create a new a element with id 'backBtn', class 'button', and text '« Back'
        var backBtn = document.createElement('a');
        backBtn.id = 'backBtn';
        backBtn.classList.add('button');
        backBtn.innerText = '« Back';

        // create a new a element with id 'nextBtn', class 'button', and text 'Continue »'
        var nextBtn = document.createElement('a');
        nextBtn.id = 'nextBtn';
        nextBtn.classList.add('button');
        nextBtn.innerText = 'Continue »';

        // create a new script element with src 'http://code.jquery.com/jquery-1.11.3.min.js'
        var jqueryScript = document.createElement('script');
        jqueryScript.src = 'http://code.jquery.com/jquery-1.11.3.min.js';

        // create a new script element with src 'conductAssessmentHelper.js' and type 'text/javascript'
        var conductAssessmentScript = document.createElement('script');
        conductAssessmentScript.src = 'conductAssessmentHelper.js';
        conductAssessmentScript.type = 'text/javascript';

        // append the child elements to the appropriate parent elements
        main.appendChild(title);
        main.appendChild(document.createElement('br'));
        main.appendChild(questionContainer);
        main.appendChild(backBtn);
        main.appendChild(nextBtn);
        main.appendChild(jqueryScript);
        main.appendChild(conductAssessmentScript);
        wrapper.appendChild(main);
        sections.displaySectionThree.appendChild(jqueryScriptMenu);
        sections.displaySectionThree.appendChild(wrapper);
        sections.displaySectionThree.style.textAlign = 'center';


    }

    function setup_assessment(ques,asmidd) {
        //var self = this;
        questions = ques;
        const asmidds=asmidd;
        console.log(asmidds);

        questions.forEach(function (question) 
        {
            generateQuestionElement(question);
        });

        $('#backBtn').click(function ()
         {
            if (!$('#backBtn').hasClass('disabled')) {
                showPreviousQuestionSet();
            }
        });

        $('#nextBtn').click(function () {
            var ok = true;
            for (i = firstQuestionDisplayed; i <= lastQuestionDisplayed; i++)
             {
                if (questions[i]['required'] === true && !getQuestionAnswer(questions[i])) 
                {
                    $('.question-container > div.question:nth-child(' + (i + 1) + ') > .required-message').show();
                    ok = false;
                }
            }
            if (!ok)
            {
                return;
            }
                

            if ($('#nextBtn').text().indexOf('Continue') === 0)
             {
                showNextQuestionSet();
            } 
            else
             {

                var answers = {
                    res: $(window).width() + "x" + $(window).height()
                };


                for (i = 0; i < questions.length; i++) {
                    answers[questions[i].id] = getQuestionAnswer(questions[i]);
                }


                 finishedAssessment=[{useranswers:answers,conductedAssessment: questions,takeAssessment:assessmentObj}];

                 assessmentId=getuserjwt();
               

                 actionSubmitassessmentDone();

            
             

                  
            
            }
        });

        showNextQuestionSet();

    }

    function actionSubmitassessmentDone()
    {

        const assessmentId=getuserjwt();
        const asmidds=''
        var result='';
       fetch('/api/citizens/records/' + assessmentId, {
           method: 'PUT',
           headers: {
             'Content-Type': 'application/json'
           },
           body: JSON.stringify(finishedAssessment)
         })
         .then(response => {
           if (response.ok) {
             return response.json();
           } else {
             throw new Error('Failed to update assessment');
           }
         })
         .then(data => {
           result = data[0];
           console.log(`Percentage of correct answers: ${result.percentageAssessmentResult}%`);

           console.log(`Message: ${result.message}`);
           hideAllQuestions();
           $('#nextBtn').hide();
           $('#backBtn').hide();

           viewControls.updateTitleText("View a Create an Assessment");
           createAssessmentResultsContainer(result,asmidds);
           
         })
         .catch(error => {
           hideAllQuestions();
           $('#nextBtn').hide();
           $('#backBtn').hide();
         });
         




      
    }


    function actionSubmitassessment()
    {
        console.log("actionSubmitassessment");

        viewControls.Clear();
        viewControls.updateTitleText("Results Submitted");
        sections = viewControls.getAllSections();
  
        const title = document.createElement('h2');
        title.textContent = 'Your Assessment Results have been submitted!:';
        sections.displaySectionOne.appendChild(title);
        sections.displaySectionOne.style.textAlign = 'center';
  

        
        viewControls.addButton('Done',actionSubmitassessmentDone,
        viewControls.getColors().green,sections.displaySectionThree);
  
 
        assessmentConduct.show();

    }

    function actionDiscardassessment()
    {
        console.log("actionDiscardassessment");

        assessmentDelete.show();
        assessmentDelete.deleteAssessment(assessmentFinid);
        assessmentConduct.show();

    }
    function createAssessmentResultsContainer(assesssmentResutls,finishedAssessmentid) 
    {

        assessmentFinid = finishedAssessmentid; 
        viewControls.Clear();
        sections = viewControls.getAllSections();

        const container = sections.displaySectionOne;
        const title = document.createElement('h2');
        title.textContent = 'Assessment Results:';
        title.style.textAlign = 'center';
        container.appendChild(title);
      
        const textContainer = document.createElement('div');
        textContainer.setAttribute('contentEditable', false);
        textContainer.style.height = '200px';
        textContainer.style.width = '400px';
        textContainer.style.border = '1px solid black';
        textContainer.style.padding = '5px';
        textContainer.style.margin = '10px auto';
        textContainer.style.textAlign = 'center';
        textContainer.style.overflow = 'auto';
        textContainer.textContent = "\r\n"+assesssmentResutls.message+"\r\n"+assessmentFinid;
        container.appendChild(textContainer);
    
        viewControls.addButton('Submit Assessment Results',actionSubmitassessment,
        viewControls.getColors().green,sections.displaySectionThree);


        viewControls.addButton('Discard',actionDiscardassessment,
        viewControls.getColors().red,sections.displaySectionFour);
        return container;
      }

      

    function getQuestionAnswer(question) {
        var result;
        if (question.type === 'single-select') {
            result = $('input[type="radio"][name="' + question.id + '"]:checked').val();
        } else if (question.type === 'single-select-oneline') {
            result = $('input[type="radio"][name="' + question.id + '"]:checked').val();
        } else if (question.type === 'text-field-small') {
            result = $('input[name=' + question.id + ']').val();
        } else if (question.type === 'text-field-large') {
            result = $('textarea[name=' + question.id + ']').val();
        }
        return result ? result : undefined;
    }

    function generateQuestionElement(question) {
        var questionElement = $('<div id="' + question.id + '" class="question"></div>');
        var questionTextElement = $('<div class="question-text"></div>');
        var questionAnswerElement = $('<div class="answer"></div>');
        var questionCommentElement = $('<div class="comment"></div>');
        questionElement.appendTo($('.question-container'));
        questionElement.append(questionTextElement);
        questionElement.append(questionAnswerElement);
        questionElement.append(questionCommentElement);
        questionTextElement.html(question.text);
        questionCommentElement.html(question.comment);
        if (question.type === 'single-select') {
            questionElement.addClass('single-select');
            question.options.forEach(function (option) {
                questionAnswerElement.append('<label class="radio"><input type="radio" value="' + option + '" name="' + question.id + '"/>' + option + '</label>');
            });
        } else if (question.type === 'single-select-oneline') {
            questionElement.addClass('single-select-oneline');
            var html = '<table border="0" cellpadding="5" cellspacing="0"><tr><td></td>';
            question.options.forEach(function (label) {
                html += '<td><label>' + label + '</label></td>';
            });
            html += '<td></td></tr><tr><td><div>' + question.labels[0] + '</div></td>';
            question.options.forEach(function (label) {
                html += '<td><div><input type="radio" value="' + label + '" name="' + question.id + '"></div></td>';
            });
            html += '<td><div>' + question.labels[1] + '</div></td></tr></table>';
            questionAnswerElement.append(html);
        } else if (question.type === 'text-field-small') {
            questionElement.addClass('text-field-small');
            questionAnswerElement.append('<input type="text" value="" class="text" name="' + question.id + '">');
        } else if (question.type === 'text-field-large') {
            questionElement.addClass('text-field-large');
            questionAnswerElement.append('<textarea rows="8" cols="0" class="text" name="' + question.id + '">');
        }
        if (question.required === true) {
            var last = questionTextElement.find(':last');
            (last.length ? last : questionTextElement).append('<span class="required-asterisk" aria-hidden="true">*</span>');
        }
        questionAnswerElement.after('<div class="required-message">This is a required question</div>');
        questionElement.hide();
    }

    function hideAllQuestions() {
        $('.question:visible').each(function (index, element) {
            $(element).hide();
        });
        $('.required-message').each(function (index, element) {
            $(element).hide();
        });
    }

    function showNextQuestionSet() {
        hideAllQuestions();

        let count = questions.length;


        if(firstQuestionDisplayed<questions.length)
        firstQuestionDisplayed = lastQuestionDisplayed + 1;



        do {
            if(count==1){
                return;
            }

            lastQuestionDisplayed++;

            if(questions[lastQuestionDisplayed])
            $('.question-container > div.question:nth-child(' + (lastQuestionDisplayed + 1) + ')').show();
            if (questions[lastQuestionDisplayed]['break_after'] === true)
                break;
        } while (lastQuestionDisplayed < questions.length - 1);

        doButtonStates();
    }

    function showPreviousQuestionSet() {
        hideAllQuestions();
        lastQuestionDisplayed = firstQuestionDisplayed - 1;

        do {
            firstQuestionDisplayed--;
            $('.question-container > div.question:nth-child(' + (firstQuestionDisplayed + 1) + ')').show();
            if (firstQuestionDisplayed > 0 && questions[firstQuestionDisplayed - 1]['break_after'] === true)
                break;
        } while (firstQuestionDisplayed > 0);

        doButtonStates();
    }

    function doButtonStates() {
        if (firstQuestionDisplayed == 0) {
            $('#backBtn').addClass('invisible');
        } else if ($('#backBtn').hasClass('invisible')) {
            $('#backBtn').removeClass('invisible');
        }

        if (lastQuestionDisplayed == questions.length - 1) {
            $('#nextBtn').text('Finish');
            $('#nextBtn').addClass('blue');
        } else if ($('#nextBtn').text() === 'Finish') {
            $('#nextBtn').text('Continue »');
            $('#nextBtn').removeClass('blue');
        }
    }


    return {
        init: function () {
            console.log("assessmentConducts has been loaded!");
        },
        clear: function () {
            viewControls.clear();
        },
        Show: function (assessmentObjm) 
        {


            assessmentControl = {};
            questions = [{}];
            assessmentObj=[];
            assessmentFinid='';
            finishedAssessment;
            assessmentId;

            assessmentObj=assessmentObjm;
            createScreen();

           console.log(JSON.stringify(assessmentObj));



           const questionsA = assessmentObj.answers.map((answer, index) => {
            return {
              "text": `Question ${index + 1} - ${answer.question}`,
              "id": answer._id,
              "break_after": true,
              "required": true,
              "type": "single-select",
              "options": answer.choices.map((choice) => {
                return choice.text;
              })
            };
          });
          
          console.log(questionsA);

          const asmId= assessmentObj.assessmentId; 
          setup_assessment(questionsA,asmId);

        }

    };
})();