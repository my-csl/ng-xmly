import {Injectable} from '@angular/core';
import {AlbumInfo, Track} from '../apis/types';
import {BehaviorSubject, Observable} from 'rxjs';
import {AlbumService} from '../apis/album.service';
import {MessageService} from '../../shard/components/message/message.service';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  private trackList: Track[] = [];
  private currentTrackIndex: number = 0;
  private playing: boolean = false;

  private trackList$ = new BehaviorSubject<Track[]>([]);
  private currentTrackIndex$ = new BehaviorSubject<number>(0);
  private currentTrack$ = new BehaviorSubject<Track | null>(null);
  private album$ = new BehaviorSubject<AlbumInfo | null>(null);
  private playing$ = new BehaviorSubject<boolean>(false);

  constructor(
    private albumService: AlbumService,
    private messageService: MessageService
  ) {
  }

  setTrackList(tracks: Track[]) {
    this.trackList = tracks.slice();
    this.trackList$.next(tracks);
  }

  getTrackList(): Observable<Track[]> {
    return this.trackList$.asObservable();
  }

  setCurrentTrackIndex(index: number) {
    this.currentTrackIndex = index;
    this.currentTrackIndex$.next(index);
    this.setCurrentTrack(this.trackList[index]);
  }

  getCurrentTrackIndex(): Observable<number> {
    return this.currentTrackIndex$.asObservable();
  }

  setCurrentTrack(track: Track) {
    if (track) {
      const target = this.trackList.find(item => item.trackId === track.trackId);
      if (target) {
        if (track.src) {
          this.currentTrack$.next(track);
        } else {
          this.getAudio(track);
        }
      } else {
        this.getAudio(track);
      }
    } else {
      this.currentTrack$.next(null);
    }
  }

  getCurrentTrack(): Observable<Track | null> {
    return this.currentTrack$.asObservable();
  }

  setAlbum(album: AlbumInfo) {
    this.album$.next(album);
  }

  getAlbum(): Observable<AlbumInfo | null> {
    return this.album$.asObservable();
  }

  setPlaying(play: boolean) {
    this.playing = play;
    this.playing$.next(play);
  }

  getPlaying(): Observable<boolean> {
    return this.playing$.asObservable();
  }

  private getAudio(track: Track) {
    this.albumService.trackAudio(track.trackId).subscribe(audio => {
      if (!audio.src && audio.isPaid) {
        this.messageService.warning('请先购买专辑');
      } else {
        track.src = audio.src;
        track.isPaid = audio.isPaid;
        this.currentTrack$.next(track);
      }
    });
  }

  clear() {
    this.setTrackList([]);
    this.setAlbum(null!);
    this.setCurrentTrack(null!);
    this.setPlaying(false);
    this.setCurrentTrackIndex(0);
  }

  playTrack(track: Track) {
    const targetIndex = this.trackList.findIndex(item => item.trackId === track.trackId);
    if (targetIndex > -1) {
      if (targetIndex === this.currentTrackIndex) {
        this.setPlaying(true);
      } else {
        this.setCurrentTrack(track);
      }
    } else {
      this.setTrackList(this.trackList.concat(track));
      this.setCurrentTrackIndex(this.trackList.length - 1);
    }
  }

  addTracks(trackSelected: Track[]) {
    if (!this.trackList.length) {
      // trackSelected会在页面上取消选中的同时会把这里的引用清空，所以需要浅复制一份
      this.setTrackList(trackSelected.slice());
    } else {
      const newTracks = this.trackList.slice();
      let needUpdateTrack = false;
      trackSelected.forEach(track => {
        const target = this.trackList.find(item => item.trackId === track.trackId);
        if (!target) {
          newTracks.push(track);
          needUpdateTrack = true;
        }
      });
      if (needUpdateTrack) {
        this.setTrackList(newTracks);
      }
    }
    this.setCurrentTrackIndex(-1);
  }

  playTracks(trackSelected: Track[], index = 0) {
    this.addTracks(trackSelected);
    const targetIndex = this.trackList.findIndex(item => item.trackId === trackSelected[index].trackId);
    this.setCurrentTrackIndex(targetIndex);
  }
}
