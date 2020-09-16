export const CHAT_DATA_URL =
  'https://gist.githubusercontent.com/pcperini/97fe41fc42ac1c610548cbfebb0a4b88/raw/cc07f09753ad8fefb308f5adae15bf82c7fffb72/cerebral_challenge.json';

const FAILURE_TEXT = 'Sorry, please try again.';

export class ChatEngine {
  constructor(questions) {
    const dict = {};
    questions.forEach((question) => {
      dict[question.id] = question;
    });
    this.questions = dict;
  }

  currentQuestion = null;

  initialize() {
    this.currentQuestion = this.questions[1];
  }

  getNextQuestionID(value) {
    if (typeof this.currentQuestion.paths === 'number') {
      return this.currentQuestion.paths;
    }

    return this.currentQuestion.paths[value];
  }

  validate(validation, value) {
    if (typeof validation === 'boolean') {
      return validation;
    } else if (Array.isArray(validation)) {
      return validation.includes(value);
    } else {
      const regex = RegExp(validation);
      return regex.test(value);
    }
  }

  check(value) {
    // check if question contains validation
    if (this.currentQuestion.validation) {
      // check if passes validation
      if (this.validate(this.currentQuestion.validation, value)) {
        const nextQuestionId = this.getNextQuestionID(value);

        this.currentQuestion = this.questions[nextQuestionId];
        return this.currentQuestion.question;
      } else {
        return `${FAILURE_TEXT} ${this.currentQuestion.question}`;
      }
    } else {
      return this.currentQuestion.question;
    }
  }
}
