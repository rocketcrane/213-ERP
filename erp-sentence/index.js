var JsPsychERPSentence = (function (jspsych) {
  "use strict";

  const info = {
    name: "erp-sentence",
    parameters: {
      stimulus: {
        type: jspsych.ParameterType.HTML_STRING,
        default: undefined,
      },
      delay: {
        type: jspsych.ParameterType.INT,
        default: 500,
      },
      index: {
        type: jspsych.ParameterType.INT,
        default: undefined,
      },
    },
  };

  /**
   * **ERP-SENTENCE**
   *
   * Displays sentences word by word.
   * Sends event marker at oddball location, and gathers keyboard response at the end.
   * For ERP experiments involving N400/P600 syntatic/semantic oddballs.
   *
   * @author Lingxiu Zhang @rocketcrane
   * @see {documentation in progress}
   */
  class ERPSentencePlugin {
    constructor(jsPsych) {
      this.jsPsych = jsPsych;
    }
    trial(display_element, trial) {
		var wordArray = trial.stimulus.split(/\s/); //splits sentence by space character into an array of words
		console.log(wordArray); //debug
		var word = '';
		
		/* display all words one-by-one */
		for (let i = 0; i < wordArray.length; i++) {
			word = '<div>' + wordArray[i] + '</div>';
			console.log(word); //debug
			display_element.innerHTML = word;
			
			/* set event marker at oddball */
			if (i + 1 == trial.index) {
				//wip
			}
			
			/* wait for duration specified by delay parameter */
			this.jsPsych.pluginAPI.setTimeout(()=>{}, trial.delay);
		}
		
		//display_element.innerHTML = ''; //clear display
		
    	/* end trial */
    	this.jsPsych.finishTrial();
    }
  }
  ERPSentencePlugin.info = info;

  return ERPSentencePlugin;
})(jsPsychModule);