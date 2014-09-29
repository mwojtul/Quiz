window.onload = (function(){

	Question.objects = [];
	var score = 0;

	function Question(question, choices, answer){
		this.question = question;
		this.choices = choices;
		this.answer = answer;
		Question.objects.push(this);	
	}



	Question.prototype = {
		constructor: Question,

		askQuestion: function(){
			this.generateQuestion();
			this.validateQuestion();
		},

		generateQuestion: function(){
			var parentDiv = document.getElementById('form');
			var submit = document.getElementById('submit');
			var formGroup = document.createElement('DIV');
			formGroup.setAttribute('class', 'form-group');


			var question = document.createElement('H1');
			var questionText = document.createTextNode(this.question);
			question.appendChild(questionText);
			formGroup.appendChild(question);

			parentDiv.insertBefore(formGroup, submit);


			for(var i = 0; i < this.choices.length; i++){

				var label = document.createElement('label');

				var radioInput = document.createElement('input');
				radioInput.setAttribute('type', 'radio');
				radioInput.setAttribute('name', this.question.toLowerCase().replace(/ /g, '-').replace(/\?|\./g,''));
				radioInput.setAttribute('value', i);
				label.appendChild(radioInput);

				var choiceText = document.createTextNode(this.choices[i]);
				label.appendChild(choiceText);

				var choice = document.createElement('DIV');
				choice.setAttribute('class', 'radio');
				choice.appendChild(label);


				formGroup.appendChild(choice);
				//console.log(this.choices[i]);

			}
		},		

		validateQuestion: function(){		
			var submit = document.getElementById('submit');
			var answer = this.answer;
			var radios = this.question.toLowerCase().replace(/ /g, '-').replace(/\?|\./g,'');
			radios = document.getElementsByName(radios);
			var isChecked = false;
			var that = this;


			submit.onclick = function(event){
				event.preventDefault();
				for(var i = 0, length = radios.length; i < length; i++){
					if(radios[i].checked){
						if(radios[i].value == answer){
							//console.log('correct');
							//console.log(that);
							that.calculateScore();
						}

						isChecked = true;
						break;
					}
				} 
				//console.log(isChecked ? 'checked' : 'not checked');
				

				if(isChecked){
					that.nextQuestion();
				} else {
					alert('Please pick an answer!');
				}
			}

		},

		calculateScore: function(){
			score ++;
		},	

		nextQuestion: function(){
			var parentDiv = document.getElementById('form');
			var formGroup = document.querySelector('.form-group');
			var nextQuestion = Question.objects.indexOf(this) + 1;
			parentDiv.removeChild(formGroup);
			
			if(Question.objects[nextQuestion]){
				Question.objects[nextQuestion].askQuestion();
			} else {
				this.displayResults();
			}
		},

		displayResults: function(){
			var parentDiv = document.getElementById('form');
			var submit = document.getElementById('submit');

			parentDiv.removeChild(submit);

			var results = document.createElement('h1');
			var resultsText = document.createTextNode('Thanks for playing! You answered ' + score + ' out of ' + Question.objects.length + ' questions correctly.');
			results.appendChild(resultsText);
			parentDiv.appendChild(results);


		}

	};

	var question1 = new Question('What city is The Knick set in?', ['Chicago', 'New York', 'Philadelphia', 'Los Angeles'], 1);
	var question2 = new Question('Who plays Dr. John W. Thackery?', ['Clive Owen', 'Daniel Craig', 'Mattew McConaughey', 'Tom Hardy'], 0);
	var question3 = new Question('Who is Dr. John W. Thackery based on?', ['Howard Atwood Kelly', 'William H. Welch', 'William Stewart Howard', 'William Osler'], 2)
	var question4 = new Question('What network does the show air on?', ['HBO', 'Showtime', 'AMC', 'Cinemax'], 3);


	question1.askQuestion();



})();












