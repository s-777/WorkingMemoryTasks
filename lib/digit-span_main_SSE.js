/**
 * digit-span_main.js
 * Kyoung Whan Choe (https://github.com/kywch/)
 **/

/*
 * Generic task variables
 */
var sbjId = ""; // mturk id
var task_id = ""; // the prefix for the save file -- the main seq
var data_dir = "";
var flag_debug = false;

/*
 * Task-specific variables
 */
var singleStim_dur = 1000;
var isiGap_dur = 0;

// variables for the adaptive design
var curr_digits_adaptive = 3 // the starting point of adaptive design
var num_trial_adaptive = 12;
var digit_history = [];

var curr_stimSeq = []; // a series of numbers to display
var stimSeq_html = []; // stimSeq is converted into HTML
var feedback = [];
var trial_number = 0;
var corr_history = [];
var rt_history = [];
var max_level = 0;

//Randomize which sequence in the two sets of digit sequences is displayed first.
var EvenOddArray = [1,1,1,1,2,2,2,2];
var SequencePairOrder = jsPsych.randomization.sampleWithReplacement(EvenOddArray, 8);

//An array of all of the digits that participants have typed so far in the current trial
let fullResponse = Array();

//Variable to sum the reaction times as each digit is entered
var totalTrialRT = 0;

//Variable to hold the current response (current digit typed by participant)
var currentResponse;

//Variable for the current number of digits participants are remembering
var currentNumberDigits = 0;

//Variable for which digit (first, second, third) we're having participants enter right now
var currentDigit = 0;

//How many incorrect
var currentIncorrect = 0;


// activity tracking
var focus = 'focus'; // tracks if the current tab/window is the active tab/window, initially the current tab should be focused
var fullscr_ON = 'no'; // tracks fullscreen activity, initially not activated

// these urls must be checked
var save_url = '';

/*
 * Helper functions
 */

var arraysEqual = function (arr1, arr2) {
    if (arr1.length !== arr2.length)
        return false;
    for (var i = arr1.length; i--;) {
        if (arr1[i] !== arr2[i])
            return false;
    }
    return true;
}

var setStims = function (num_digits, number_of_responses) {
	stimSeq_html = [];
	console.log("Original SequencePairOrder for this number of digits: " + JSON.stringify(SequencePairOrder[num_digits-2]));
    switch (num_digits) {
	  case 2:
		//check if the number is even, meaning it's the first time for this number of digits
		if(SequencePairOrder[num_digits-2] % 2 == 0) {
// 			alert("Current number for digit sequence " + JSON.stringify(num_digits) + " (even or odd):" + JSON.stringify(SequencePairOrder[num_digits-2]));
			console.log("The number is even.");
			curr_stimSeq = ["2","5"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            2 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            5 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
            console.log("Current SequencePairOrder for this number of digits: " + JSON.stringify(SequencePairOrder[num_digits-2]));
		}
		// if the number is odd, meaning it should display the second order
		else {
// 			alert("Current number for digit sequence " + JSON.stringify(num_digits) + " (even or odd):" + JSON.stringify(SequencePairOrder[num_digits-2]));
			console.log("The number is odd.");
			curr_stimSeq = ["3","6"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
            console.log("Current SequencePairOrder for this number of digits: " + JSON.stringify(SequencePairOrder[num_digits-2]));
		}
		break;
	  case 3:
		//check if the number is even, meaning it's the first time for this number of digits
		if(SequencePairOrder[num_digits-2] % 2 == 0) {
			console.log("The number is even.");
			curr_stimSeq = ["1","7","6"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            7 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		// if the number is odd, meaning it should display the second order
		else {
			console.log("The number is odd.");
			curr_stimSeq = ["4","8","3"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		break;
	  case 4:
		//check if the number is even, meaning it's the first time for this number of digits
		if(SequencePairOrder[num_digits-2] % 2 == 0) {
			console.log("The number is even.");
			curr_stimSeq = ["6","3","1","9"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            9 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		// if the number is odd, meaning it should display the second order
		else {
			console.log("The number is odd.");
			curr_stimSeq = ["8","0","9","4"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            0 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            9 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		break;
	  case 5:
		//check if the number is even, meaning it's the first time for this number of digits
		if(SequencePairOrder[num_digits-2] % 2 == 0) {
			console.log("The number is even.");
			curr_stimSeq = ["3","5","7","3","4"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            5 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            7 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		// if the number is odd, meaning it should display the second order
		else {
			console.log("The number is odd.");
			curr_stimSeq = ["6","8","4","5","1"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            5 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		break;
	  case 6:
		//check if the number is even, meaning it's the first time for this number of digits
		if(SequencePairOrder[num_digits-2] % 2 == 0) {
			console.log("The number is even.");
			curr_stimSeq = ["9","4","0","5","7","8"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            9 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            0 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            5 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            7 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		// if the number is odd, meaning it should display the second order
		else {
			console.log("The number is odd.");
			curr_stimSeq = ["3","8","6","1","2","6"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            2 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		break;
	  case 7:
		//check if the number is even, meaning it's the first time for this number of digits
		if(SequencePairOrder[num_digits-2] % 2 == 0) {
			console.log("The number is even.");
			curr_stimSeq = ["5","9","4","6","9","7","1"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            5 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            9 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            9 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            7 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		// if the number is odd, meaning it should display the second order
		else {
			console.log("The number is odd.");
			curr_stimSeq = ["1","3","2","5","7","0","3"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            2 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            5 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            7 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            0 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		break;
	  case 8:
		//check if the number is even, meaning it's the first time for this number of digits
		if(SequencePairOrder[num_digits-2] % 2 == 0) {
			console.log("The number is even.");
			curr_stimSeq = ["3","4","8","4","1","3","5","6"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            5 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		// if the number is odd, meaning it should display the second order
		else {
			console.log("The number is odd.");
			curr_stimSeq = ["5","8","6","8","6","1","9","5"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            5 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            9 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            5 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		break;
	  case 9:
		//check if the number is even, meaning it's the first time for this number of digits
		if(SequencePairOrder[num_digits-2] % 2 == 0) {
			console.log("The number is even.");
			curr_stimSeq = ["8","7","2","9","3","1","4","6","8"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            7 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            2 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            9 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            8 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
		// if the number is odd, meaning it should display the second order
		else {
			console.log("The number is odd.");
			curr_stimSeq = ["4","6","1","3","6","9","2","7","9"];
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            4 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            1 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            3 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            6 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            9 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            2 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            7 + '</div></div>');
			stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            9 + '</div></div>');
            //Add one so that the next time, it's the opposite (odd to even or even to odd).
            SequencePairOrder[num_digits-2] = SequencePairOrder[num_digits-2]+3;
		}
	}
}

var getTestText = function () {
    return '<div class = centerbox><div class = center-text>' + digit_sequence[corr_history.length] + ' Digits</p></div>';
}

var getStims = function () {
    return stimSeq_html;
}

var getFeedback = function () {
	if (currentNumberDigits == 2) {
		return ['<div class = centerbox><div class = center-text>' + feedback + '</div></div>'];
    } else {
		return ['<div class = centerbox><div class = center-text> Click "Next" to continue. </div></div>'];
    }
}

function save_data() { // CHECK THE URL before use
    if (flag_debug) {
        console.log("Save data function called.");
        console.log(jsPsych.data.get().json());
    }
    jQuery.ajax({
        type: 'post',
        cache: false,
        url: save_url, // this is the path to the above PHP script
        data: {
            data_dir: data_dir,
            task_id: task_id,
            sbj_id: sbjId,
            sess_data: jsPsych.data.get().json()
        }
    });
}


/*
 * Main backward blocks
 */

var block_start_page = {
    type: 'instructions',
    pages: [
        '<div class = centerbox><p class = block-text>Take a deep breath, and click Next to begin the memory task!</p></div>'
    ],
    allow_keys: false,
    show_clickable_nav: true,
    allow_backward: false,
    show_page_number: false,
    data: {
        exp_stage: 'block_start_instruction',
        task_id: task_id,
        sbj_id: sbjId
    },
    on_finish: function () {
        corr_history = []; // curr_trial = corr_history.length
        rt_history = [];
    }
};


function generate_backward_block_fixed(digit_sequence) {

    // digit_sequence should be defined somewhere
    if (digit_sequence === undefined) {
        if (flag_debug) {
            console.log("Digit sequence is not defined.");
        }
        var digit_sequence = [2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9];
    }
    if (flag_debug) {
        console.log("Digit sequence: ", digit_sequence);
    }

    var block_sequence = [];

    block_sequence.push(block_start_page);

    for (var ii = 0; ii < digit_sequence.length; ii++) {

        var trial_start_page = {
            type: 'html-keyboard-response',
            is_html: true,
            stimulus: function () {
                return '<div class = centerbox><div class = center-text>' + digit_sequence[corr_history.length] + ' Digits</p></div>';
            },
            data: {
                exp_stage: "trial_start_page_" + ii.toString()
            },
            choices: 'none',
            stimulus_duration: 1000,
            trial_duration: 2000,
            response_ends_trial: false,
            on_finish: function () {
                setStims(digit_sequence[corr_history.length],corr_history.length);
                if (flag_debug) {
                    console.log('Curr digits and stimSeq: ', digit_sequence[corr_history.length], curr_stimSeq);
                }
            }
        };
        block_sequence.push(trial_start_page);

        // show_digits
//         alert("Current sequence pair order: " + JSON.stringify(SequencePairOrder));
        var show_digits_page = {
            type: 'multi-html-noresp',
            stimulus: getStims,
            stimulus_duration: singleStim_dur,
            isigap_duration: isiGap_dur,
            data: {
                exp_stage: "show_digits_page_" + ii.toString()
            },
            on_finish: function () {
                jsPsych.data.addDataToLastTrial({
                    "stimSeq": curr_stimSeq
                });
                totalTrialRT = 0;
                currentNumberDigits = digit_sequence[corr_history.length];
                currentDigit = 0;
                console.log('currentNumberDigits and currentDigit: ', currentNumberDigits, currentDigit);
            }
        };
        block_sequence.push(show_digits_page);

		//Get a keyboard response (have them type one key) for each digit of the current sequence.
		var oneDigitFromParticipant = {
			type: 'html-keyboard-response',
			stimulus: '<p>Please type each digit in the reverse order that you saw it.</p>',
            data: {
                exp_stage: "get_digit_from_participant_digit_equals" + currentDigit.toString()
            },
			choices: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'],
// 			prompt: '<p>Just type the numbers themselves, one by one. <BR> So far you have typed the following: </p>' + JSON.stringify(fullResponse),
			prompt: function(){
			  return "<p>Just type the numbers themselves, one by one. <BR> So far you have typed the following: </p>" + fullResponse.toString().replace(/,/g, ', ');
			},
			
			on_finish: function (data) {			
				//keep track of digits typed
				currentResponse = data.response;
				fullResponse.push(data.response);
				totalTrialRT = totalTrialRT + data.rt;
                currentDigit = currentDigit+1;
				console.log("Response for digit " + currentDigit.toString() + ": " + JSON.stringify(currentResponse) + ", fullResponse = " + JSON.stringify(fullResponse) + " totalTrialRT = " + totalTrialRT.toString());

			}
		};
		
		var fullResponseFromParticipant = {
			timeline: [oneDigitFromParticipant],
			loop_function: function(data){
				console.log('In loop_node, currentDigit: ', currentDigit);
				if(currentDigit !== currentNumberDigits){
					return true;
				} else {
					return false;
				}
			}
		}
 		block_sequence.push(fullResponseFromParticipant);

		//Show the last typed digit and wrap things up.
		var AfterFinalDigitFromParticipant = {
			type: 'html-keyboard-response',
			stimulus: '<p>Please type each digit in the reverse order that you saw it.</p>',
            data: {
                exp_stage: "full_response_received_for_X_digits_equals" + currentNumberDigits.toString()
            },
			choices: jsPsych.NO_KEYS,
			prompt: function(){
			  return "<p>Just type the numbers themselves, one by one. <BR> So far you have typed the following: </p>" + fullResponse.toString().replace(/,/g, ', ');
			},
			trial_duration: 500,
			
			on_finish: function (data) {			
				console.log("Trail ended. DETAILS: Response for digit " + currentDigit.toString() + ": " + JSON.stringify(currentResponse) + ", fullResponse = " + JSON.stringify(fullResponse) + " totalTrialRT = " + totalTrialRT.toString());
				//Now that we have the full sequence, we can evaluate if it's correct and save it.	
				response = fullResponse;
				rt_history.push(totalTrialRT);
				console.log('responses and RT: ', response, rt_history);

				reversedResponse = response.reverse();
				var correct = arraysEqual(reversedResponse, curr_stimSeq);
				corr_history.push(correct);
				if (correct) {
					feedback = '<span style="color:green">Correct!</span>';
					if (max_level < digit_sequence[corr_history.length]) {
						max_level = digit_sequence[corr_history.length];
					}
				} else {
					feedback = '<span style="color:red">Incorrect</span>';
					currentIncorrect = currentIncorrect + 1;
					console.log('currentIncorrect: ', currentIncorrect);
				}
				digit_history.push(currentNumberDigits);
				jsPsych.data.addDataToLastTrial({
					"stimSeq": curr_stimSeq,
					"condition": "reverse",
					"correct": correct,
					"sequenceEntered": fullResponse
				});

				//Now that we're done with the currently entered sequence from the participant, clear it for the next trial.
				fullResponse = [];

			}
		};
		block_sequence.push(AfterFinalDigitFromParticipant);
		
        // feedback, click to continue
        var feedback_page = {
            type: 'instructions',
            pages: getFeedback,
            allow_keys: false,
            show_clickable_nav: true,
            allow_backward: false,
            show_page_number: false,
            data: {
                exp_stage: "feedback_page_" + ii.toString()
            },
			on_finish: function (data) {
				//If they get one or more wrong in the set of sequences for the current number of digits, end the memory task
				if ((currentIncorrect > 0) && (SequencePairOrder[currentNumberDigits-2] >= 7)) {
					jsPsych.endExperiment('The experiment was ended due to a wrong answer');
					console.log('Ending experiment due to a wrong answer.');
				}
			}
        };
        block_sequence.push(feedback_page);
    }

    return block_sequence;

}
