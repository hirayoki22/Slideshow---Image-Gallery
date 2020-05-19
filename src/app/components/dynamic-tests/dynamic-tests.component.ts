import { Component, OnInit } from '@angular/core';

interface Question {
  id: string | number;
  title: string;
  points: number;
  answers?: any[];
  image?: string;
  correctAnswer: string;
  selectedAnswer?: string;  
  timeLimit: string; // 00:00:00
  approved?: boolean;
}

@Component({
  selector: 'dynamic-tests',
  templateUrl: './dynamic-tests.component.html',
  styleUrls: ['./dynamic-tests.component.css']
})
export class DynamicTestsComponent implements OnInit {
  score: number = 10;
  hideQuestion: boolean = false;
  countDown: string = '';
  selected: number;
  activeQuestion: Question;
  index: number = 0;
  
  questions: Question[] = [
    {
      id: 1,
      title: 'If Peter has 6 balloons, calculate the mass and circumference of the Sun',
      points: 5,
      answers: [
        'Infinite',
        'What the heck?',
        'Didn\'t study for this test',
        '1.989 × 10^30 kg',
        'None of the above',
      ],
      correctAnswer: '1.989 × 10^30 kg',
      timeLimit: '00:00:15'
    },
    {
      id: 2,
      title: 'If You Had To Work But Didn’t Need The Money, What Would You Choose To Do?',
      points: 5,
      answers: [
        'An interesting way to ask about the dream career',
        'Wacky, but you’ll find out a lot about their diet',
        'Everyone has a favorite',
        'A great way to get a real debate going',
        'Fun and weird and makes people think',
      ],
      correctAnswer: 'An interesting way to ask about the dream career',
      timeLimit: '00:00:20'
    },
    {
      id: 3,
      title: 'Which of the following best describes the technique used on this photo?',
      points: 2,
      answers: [
        'Long Exposure Photography',
        'Wack af',
        'Weird dude using a gravity quirk',
        'Wingardium leviosa',
        'High Speed Photography',
      ],
      image: 'https://dvyvvujm9h0uq.cloudfront.net/com/articles/1543483387-reinhart-julian-1145947-unsplash.jpg',
      correctAnswer: 'High Speed Photography',
      timeLimit: '00:00:15'
    }
  ];

  constructor() { }

  ngOnInit(): void {
    this.questions = this.questions.map(question => {
      this.shuffleAnswers(question.answers);
      return question;
    });

    this.activeQuestion = this.questions[this.index];
  }

  shuffleAnswers(answers: string[]): string[] {
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    return answers;
  }

  onAnswerClick(question: Question, selection): void {
    this.selected = question.answers.indexOf(selection);
    question.selectedAnswer = selection;
  }

  onTimeout(question: Question): void {
    question.approved = question.selectedAnswer == question.correctAnswer;

    // if (this.index < this.questions.length - 1) {
    //   this.index += 1;
    //   this.selected = null;
    //   this.activeQuestion = this.questions[this.index];
    // } else {
    //   const wrongTotal = this.questions.filter(question => !question.approved).length;
    //   const rightTotal = this.questions.filter(question => question.approved).length;

    //   const score = 
    //     this.questions.filter(question => question.approved)
    //       .map(question => question.points)
    //       .reduce((a, b) => a + b, 0);

    //   console.log
    //   (`
    //     Number of questions: ${this.questions.length},
    //     Total right: ${rightTotal}
    //     Total wrong: ${wrongTotal}
    //     Final score: ${score}
    //   `);
    // }
  }

}
