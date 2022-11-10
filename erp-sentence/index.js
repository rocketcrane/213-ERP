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
		  	index: { //index begins at 1, not 0, decides which word to collect ERP data from
		  	  	type: jspsych.ParameterType.INT,
		   	 	default: undefined,
		  	},
			choices: {
				type: jspsych.ParameterType.KEYS,
				default: undefined,
			},
			normal_choice: {
				type: jspsych.ParameterType.KEYS,
				default: undefined,
			},
			normal: {
				type: jspsych.ParameterType.BOOL,
				default: undefined,
			},
			ERP_type: {
				type: jspsych.ParameterType.HTML_STRING,
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
		    	rt: -9999,
				key_pressed: 'NO_KEY',
				correct: -9999,
				sentence: 'NO_SENTENCE',
				normal: -9999,
				ERP_type: 'unknown'
		    }

			/* display all words one-by-one */
			for (let i = 0; i < wordArray.length; i++) {
								
				/* wrap word display in a function to run using timeout */
				function displayWord() {
					word = '<div style="font-size:60px;">' + wordArray[i] + '</div>'; //html formatting
					display_element.innerHTML = word; //display the word
		
					/* trigger handler at the oddball word */
					if ((i + 1) == trial.index) {
						/* trigger values: 11 = N4 normal, 21 = P6 normal, 12 = N4 odd, 22 = P6 odd */
						var trig = (trial.ERP_type === "N4") ? 1 : 2;
						/* use type casting to append information about normalacy to trigger value */
						trig = Number(String(trig) + String((trial.normal === true) ? 1 : 2));
 					   	fetch(`http://127.0.0.1:8000/trigger/tcp/${trig}`);
						console.log(trig);
					}
				}
				/* wait for duration specified by delay parameter */
				this.jsPsych.pluginAPI.setTimeout(function() {displayWord()}, (i + 1) * trial.delay);
			}
			
			/* ask is sentence okay, keyboard response & end trial */
			this.jsPsych.pluginAPI.setTimeout(
				() => { //see "migrating to JSPsych v7"
					/* display sentence okay trial */
					var okay = `<div style="font-size:30px;"> 
								<p> Is the sentence okay? </p> 
								<p> F for okay, J for not okay. </p> 
								</div>`;
					display_element.innerHTML = okay;
		
					const after_key_response = (info) => {
					    /* record the response time */
					    data.rt = info.rt;
						data.key_pressed = info.key;
						if (trial.normal) { //normal sentence
							data.correct = (info.key == trial.normal_choice);
						} else { //anomalous sentence
							data.correct = (info.key != trial.normal_choice);
						}
						data.sentence = trial.stimulus;
						data.normal = trial.normal;
						data.ERP_type = trial.ERP_type;
						
						/* end trial */
						this.jsPsych.finishTrial(data);
					}
				    /* set up a keyboard event to respond */
				    this.jsPsych.pluginAPI.getKeyboardResponse({
				    	callback_function: after_key_response,
				    	valid_responses: trial.choices,
				    	persist: false
				    });
				},
			trial.delay * (trial.index + 1));
		}
	}
	ERPSentencePlugin.info = info;

	return ERPSentencePlugin;
})(jsPsychModule);