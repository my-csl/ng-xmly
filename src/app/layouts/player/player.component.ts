import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  ViewChild,
  EventEmitter,
  ElementRef,
  Output,
  OnChanges,
  SimpleChanges, Renderer2, Inject
} from '@angular/core';
import {AlbumInfo, Track} from '../../services/apis/types';
import {PlayerService} from '../../services/business/player.service';
import {animate, style, transition, trigger} from '@angular/animations';
import {DOCUMENT} from '@angular/common';

const PANEL_HEIGHT = 280;

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('menuAni', [
      transition(':enter', [
        style({
          opacity: 0,
          height: 0
        }),
        animate('.3s')
      ]),
      transition(':leave', [
        style({
          overflow: 'hidden'
        }),
        animate('.3s', style({
          opacity: 0,
          height: 0
        }))
      ])
    ])
  ]
})
export class PlayerComponent implements OnInit, OnChanges {

  @Input() trackList: Track[] = [];  // 播放列表
  @Input() currentTrack: Track;  // 当前播放项
  @Input() currentTrackIndex = 0; // 当前播放项下标
  @Input() album: AlbumInfo; // 专辑
  @Input() playing = false; // 播放状态

  @Output() close = new EventEmitter<void>();

  @ViewChild('player') readonly playerRef: ElementRef;
  @ViewChild('audio') readonly audioRef: ElementRef;

  canPlay = false;
  audioEl: HTMLAudioElement;
  showPanel = false;
  isDown = false;
  hostEl: HTMLElement;
  private putAway = false;

  constructor(
    private playerService: PlayerService,
    private rd2: Renderer2,
    @Inject(DOCUMENT) private doc: Document
  ) {
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges) {
    const {playing} = changes;
    if (playing && !playing.firstChange) {
      if (playing.currentValue) {
        this.audioEl.play();
      } else {
        this.audioEl.pause();
      }
    }
  }

  canplay() {
    this.canPlay = true;
    this.play();
  }

  ended() {
    this.playing = false;
    this.next(this.currentTrackIndex + 1);
  }

  error() {
    console.log('audio error');
    this.playerService.setPlaying(false);
  }

  play() {
    if (!this.audioEl) {
      this.audioEl = this.audioRef.nativeElement;
    }
    this.audioEl.play();
    this.playerService.setPlaying(true);
  }

  togglePlay() {
    if (this.currentTrack) {
      if (this.canPlay) {
        const playing = !this.playing;
        this.playerService.setPlaying(playing);
        if (playing) {
          this.audioEl.play();
        } else {
          this.audioEl.pause();
        }
      }
    } else {
      if (this.trackList.length) {
        this.updateIndex(0);
      }
    }
  }

  private updateIndex(index: number, canPlay = false) {
    this.playerService.setCurrentTrackIndex(index);
    this.canPlay = canPlay;
  }

  togglePanel(show: boolean) {
    const {top} = this.playerRef.nativeElement.getBoundingClientRect();
    this.isDown = top < PANEL_HEIGHT - 10;
    this.showPanel = show;
  }

  prev(prevIndex: number) {
    if (this.trackList.length === 1) {
      this.audioEl.currentTime = 0;
      this.audioEl.play();
    } else {
      const newIndex = prevIndex < 0 ? this.trackList.length - 1 : prevIndex;
      this.playerService.setCurrentTrackIndex(newIndex);
    }
  }

  next(nextIndex: number) {
    if (this.trackList.length === 1) {
      this.audioEl.currentTime = 0;
      this.audioEl.play();
    } else {
      const newIndex = nextIndex > this.trackList.length - 1 ? 0 : nextIndex;
      this.playerService.setCurrentTrackIndex(newIndex);
    }
  }

  changePlay(index: number) {
    if (this.currentTrackIndex !== index) {
      this.playerService.setCurrentTrackIndex(index);
    }
  }

  trackByTracks(index: number, item: Track): number {
    return item.trackId;
  }

  delPanel(delIndex: number) {
    let newIndex = this.currentTrackIndex;
    let newTracks = this.trackList.slice();
    let canPlay = true;

    if (this.trackList.length <= 1) {
      newIndex = -1;
      newTracks = [];
    } else {
      if (delIndex < this.currentTrackIndex) {
        newIndex--;
      }
      if (delIndex === this.currentTrackIndex) {
        if (this.playing) {
          if (this.trackList[delIndex + 1]) {
            // 不用处理，后面的会顶上来
          } else {
            newIndex--;
            canPlay = false;
          }
        } else {
          newIndex = -1;
          canPlay = false;
        }
      }
      newTracks.splice(delIndex, 1);
    }
    this.playerService.setTrackList(newTracks);
    this.updateIndex(newIndex, canPlay);
  }

  moveEnd(host: HTMLElement) {
    this.hostEl = host;
    const {top, left, width, height} = host.getBoundingClientRect();
    const maxTop = this.doc.documentElement.clientHeight - height;
    const maxLeft = this.doc.documentElement.clientWidth - width;
    const coveWidth = width - 50;
    console.log(maxLeft);
    console.log(left);
    this.rd2.setStyle(host, 'transition', 'all .2s');
    if (top <= 0) {
      this.rd2.setStyle(host, 'top', 0);
    }
    if (top > maxTop) {
      this.rd2.setStyle(host, 'top', maxTop + 'px');
    }
    if (left > (maxLeft + (width / 2 - 50))) {
      this.rd2.setStyle(host, 'left', maxLeft + coveWidth + 'px');
      this.putAway = true;
    }
  }

  onMouseenter() {
    if (this.putAway) {
      const maxLeft = this.doc.documentElement.clientWidth - this.hostEl.getBoundingClientRect().width;
      this.rd2.setStyle(this.hostEl, 'left', maxLeft + 'px');
      this.putAway = false;
    }
  }
}
