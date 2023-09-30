import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  collectionInstance = collection(this.firestore, 'games');

  constructor(private router: Router, private firestore: Firestore) { };

  // function starts a new game
  newGame() {
    let game = new Game();
    this.addData(game.toJson());
  }

  addData(game: any) {
    if (game) {
      addDoc(this.collectionInstance, game)
        .then((gameInfo: any) => { this.router.navigateByUrl('/game/' + gameInfo.id)})
        .catch((error) => {
          console.error('Document could not saved: ', error);
        })
    }
  }
}
