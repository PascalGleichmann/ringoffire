import { Component, OnInit, inject } from '@angular/core';
import { Game } from '../models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { Firestore, collection, collectionData, addDoc, doc, query, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

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

  async ngOnInit() {
    this.newGame();
    this.unsubGame = this.loadCollectionFromFirestoreDatabase('games');
  }

  loadCollectionFromFirestoreDatabase(colId: string) {
    return onSnapshot(this.getCollectionRef(colId), (game) => { console.log(game)});
  }

  getCollectionRef(colId: string) { // enter the collections Name as string
    const aCollection = collection(this.firestore, colId);
    return aCollection;
  }

  ngOnDestroy() {
    this.unsubGame();
  }

  async newGame() {
    this.game = new Game();
    console.log("Local saved game: ", this.game);

    /*
    const docRef = await addDoc(collection(this.firestore, 'games'), this.game)
      .catch
      ((error) => { console.error(error) })
      .then
      (() => { console.log("Document written: ", docRef) });
      */
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

