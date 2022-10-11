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
        default: 1000,
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
		var word = '';
		display_element.innerHTML = trial.stimulus;
		console.log("now");
		
		
		/* display all words one-by-one */
		for (let i = 0; i < wordArray.length; i++) {
			var num = i + 1;
			var time = num * trial.delay;
			
			function displayWord(i) {
				word = '<div>' + wordArray[i] + '</div>';
				display_element.innerHTML = word;
				
				/* set event marker at oddball */
				if (num == trial.index) {
					console.log("oddball");
				}
			}
			
			/* wait for duration specified by delay parameter */
			this.jsPsych.pluginAPI.setTimeout(displayWord(i), time);
		}
				
    	/* end trial */
		this.jsPsych.pluginAPI.setTimeout(function(){
			this.jsPsych.finishTrial();
		}, trial.delay * (wordArray.length + 1));
    }
  }
  ERPSentencePlugin.info = info;

  return ERPSentencePlugin;
})(jsPsychModule);