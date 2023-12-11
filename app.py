from flask import Flask, render_template, request

app = Flask(__name__)

@app.route('/')
def home():
    # Attempt to open and write to a file
    try:
        with open('test_file.txt', 'a') as file:
            file.write('This is a test.')
        write_permission = True
    except Exception as e:
        write_permission = False

    return render_template('quiz.html')

@app.route('/submit_quiz', methods=['POST'])
def submit_quiz():
    try:
        data = request.form
        with open('submissions.txt', 'a') as file:
            file.write(f"{data['name']} | {data['email']} | {data['correctAnswers']} | {data['timeTaken']} | {data['tabChanges']}\n")
        return "Submission recorded"
    except IOError as e:
        return f"Error writing to file: {e}", 500


@app.route('/submissions')
def view_submissions():
    with open('submissions.txt', 'r') as file:
        submissions = file.readlines()
    return '<br>'.join(submissions)

if __name__ == '__main__':
    app.run(debug=True)
