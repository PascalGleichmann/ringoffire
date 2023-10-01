import { Component, Input, OnInit, inject } from '@angular/core';
import { Game } from '../models/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { MatDialog } from '@angular/material/dialog';
import { FirebaseApp } from '@angular/fire/app';
import { Firestore, collectionData, collection, onSnapshot, doc, addDoc, docData, CollectionReference, DocumentReference, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent {

  game: Game = new Game();
  gameDocId!: string;
  collectionInstance!: CollectionReference;

  constructor(public dialog: MatDialog, private firestore: Firestore, private route: ActivatedRoute) {
    this.collectionInstance = collection(this.firestore, 'games');
    this.route.params.subscribe((params) => {
      this.gameDocId = params['id'];
      this.getGame(params['id']);
    });
  }

  getGame(docId: string) {
    onSnapshot(doc(this.collectionInstance, docId), (game) => {
      console.log(game.data());
        this.game.players = game.data()!['players'];
        this.game.stack = game.data()!['stack'];
        this.game.playedCards = game.data()!['playedCards'];
        this.game.currentPlayer = game.data()!['currentPlayer'];
        this.game.pickCardAnimation = game.data()!['pickCardAnimation'];
        this.game.currentCard = game.data()!['currentCard'];
    });
  }

  takeCard() {
    if (!this.game.pickCardAnimation) {
      this.game.currentCard = this.game.stack.pop() ?? 'card_empty';
      this.game.pickCardAnimation = true;
      this.game.currentPlayer++;
      this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
      this.saveGame();

      console.log('New Card: ' + this.game.currentCard);
      console.log('Game is', this.game);

      setTimeout(() => {
        this.game.playedCards.push(this.game.currentCard);
        this.game.pickCardAnimation = false;
        this.saveGame();
      }, 1000);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.saveGame();
      }
    });
  }

  async saveGame() {
    await updateDoc(doc(collection(this.firestore, 'games'), this.gameDocId), this.game.toJson()).catch((error => { console.error(error) }));
  }
}

