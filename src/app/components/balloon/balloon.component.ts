import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  inject,
  input,
} from '@angular/core';
import { IBalloon } from '../../balloon.interface';
import { AnimationBuilder, animate, style } from '@angular/animations';

@Component({
  selector: 'app-balloon',
  standalone: true,
  imports: [],
  templateUrl: './balloon.component.html',
  styleUrl: './balloon.component.scss',
})
export class BalloonComponent implements OnInit {
  balloon = input.required<IBalloon>();
  animationBuilder = inject(AnimationBuilder);
  elRef = inject(ElementRef);
  @Output() balloonPopped = new EventEmitter<string>();
  @Output() balloonMissed = new EventEmitter<string>();

  ngOnInit(): void {
    this.animateBalloon();
  }

  pop() {
    this.balloonPopped.emit(this.balloon().id);
  }

  private animateBalloon(): void {
    const buffer = 20;
    const maxWidth =
      window.innerWidth -
      this.elRef.nativeElement.firstChild.clientWidth -
      buffer;
    const leftPosition = Math.floor(Math.random() * maxWidth);
    const minSpeed = 2;
    const speedVariation = 3;
    const speed = minSpeed + Math.random() * speedVariation; // 5s - 10s
    const flyAnimation = this.animationBuilder.build([
      style({
        translate: `${leftPosition}px 0`,
        position: 'fixed',
        left: 0,
        bottom: 0,
      }),
      animate(
        `${speed}s ease-in-out`,
        style({
          translate: `${leftPosition}px -100vh`,
        })
      ),
    ]);
    const player = flyAnimation.create(this.elRef.nativeElement.firstChild);
    player.play();
    player.onDone(() => {
      console.log('emit');
      console.log(this.balloon().id);

      this.balloonMissed.emit(this.balloon().id);
    });
  }
}
