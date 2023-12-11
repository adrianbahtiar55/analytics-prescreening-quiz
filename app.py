from flask import Flask, render_template, request
import requests

app = Flask(__name__)

WEBHOOK = 'https://maker.ifttt.com/trigger/quiz/json/with/key/hxHyMyXbPqHP4etuR9rbSGHofOd5p80C2PC4cyWjPqQ'

@app.route('/')
def home():
    return render_template('quiz.html')

@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    try:
        data = request.form
        # Send data to webhook
        payload = {
            'name': data['name'],
            'email': data['email'],
            'correctAnswers': data['correctAnswers'],
            'timeTaken': data['timeTaken'],
            'tabChanges': data['tabChanges']
                }
        headers = {'Content-Type': 'application/json'}  # Set the Content-Type header
        response = requests.post(WEBHOOK, json=payload, headers=headers)

        # Check if the request was successful
        if response.status_code == 200:
            return "Submission recorded and sent to Zapier"
        else:
            return "Error sending data to Zapier", 500

    except Exception as e:
        return f"Error: {str(e)}", 500


@app.route('/submissions')
def view_submissions():
    with open('submissions.txt', 'r') as file:
        submissions = file.readlines()
    return '<br>'.join(submissions)

if __name__ == '__main__':
    app.run(debug=True)
