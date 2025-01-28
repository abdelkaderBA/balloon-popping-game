import {
  Component,
  OnInit,
  computed,
  effect,
  signal,
  viewChildren,
} from '@angular/core';
import { BalloonComponent } from './components/balloon/balloon.component';
import { IBalloon } from './balloon.interface';
import { Balloon } from './balloon.class';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BalloonComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  balloonsOnScreen = 5;
  balloons: IBalloon[] = [];
  score = signal(0);
  missed = signal(0);
  maxMisses = 10;
  gameOver = computed(() => {
    return this.missed() === this.maxMisses;
  });
  balloonElements = viewChildren(BalloonComponent);

  constructor() {
    effect(() => {
      if (
        !this.gameOver() &&
        this.balloonElements().length < this.balloonsOnScreen
      ) {
        this.balloons = [...this.balloons, new Balloon()];
      }
    });
  }

  ngOnInit(): void {
    this.startGame();
  }

  startGame(): void {
    this.missed.set(0);
    this.score.set(0);
    this.balloons = new Array(this.balloonsOnScreen)
      .fill(0)
      .map(() => new Balloon());
  }

  balloonPopHandler(balloonId: string): void {
    this.score.update((val) => val + 1);
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);
  }

  balloonMissHandler(balloonId: string): void {
    this.missed.update((val) => val + 1);
    this.balloons = this.balloons.filter((balloon) => balloon.id !== balloonId);
  }
}
