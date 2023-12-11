
    // Define tabChangeCount and initialize it to 0
    var tabChangeCount = 0;

    // Add an event listener to track tab changes
    $(document).on("visibilitychange", function() {
    if (document.hidden) {
        // Tab is hidden (user switched to another tab or minimized the browser)
        tabChangeCount++;
    }
});

    var questions = [
        {
            question: "In SQL, how do you select the total sales amount, grouped by 'Country', from a table named 'Sales'?",
            choices: ["SELECT Country, SUM(Amount) FROM Sales GROUP BY Country", "SELECT SUM(Amount), Country FROM Sales", "SELECT Country, TOTAL(Amount) FROM Sales", "GROUP BY Country, SELECT SUM(Amount) FROM Sales"],
            answer: 0
        },
        {
            question: "In Google Data Studio, what is the purpose of the 'Data Extract' feature?",
            choices: [
                "To import data from external sources",
                "To create a snapshot of your report's data at a specific point in time",
                "To visualize data using charts and graphs",
                "To schedule automated data refreshes"
            ],
            answer: 1
        }
,        
        {
            question: "In GA4, which of the following event is NOT tracked by default using 'Enhanced Measurement'?",
            choices: [
                "Form Submissions",
                "Page scrolls",
                "File downloads",
                "Purchase"
            ],
            answer: 1
        },
        
        {
            question: "In data preprocessing, what is the purpose of 'data normalization'?",
            choices: [
                "To make data more complex and harder to analyze.",
                "To remove missing values from the dataset.",
                "To scale data to a standard range to ensure fair comparisons.",
                "To convert categorical data into numerical format."
            ],
            answer: 2
        },
        {
            question: "When integrating a Customer Data Platform (CDP) with other systems, what is a key consideration for maintaining data integrity?",
            choices: ["Data deduplication and quality control", "Real-time data syncing", "Automated email campaigns", "Visual dashboard updates"],
            answer: 0
        },
        {
            question: "In a relational database, what is the primary purpose of defining 'foreign keys'?",
            choices: ["To speed up data retrieval", "To link tables together and enforce referential integrity", "To encrypt sensitive data", "To define unique identifiers for each table"],
            answer: 1
        },
        {
            question: "In the context of Power BI, what does 'Row-Level Security' (RLS) provide?",
            choices: ["Data encryption at the row level", "Restriction of data access for particular users based on row data", "Faster data processing by limiting rows", "Automated backup of each data row"],
            answer: 1
        },
        {
            question: "What is a common challenge when performing 'cross-platform tracking' in a fragmented digital landscape?",
            choices: ["Dealing with data silos and inconsistent data collection methods", "Choosing the right color scheme for reports", "Implementing responsive design in email marketing", "Synchronizing time zones across platforms"],
            answer: 0
        },
        {
            question: "In SQL, how would you write a query to display the three highest earning 'customers' from a 'Sales' table?",
            choices: ["SELECT TOP 3 * FROM Sales ORDER BY Earnings DESC", "SELECT MAX(3, CustomerID) FROM Sales", "SELECT CustomerID FROM Sales ORDER BY Earnings DESC LIMIT 3", "SELECT FIRST(3, CustomerID) FROM Sales SORT BY Earnings"],
            answer: 2
        },
        {
            question: "Which type of chart is commonly used to compare individual items to the whole?",
            choices: [
                "Bar chart",
                "Line chart",
                "Pie chart",
                "Scatter plot"
            ],
            answer: 2
        }
        
    ];

    var startTime, endTime;
    var interval;

    $(document).ready(function() {
        $('#start-test').click(function() {
            if ($('#name').val() && $('#email').val()) {
                $('#intro-container').hide();
                $('#quiz-container').show();
                generateQuiz();
                startTimer(); // Start the timer when the test begins
            } else {
                alert('Please enter your name and email.');
            }
        });

        $('#submit').click(function() {
            if (allQuestionsAnswered()) {
                stopTimer(); // Stop the timer when submitting
                var correctAnswersCount = getCorrectAnswersCount();
                var timeTaken = calculateTimeTaken(); // Calculate timeTaken here
                var userData = {
                    name: $('#name').val(),
                    email: $('#email').val(),
                    correctAnswers: correctAnswersCount,
                    timeTaken: timeTaken, // Use the calculated timeTaken
                    tabChanges: tabChangeCount // Use the tracked tab changes
                };

                // AJAX request to send data to server
                $.post('/submit_quiz', userData, function(response) {
                    console.log('Server response:', response);
                    
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    console.log('AJAX request failed:', textStatus, errorThrown);
                });
                displayAnalysisTask();

            } else {
                alert('Please answer all the questions before submitting.');
            }
        });
    });

    function generateQuiz() {
        var quizContainer = $('#quiz');
        quizContainer.empty();

        questions.forEach((q, index) => {
            var questionDiv = $('<div>', { class: 'question' });
            var questionText = $('<p>').text((index + 1) + '. ' + q.question);
            questionDiv.append(questionText);

            var choiceLabels = ['A', 'B', 'C', 'D'];
            q.choices.forEach((choice, choiceIndex) => {
                var optionDiv = $('<div>', { class: 'option' });
                var label = $('<label>');
                var radioInput = $('<input>', { type: 'radio', name: 'question' + index, value: choiceIndex });
                label.append(radioInput, " " + choiceLabels[choiceIndex] + ": " + choice);
                optionDiv.append(label);
                questionDiv.append(optionDiv);
            });

            quizContainer.append(questionDiv);
        });
    }

    function allQuestionsAnswered() {
        var allAnswered = true;
        questions.forEach((q, index) => {
            if (!$(`input[name='question${index}']:checked`).val()) {
                allAnswered = false;
            }
        });
        return allAnswered;
    }

    function calculateTimeTaken() {
        // Calculate the time taken in seconds
        var timeDiff = endTime - startTime; // in ms
        timeDiff /= 1000; // convert to seconds
        return Math.round(timeDiff); // Round the time taken to the nearest second
    }

    function displayAnalysisTask() {
        $('#quiz-container').hide();
        var analysisTaskHtml = '<div class="quiz-container" id="analysis-container">' +
                        '<h2>Part 2: Analysis Task</h2>' +
                        '<p>Please conduct an analysis using the provided dataset and uncover relevant insights based on your findings. You have the freedom to explore any interesting aspects of the data and present your insights in a format of your choice, such as a PowerPoint presentation, Google Slides document, or your preferred Business Intelligence (BI) Dashboard.</p>' +
                        '<p><strong>Dataset:</strong> <a href="https://drive.google.com/file/d/1YjGIzLGRRTpxYtQgioeoKtm03YdVmNgd/view" target="_blank">Netflix Movies and TV Shows (Download Link)</a></p>' +
                        '<p><strong>About this Dataset:</strong> Netflix is one of the most popular media and video streaming platforms with over 8000 movies and TV shows available. As of mid-2021, they have over 200 million subscribers globally. This tabular dataset includes listings of all the movies and TV shows on Netflix, along with details such as cast, directors, ratings, release year, duration, and more.</p>' +
                        '<p><strong>Possible Analysis Tasks:</strong></p>' +
                        '<ul>' +
                        '<li>Understanding what content is available in different countries</li>' +
                        '<li>Identifying similar content by matching text-based features</li>' +
                        '<li>Network analysis of actors/directors to uncover interesting insights</li>' +
                        '<li>Any other analysis or exploration you find compelling</li>' +
                        '</ul>' +
                        '<p><strong>Submission Deadline:</strong> Please submit your analysis within 5 days from the time you receive this test.</p>' +
                        '<p><strong>Submission Email:</strong> Please submit your analysis to bahtiar@mediatropy.com.</p>' +
                        '<button id="submit-analysis">Acknowledge</button>' +
                        '</div>';

        $('body').append(analysisTaskHtml);

        $('#submit-analysis').click(function() {
            // Handle submission of analysis task here
            alert('Thank you!');
        });
    }

    function startTimer() {
        startTime = new Date();
        interval = setInterval(updateTimer, 1000); // Update the timer every second
    }

    function updateTimer() {
        var currentTime = new Date();
        var timeDiff = currentTime - startTime; 
        timeDiff /= 1000; 
        var seconds = Math.round(timeDiff);
        $('#timer').text('Time: ' + seconds + ' seconds'); // Update the timer display
    }

    function stopTimer() {
        clearInterval(interval); // Stop the interval
        endTime = new Date();
        var timeDiff = endTime - startTime;
        timeDiff /= 1000;
        var seconds = Math.round(timeDiff);
        console.log(seconds + " seconds"); // Log the total time
    }

    function getCorrectAnswersCount() {
        let count = 0;
        questions.forEach((question, index) => {
            var selectedAnswer = $(`input[name='question${index}']:checked`).val();
            if (selectedAnswer == question.answer) {
                count++;
            }
        });
        return count;
    }

