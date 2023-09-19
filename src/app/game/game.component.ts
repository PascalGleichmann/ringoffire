import { Component, OnInit } from '@angular/core';
import { Game } from '../models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.pickCardAnimation) {
      this.currentCard = this.game.stack.pop() ?? 'card_empty';
      this.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;


      console.log('New Card: ' + this.currentCard);
      console.log('Game is', this.game);


      setTimeout(() => {
        this.game.playedCards.push(this.currentCard);
        this.pickCardAnimation = false;
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

      dialogRef.afterClosed().subscribe((name: string) => {
        this.game.players.push(name);
      });
  }
}

