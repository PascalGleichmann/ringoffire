import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collectionData, addDoc, onSnapshot, updateDoc, doc, deleteDoc, limit, orderBy, query, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { collection } from 'firebase/firestore';


@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  firestore: Firestore = inject(Firestore)

  pickCardAnimation = false;
  currentCard: string = '';
  game!: Game;

  unsubGame: any;

  constructor(public dialog: MatDialog) {
  }

  ngOnInit() {
    this.newGame();
    this.unsubGame = this.loadCollectionFromFirestoreDatabase('games');
  }

  loadCollectionFromFirestoreDatabase(colId: string) {
    const collectionInstance = collection(this.firestore, colId);
    const queryInstance = query(collectionInstance); // Create a Firestore query
    return collectionData(queryInstance).subscribe((game) => console.log("Backend saved game: ", game));
  }

  ngOnDestroy() {
    this.unsubGame();
  }

  newGame() {
    this.game = new Game();
    console.log("Local saved game: ", this.game);
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
      if (name && name.length > 0) {
        this.game.players.push(name);
      }
    });
  }
}

