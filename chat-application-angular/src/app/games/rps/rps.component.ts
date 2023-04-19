import { ThrowStmt } from '@angular/compiler';
import { Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'app-rps',
  templateUrl: './rps.component.html',
  styleUrls: ['./rps.component.css']
})
export class RpsComponent implements OnInit {

  userScore = 0;
  computerScore = 0;

  @ViewChild('results', { static: false })
  public results: ElementRef;

  constructor(private renderer: Renderer2) { }

  ngOnInit(): void {
  }

  gameOptions = ['rock', 'paper', 'scissors'];

  emojis = [
    {
      name: 'rock',
      emoji: '✊'
    },
    {
      name: 'paper',
      emoji: '🖐️'
    },
    {
      name: 'scissors',
      emoji: '✌️'
    }
  ]

  handleClick(userSelectedOption) {
    console.log("userSelectedOption : ", userSelectedOption);
    let computerGeneratedOption = this.generateRandomOption();
    console.log("computerGeneratedOptions : ", computerGeneratedOption);

    let userOptionButton = this.renderer.createElement('button');
    let userButtonText = this.renderer.createText(this.emojis.find(e => e.name === userSelectedOption).emoji);
    this.renderer.addClass(userOptionButton, 'result-emoji');
    this.renderer.addClass(userOptionButton, 'dynamic');
    this.renderer.appendChild(userOptionButton, userButtonText);
    this.renderer.appendChild(this.results.nativeElement, userOptionButton);

    let computerOptionButton = this.renderer.createElement('button');
    let computerButtonText = this.renderer.createText(this.emojis.find(e => e.name === computerGeneratedOption).emoji);
    this.renderer.addClass(computerOptionButton, 'result-emoji');
    this.renderer.addClass(computerOptionButton, 'dynamic');
    this.renderer.appendChild(computerOptionButton, computerButtonText);
    this.renderer.appendChild(this.results.nativeElement, computerOptionButton);


    if (userSelectedOption === computerGeneratedOption) {
      console.log("draw");
    } else {
      let userWinner = this.isUserWinner(userSelectedOption, computerGeneratedOption);
      console.log("user won? ", userWinner);
      if (userWinner) {
        ++this.userScore;
        this.renderer.addClass(userOptionButton, 'winner');
      } else {
        ++this.computerScore;
        this.renderer.addClass(computerOptionButton, 'winner');
      }
    }
  }

  isUserWinner(userSelectedOption, computerGeneratedOption) {
    if (userSelectedOption === 'rock') {
      return computerGeneratedOption === 'scissors';
    } else if (userSelectedOption === 'paper') {
      return computerGeneratedOption === 'rock';
    } else if (userSelectedOption === 'scissors') {
      return computerGeneratedOption === 'paper';
    }
  }

  generateRandomOption() {
    return this.gameOptions[Math.floor(Math.random() * this.gameOptions.length)];
  }

  reset() {
    this.userScore = 0;
    this.computerScore = 0;
    let dynamicElements = document.getElementsByClassName('dynamic');
    console.log(dynamicElements);
    Array.from(dynamicElements).forEach(ele => ele.remove());
  }

}
