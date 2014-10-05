window.onload = (function(){

	var score = 0;

	function Quiz(data, question){
		this.data = data;
		this.question = question;
	}

	Quiz.prototype = {
		constructor: Quiz,	

		getQuestions: function(){
			var testt = 'test';
			function getQuestions(path, callback) {
				var httpRequest = new XMLHttpRequest();
				httpRequest.onreadystatechange = function() {
					if (httpRequest.readyState === 4) {
						if (httpRequest.status === 200) {
							var data = JSON.parse(httpRequest.responseText);
							if (callback) callback(data);
						}
					}
				};
				httpRequest.open('GET', path);
				httpRequest.send(); 
			};

			var that = this;
			getQuestions(this.data, function(data){
				Quiz.prototype.generateQuestion(data, that.question);
			});

		},

		generateQuestion: function(data, question){
			//Defining question items
			var question = data[question];
			var questionTitle = question.title;
			var questionChoices = question.choices;

			//For later use
			var parentDiv = document.getElementById('form');
			var submit = document.getElementById('submit');

			//Creating formGroup div
			var formGroup = document.createElement('DIV');
			formGroup.setAttribute('class', 'form-group');

			//Creating question heading
			var questionHeading = document.createElement('H1');
			var questionText = document.createTextNode(questionTitle);
			questionHeading.appendChild(questionText);
			
			//Adding question title to the formGroup div
			formGroup.appendChild(questionHeading);

			//Inserting the formGroup into the form container before the submit button
			parentDiv.insertBefore(formGroup, submit);


			//looping through question.choices to generate radio buttons
			for(var i = 0; i < questionChoices.length; i++){

				//Creating radio buttons
				var label = document.createElement('label');
				var radioInput = document.createElement('input');
				radioInput.setAttribute('type', 'radio');
				radioInput.setAttribute('name', questionTitle.toLowerCase().replace(/ /g, '-').replace(/\?|\./g,''));
				radioInput.setAttribute('value', i);				

				//Creating choice text
				var choiceText = document.createTextNode(questionChoices[i]);

				//Adding radio buttons and choice text inside label
				label.appendChild(radioInput);
				label.appendChild(choiceText);

				//Creating div.choice and adding label inside
				var choice = document.createElement('DIV');
				choice.setAttribute('class', 'radio');
				choice.appendChild(label);

				//Adding div.choice to formGroup div
				formGroup.appendChild(choice);
				//console.log(this.choices[i]);
			}

			//Call validation function
			Quiz.prototype.validateQuestion(data, question);
		},

		validateQuestion: function(data, question){
			//Defining question items
			var answer = question.answer;
			var radios = question.title.toLowerCase().replace(/ /g, '-').replace(/\?|\./g,'');
			radios = document.getElementsByName(radios);
			var that = this;
			
			//Validating
			var isChecked = false;
			document.getElementById('submit').onclick = function(event){
				event.preventDefault();
				//Looping through the choices
				for(var i = 0, length = radios.length; i < length; i++){
					//if the value is checked and correct, calculate score by calling the calculateScore function
					if(radios[i].checked){
						if(radios[i].value == answer){
							console.log('correct');
							//console.log(that);
							that.calculateScore();
						}

						isChecked = true;
						break;
					}
				} 
				
				//If an answer was selected, proceed to the next question
				if(isChecked){
					that.nextQuestion(data, question);
				} else {
					alert('Please pick an answer!');
				}
			}

		},

		calculateScore: function(){
			score ++;
		},

		nextQuestion: function(data, question){
			//Removing current question
			var parentDiv = document.getElementById('form');
			var formGroup = document.querySelector('.form-group');
			parentDiv.removeChild(formGroup);
			
			//If another question exists, generate it, otherwise display the results
			var nextQuestion = data.indexOf(question) + 1;
			if(data[nextQuestion]){
				Quiz.prototype.generateQuestion(data, nextQuestion);
			} else {
				Quiz.prototype.displayResults(data);
			}
		},

		displayResults: function(data){
			//Removing submit button
			var parentDiv = document.getElementById('form');
			var submit = document.getElementById('submit');
			parentDiv.removeChild(submit);

			//Displaying results
			var results = document.createElement('h1');
			var resultsText = document.createTextNode('Thanks for playing! You answered ' + score + ' out of ' + data.length + ' questions correctly.');
			results.appendChild(resultsText);
			parentDiv.appendChild(results);
		}		
	};

	var quiz = new Quiz('./js/questions.json', 0);
	quiz.getQuestions();

})();












