var assessmentWelcome = (function() {
    // Private methods and properties
    // ...

    // Public methods and properties
    return {
      init: function() {
        console.log("assessmentView has been loaded!");
        // ...
      },

      Clear:function(document) {
        let sections={
          toptitle,
          displaySectionOne,
          displaySectionTwo,
          displaySectionThree,
          welcomeCitizenSection
        };
        sections.toptitle = document.querySelector('.toptitle');
        sections.toptitle.innerHTML = '';
        
        sections.displaySectionOne = document.querySelector('.displaySectionOne');
        sections.displaySectionOne.innerHTML = '';
        //
        sections.displaySectionTwo = document.querySelector('.displaySectionTwo');
        sections.displaySectionTwo.innerHTML = '';
        //
        sections.displaySectionThree = document.querySelector('.displaySectionThree');
        sections.displaySectionThree.innerHTML = '';
        
        sections.welcomeCitizenSection = document.querySelector('.welcomeCitizenSection');
        sections.welcomeCitizenSection.innerHTML = '';
        return sections;
      }

    };
  })();



