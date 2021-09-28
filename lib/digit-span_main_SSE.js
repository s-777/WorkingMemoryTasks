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
// 			alert("Current number for digit sequence " + JSON.stringify(num_digits) + " (even or odd) AFTER display:" + JSON.stringify(SequencePairOrder[num_digits-2]));
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
// 			alert("Current number for digit sequence " + JSON.stringify(num_digits) + " (even or odd) AFTER display:" + JSON.stringify(SequencePairOrder[num_digits-2]));
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
// 	alert(JSON.stringify(curr_stimSeq));
/* 
    if (num_digits > 9) {
        var nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
    } else {
        var nums = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    }
    curr_stimSeq = jsPsych.randomization.sampleWithoutReplacement(nums, num_digits);
    stimSeq_html = [];
    for (var ii = 0; ii < num_digits; ii++) {
        stimSeq_html.push('<div class = centerbox><div class = digit-span-text>' +
            curr_stimSeq[ii] + '</div></div>');
    }
 */
}

var getTestText = function () {
    return '<div class = centerbox><div class = center-text>' + digit_sequence[corr_history.length] + ' Digits</p></div>';
}

var getStims = function () {
    return stimSeq_html;
}

var getFeedback = function () {
    return ['<div class = centerbox><div class = center-text>' + feedback + '</div></div>'];
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
        alert("Current sequence pair order: " + JSON.stringify(SequencePairOrder));
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
                })
            }
        };
        block_sequence.push(show_digits_page);

        // get_response
        var numpad_response_page = {
            type: 'numpad-response',
            post_trial_duration: 500,
            data: {
                exp_stage: "get_backward_response_" + ii.toString()
            },
            on_finish: function (data) {
                response = data.digit_response;
                rt_history.push(data.rt);

				reversedResponse = response.reverse();
// 				alert(JSON.stringify(reversedResponse);
// 				alert("Response reversed:" + JSON.stringify(reversedResponse));
                var correct = arraysEqual(reversedResponse, curr_stimSeq);
                corr_history.push(correct);
                if (correct) {
                    feedback = '<span style="color:green">Correct!</span>';
                    if (max_level < digit_sequence[corr_history.length]) {
                        max_level = digit_sequence[corr_history.length];
                    }
                } else {
                    feedback = '<span style="color:red">Incorrect</span>';
                }
                jsPsych.data.addDataToLastTrial({
                    "stimSeq": curr_stimSeq,
                    "condition": "reverse",
                    "correct": correct
                });
            }
        };
        block_sequence.push(numpad_response_page);

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
            }
        };
        block_sequence.push(feedback_page);
    }

    return block_sequence;

}

function generate_backward_block_adaptive(num_trials) {

    var block_sequence = [];

    block_sequence.push(block_start_page);

    for (var ii = 0; ii < num_trials; ii++) {

        var trial_start_page = {
            type: 'html-keyboard-response',
            is_html: true,
            stimulus: function () {
                return '<div class = centerbox><div class = center-text>' + curr_digits_adaptive + ' Digits</p></div>';
            },
            data: {
                exp_stage: "trial_start_page_" + ii.toString()
            },
            choices: 'none',
            stimulus_duration: 1000,
            trial_duration: 2000,
            response_ends_trial: false,
            on_finish: function () {
                digit_history.push(curr_digits_adaptive);
                setStims(curr_digits_adaptive);
                if (flag_debug) {
                    console.log('Curr digits and stimSeq: ', curr_digits_adaptive, curr_stimSeq);
                }
            }
        };
        block_sequence.push(trial_start_page);

        // show_digits
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
                })
            }
        };
        block_sequence.push(show_digits_page);

        // get_response
        var numpad_response_page = {
            type: 'numpad-response',
            post_trial_duration: 500,
            data: {
                exp_stage: "get_backward_response_" + ii.toString()
            },
            on_finish: function (data) {
                response = data.digit_response;
                rt_history.push(data.rt);

                var correct = arraysEqual(response.reverse(), curr_stimSeq);
                corr_history.push(correct);

                /*
                    Staircasing: 
                    Single correct -- increase one digits
                    Two incorrect responses -- decrease one digit
                */
                if (correct) {
                    feedback = '<span style="color:green">Correct!</span>';
                    curr_digits_adaptive = curr_digits_adaptive + 1;
                    if (flag_debug) {
                        console.log('Correct! increase one digit');
                    }
                } else {
                    feedback = '<span style="color:red">Incorrect</span>';
                    if (corr_history[corr_history.length - 2] == false && digit_history[digit_history.length - 2] == curr_digits_adaptive) {
                        // two incorrect responses
                        if (flag_debug) {
                            console.log('Two incorrects! decrease one digit');
                        }
                        if (curr_digits_adaptive > 2) {
                            // 2 is the absolute floor
                            curr_digits_adaptive = curr_digits_adaptive - 1;
                        } else {
                            curr_digits_adaptive = 2;
                        }
                    } else {
                        if (flag_debug) {
                            console.log('One incorrect! keep the digit');
                        }
                    }
                }

                jsPsych.data.addDataToLastTrial({
                    "stimSeq": curr_stimSeq,
                    "condition": "reverse",
                    "correct": correct
                });
            }
        };
        block_sequence.push(numpad_response_page);

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
            }
        };
        block_sequence.push(feedback_page);
    }

    return block_sequence;

}

