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
		  	index: { //index begins at 1, not 0
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
		    var data = {
		    	rt: -99999
		    }

			/* display all words one-by-one */
			for (let i = 0; i < wordArray.length; i++) {
								
				/* wrap word display in a function to run using timeout */
				function displayWord() {
					word = '<div>' + wordArray[i] + '</div>'; //html formatting
					display_element.innerHTML = word; //display the word
		
					/* trigger handler at the oddball word */
					if ((i + 1) == trial.index) {
						//WORK IN PROGRESS: fetch(`http://127.0.0.1:8000/trigger/tcp/${jsPsych.timelineVariable("trigger_value")}`);
						console.log("trigger");
					}
				}
				/* wait for duration specified by delay parameter */
				this.jsPsych.pluginAPI.setTimeout(function() {displayWord()}, (i + 1) * trial.delay);
			}
			
			/* keyboard response & end trial */
			this.jsPsych.pluginAPI.setTimeout(function(){
				const after_key_response = (info) => {
				    /* record the response time */
				    data.rt = info.rt;
				}
			    /* set up a keyboard event to respond */
			    this.jsPsych.pluginAPI.getKeyboardResponse({
			    	callback_function: after_key_response,
			    	valid_responses: ['f', 'j'], //WORK IN PROGRESS: only F and J responses accepted for now
			    	persist: false
			    });
			}, trial.delay * trial.index);
		
		    /* end trial */
			this.jsPsych.pluginAPI.setTimeout(function(){
		    	this.jsPsych.finishTrial(data);
			}, trial.delay * (wordArray.length + 1)); //end trial only after last word has been displayed for time specified by delay variable
		}
	}
	ERPSentencePlugin.info = info;

	return ERPSentencePlugin;
})(jsPsychModule);