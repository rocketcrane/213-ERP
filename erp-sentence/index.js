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
		var data;
		
		/* display all words one-by-one */
		for (let i = 0; i < wordArray.length; i++) {
			var num = i + 1;
			var time = num * trial.delay;
			
			function displayWord() {
				word = '<div>' + wordArray[i] + '</div>';
				display_element.innerHTML = word;
				
				/* set event marker at oddball */
				if (num == trial.index) {
					console.log("oddball");
				}
			}
			/* wait for duration specified by delay parameter */
			this.jsPsych.pluginAPI.setTimeout(function() {displayWord()}, time);
		}
		
		/* display */
		
    	/* keyboard response & end trial */
		this.jsPsych.pluginAPI.setTimeout(function(){
			const after_key_response = (info) => {
			    /* record the response time as data */
			    let data = {
			      rt: info.rt
			    }
			}
		    /* set up a keyboard event to respond */
		    this.jsPsych.pluginAPI.getKeyboardResponse({
		      callback_function: after_key_response,
		      valid_responses: ['f', 'j'],
		      persist: false
		    });
		}, trial.delay * trial.index);
		
	    /* end trial */
		this.jsPsych.pluginAPI.setTimeout(function(){
	    	this.jsPsych.finishTrial(data);
		}, trial.delay * wordArray.length);
    }
  }
  ERPSentencePlugin.info = info;

  return ERPSentencePlugin;
})(jsPsychModule);