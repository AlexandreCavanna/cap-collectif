// @flow
import { compose } from 'redux';

declare interface Window extends EventTarget, IDBEnvironment, HTMLElement {
  +caches: CacheStorage;
  +clientInformation: Navigator;
  +closed: boolean;
  defaultStatus: string;
  +devicePixelRatio: number;
  +document: {
    ...Document,
    +fonts: any,
    createElement(tag: string): any,
  };
  +doNotTrack: string;
  +frameElement: Element;
  +frames: Window;
  +history: History;
  +innerHeight: number;
  +innerWidth: number;
  +isSecureContext: boolean;
  +length: number;
  +location: Location;
  name: string;
  +navigator: Navigator;
  offscreenBuffering: string | boolean;
  onabort: (ev: UIEvent) => any;
  onafterprint: (ev: Event) => any;
  onbeforeprint: (ev: Event) => any;
  onbeforeunload: (ev: Event) => any;
  onblur: (ev: FocusEvent) => any;
  oncanplay: (ev: Event) => any;
  oncanplaythrough: (ev: Event) => any;
  onchange: (ev: Event) => any;
  onclick: (ev: MouseEvent) => any;
  oncompassneedscalibration: (ev: Event) => any;
  oncontextmenu: (ev: Event) => any;
  ondblclick: (ev: MouseEvent) => any;
  ondevicelight: (ev: Event) => any;
  ondevicemotion: (ev: Event) => any;
  ondeviceorientation: (ev: Event) => any;
  ondrag: (ev: DragEvent) => any;
  ondragend: (ev: DragEvent) => any;
  ondragenter: (ev: DragEvent) => any;
  ondragleave: (ev: DragEvent) => any;
  ondragover: (ev: DragEvent) => any;
  ondragstart: (ev: DragEvent) => any;
  ondrop: (ev: DragEvent) => any;
  ondurationchange: (ev: Event) => any;
  onemptied: (ev: Event) => any;
  onended: (ev: Event) => any;
  onerror: (ev: Event) => any;
  onfocus: (ev: FocusEvent) => any;
  onhashchange: (ev: Event) => any;
  oninput: (ev: Event) => any;
  oninvalid: (ev: Event) => any;
  onkeydown: (ev: KeyboardEvent) => any;
  onkeypress: (ev: KeyboardEvent) => any;
  onkeyup: (ev: KeyboardEvent) => any;
  onload: (ev: Event) => any;
  onloadeddata: (ev: Event) => any;
  onloadedmetadata: (ev: Event) => any;
  onloadstart: (ev: Event) => any;
  onmessage: (ev: MessageEvent) => any;
  onmousedown: (ev: MouseEvent) => any;
  onmouseenter: (ev: MouseEvent) => any;
  onmouseleave: (ev: MouseEvent) => any;
  onmousemove: (ev: MouseEvent) => any;
  onmouseout: (ev: MouseEvent) => any;
  onmouseover: (ev: MouseEvent) => any;
  onmouseup: (ev: MouseEvent) => any;
  onmousewheel: (ev: WheelEvent) => any;
  onoffline: (ev: Event) => any;
  ononline: (ev: Event) => any;
  onorientationchange: (ev: Event) => any;
  onpagehide: (ev: Event) => any;
  onpageshow: (ev: Event) => any;
  onpause: (ev: Event) => any;
  onplay: (ev: Event) => any;
  onplaying: (ev: Event) => any;
  onpopstate: (ev: Event) => any;
  onprogress: (ev: ProgressEvent) => any;
  onratechange: (ev: Event) => any;
  onreadystatechange: (ev: ProgressEvent) => any;
  onreset: (ev: Event) => any;
  onresize: (ev: UIEvent) => any;
  onscroll: (ev: UIEvent) => any;
  onseeked: (ev: Event) => any;
  onseeking: (ev: Event) => any;
  onselect: (ev: UIEvent) => any;
  onstalled: (ev: Event) => any;
  onstorage: (ev: Event) => any;
  onsubmit: (ev: Event) => any;
  onsuspend: (ev: Event) => any;
  ontimeupdate: (ev: Event) => any;
  ontouchcancel: (ev: TouchEvent) => any;
  ontouchend: (ev: TouchEvent) => any;
  ontouchmove: (ev: TouchEvent) => any;
  ontouchstart: (ev: TouchEvent) => any;
  onunload: (ev: Event) => any;
  onvolumechange: (ev: Event) => any;
  onwaiting: (ev: Event) => any;
  opener: any;
  orientation: string | number;
  +outerHeight: number;
  +outerWidth: number;
  +pageXOffset: number;
  +pageYOffset: number;
  +parent: Window;
  +performance: Performance;
  +screen: Screen;
  +screenLeft: number;
  +screenTop: number;
  +screenX: number;
  +screenY: number;
  +scrollX: number;
  +scrollY: number;
  +self: Window;
  status: string;
  +top: Window;
  +window: Window;

  Blob: typeof Blob;
  HTMLImageElement: typeof HTMLImageElement;
  HTMLElement: typeof HTMLElement;
  HTMLVideoElement: typeof HTMLVideoElement;
  HTMLCanvasElement: typeof HTMLCanvasElement;
  Image: typeof Image;
  ImageData: typeof ImageData;
  URL: typeof URL;
  URLSearchParams: typeof URLSearchParams;
  WebGLFramebuffer: typeof WebGLFramebuffer;
  webkitURL: typeof URL;
  WheelEvent: typeof WheelEvent;
  Worker: typeof Worker;
  XMLHttpRequest: typeof XMLHttpRequest;
  intl_messages: Array<String>;
  locale: string;
  timeZone: string;
  grecaptcha?: {
    reset(): void,
  };
  __SERVER__: boolean;
  FileReader: any;
  google: Object;

  alert(message?: any): void;
  blur(): void;
  captureEvents(): void;
  close(): void;
  confirm(message1?: string, message2?: string): boolean;
  focus(): void;
  getComputedStyle(elt: Element, pseudoElt?: string): CSSStyleDeclaration;
  getMatchedCSSRules(elt: Element, pseudoElt?: string): CSSRuleList;
  getSelection(): Selection;
  moveBy(x?: number, y?: number): void;
  moveTo(x?: number, y?: number): void;
  msWriteProfilerMark(profilerMarkName: string): void;
  open(url?: string, target?: string, features?: string, replace?: boolean): Window;
  postMessage(message: any, targetOrigin: string, transfer?: any[]): void;
  print(): void;
  prompt(message?: string, _default?: string): string | null;
  releaseEvents(): void;
  resizeBy(x?: number, y?: number): void;
  resizeTo(x?: number, y?: number): void;
  scroll(x?: number, y?: number): void;
  scrollBy(x?: number, y?: number): void;
  scrollTo(x?: number | { top?: number, left?: number, behavior?: string }, y?: number): void;
  stop(): void;

  clearInterval(intervalId?: number): void;
  clearTimeout(timeoutId?: number): void;
  setTimeout(callback: () => void, ms?: number): number;
  setInterval(callback: () => void, ms?: number): number;

  requestAnimationFrame(callback: (timestamp: number) => void): number;
  cancelAnimationFrame(handle: number): void;
  msRequestAnimationFrame(callback: (timestamp: number) => void): number;
  msCancelAnimationFrame(handle: number): void;
  webkitRequestAnimationFrame(callback: (timestamp: number) => void): number;
  webkitCancelAnimationFrame(handle: number): void;
  devToolsExtension(): any;
  FormData(): void;
  getComputedStyle(a: any, b: any): { getPropertyValue(style: string): void };
  matchMedia(media: string): { matches: boolean };
  removeEventListener(
    type: SyntheticEvent,
    listener: EventListener,
    optionsOrUseCapture?: EventListenerOptionsOrUseCapture,
  ): void;
  addEventListener(
    type: SyntheticEvent,
    listener: EventListener,
    optionsOrUseCapture?: EventListenerOptionsOrUseCapture,
  ): void;

  FontFace: any;
  _capco_executeAnalyticScript(): void;
  _capco_ga_cookie_value(key: string): any;
  _capco_executeAdsScript(): void;
  devtoolsFormatters: any;
  _global: any;
  __RELAY_DEVTOOLS_HOOK__: any;
  __REDUX_DEVTOOLS_EXTENSION__: any;
  __REDUX_DEVTOOLS_EXTENSION_COMPOSE__: typeof compose;
  sentryDsn?: ?string;
  btoa(decoded: string): string;
  atob(encoded: string): string;
  eval(x: string): any;
  DOMParser(): any;

  // analytics
  gtag(
    command: 'config' | 'event' | 'get' | 'set' | 'consent',
    parameters: string | Object,
    parameters?: string | Object,
  ): void;
  __capco_gtagId?: ?string;
  _capco_featureFlags?: Array<{
    type: string,
    enabled: boolean,
  }>;

  // We inject mapbox tokens in `window.js.twig`
  MAPBOX_PUBLIC_TOKEN: string;
  MAPBOX_INITIAL_PUBLIC_TOKEN: string;
  MAPBOX_PUBLIC_STYLE_OWNER: string;
  MAPBOX_PUBLIC_STYLE_ID: string;
  TURNSTILE_PUBLIC_KEY: string;

  // hack to avoid error flow because of react-beautiful-dnd
  Element: any;

  // Beacon helpscout
  Beacon(action: string, params: any): any;
}

declare class Touch {
  clientX: number;
  clientY: number;
  identifier: number;
  pageX: number;
  pageY: number;
  screenX: number;
  screenY: number;
  target: EventTarget;
}

declare var window: Window;
