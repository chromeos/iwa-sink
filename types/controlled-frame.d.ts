/**
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

// Based on https://wicg.github.io/controlled-frame/#idl-index

interface HTMLElementTagNameMap {
  controlledframe: HTMLControlledFrameElement;
}

interface ControlledFrameEventMap extends HTMLElementEventMap {
  consolemessage: ConsoleMessageEvent;
  contentload: ContentLoadEvent;
  dialog: DialogEvent;
  loadabort: LoadAbortEvent;
  loadcommit: LoadCommitEvent;
  loadstart: LoadStartEvent;
  loadstop: LoadStopEvent;
  newwindow: NewWindowEvent;
  permissionrequest: PermissionRequestEvent;
  sizechanged: SizeChangedEvent;
  zoomchange: ZoomChangeEvent;
}

interface HTMLControlledFrameElement extends HTMLElement {
  src: string;
  partition: string;
  readonly contentWindow: WindowProxy | null;

  readonly contextMenus: ContextMenus;
  readonly request: WebRequest;

  autosize: boolean;
  minwidth: number;
  maxwidth: number;
  minheight: number;
  maxheight: number;

  // Navigation methods.
  back(): Promise<boolean>;
  canGoBack(): Promise<boolean>;
  forward(): Promise<boolean>;
  canGoForward(): Promise<boolean>;
  go(relativeIndex: number): Promise<boolean>;
  reload(): void;
  stop(): void;

  // Scripting methods.
  addContentScripts(contentScriptList: ContentScriptDetails[]): Promise<void>;
  executeScript(details?: InjectDetails): Promise<any>;
  insertCSS(details?: InjectDetails): Promise<void>;
  removeContentScripts(scriptNameList?: string[]): Promise<void>;

  // Configuration methods.
  clearData(
    options?: ClearDataOptions,
    types?: ClearDataTypeSet
  ): Promise<void>;
  getAudioState(): Promise<boolean>;
  getZoom(): Promise<number>;
  getZoomMode(): Promise<string>;
  isAudioMuted(): Promise<boolean>;
  setAudioMuted(mute: boolean): void;
  setZoom(zoomFactor: number): Promise<void>;
  setZoomMode(zoomMode: ZoomMode): Promise<void>;

  // Capture methods.
  captureVisibleRegion(options?: ImageDetails): Promise<void>;
  print(): void;

  addEventListener<K extends keyof ControlledFrameEventMap>(
    type: K,
    listener: (
      this: HTMLControlledFrameElement,
      ev: ControlledFrameEventMap[K]
    ) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof ControlledFrameEventMap>(
    type: K,
    listener: (
      this: HTMLControlledFrameElement,
      ev: ControlledFrameEventMap[K]
    ) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

declare var HTMLControlledFrameElement: {
  prototype: HTMLControlledFrameElement;
  new (): HTMLControlledFrameElement;
};

type InjectDetails = {
  code?: string;
  file?: string;
};

type InjectionItems = {
  code?: string;
  files?: string[];
};

type RunAt = 'document-start' | 'document-end' | 'document-idle';

type ContentScriptDetails = {
  name: string;
  js?: InjectionItems;
  css?: InjectionItems;
  urlPatterns: (URLPattern | URLPatternInput)[];
  excludeURLPatterns?: (URLPattern | URLPatternInput)[];
  allFrames?: boolean;
  matchAboutBlank?: boolean;
  runAt?: RunAt;
};

type ClearDataOptions = {
  since?: number;
};

type ClearDataTypeSet = {
  cache?: boolean;
  cookies?: boolean;
  fileSystems?: boolean;
  indexedDB?: boolean;
  localStorage?: boolean;
  persistentCookies?: boolean;
  sessionCookies?: boolean;
};

type ZoomMode = 'per-origin' | 'per-view' | 'disabled';

type ImageDetails = {
  format?: string;
  quality?: string;
};

interface ConsoleMessageEvent extends Event {
  readonly level: number;
  readonly message: string;
}

type DialogType = 'alert' | 'confirm' | 'prompt';

interface DialogController {
  okay(response?: string): void;
  cancel(): void;
}

interface DialogEvent extends Event {
  readonly messageType: DialogType;
  readonly messageText: string;
  readonly dialog: DialogController;
}

type WindowOpenDisposition =
  | 'ignore'
  | 'save_to_disk'
  | 'current_tab'
  | 'new_background_tab'
  | 'new_foreground_tab'
  | 'new_window'
  | 'new_popup';

interface NewWindowController {
  attach(newControlledFrame: HTMLControlledFrameElement): void;
  discard(): void;
}

interface NewWindowEvent extends Event {
  readonly window: NewWindowController;
  readonly targetUrl: string;
  readonly name: string;
  readonly windowOpenDisposition: WindowOpenDisposition;
  readonly partition: string;
  readonly initialHeight: number;
  readonly initialWidth: number;
}

type PermissionType =
  | 'media'
  | 'geolocation'
  | 'pointerLock'
  | 'download'
  | 'filesystem'
  | 'fullscreen'
  | 'hid';

interface PermissionRequestController {
  allow(): void;
  cancel(): void;

  readonly url: string;
  readonly origin?: string;
  readonly requestMethod?: string;
  readonly lastUnlockedBySelf?: boolean;
  readonly userGesture?: boolean;
}

interface PermissionRequestEvent extends Event {
  readonly permission: PermissionType;
  readonly request: PermissionRequestController;
}

interface SizeChangedEvent extends Event {
  readonly oldWidth: number;
  readonly oldHeight: number;
  readonly newWidth: number;
  readonly newHeight: number;
}

interface ZoomChangeEvent extends Event {
  readonly oldZoomFactor: number;
  readonly newZoomFactor: number;
}

interface ContentLoadEvent extends Event {}

interface LoadAbortEvent extends Event {
  readonly url: string;
  readonly isTopLevel: boolean;
  readonly code: number;
  readonly reason: string;
}

interface LoadCommitEvent extends Event {
  readonly url: string;
  readonly isTopLevel: boolean;
}

interface LoadStartEvent extends Event {
  readonly url: string;
  readonly isTopLevel: boolean;
}

interface LoadStopEvent extends Event {}

interface LoadRedirectEvent extends Event {
  readonly oldUrl: string;
  readonly newUrl: string;
  readonly isTopLevel: boolean;
}

type ResourceType =
  | 'main-frame'
  | 'sub-frame'
  | 'stylesheet'
  | 'script'
  | 'image'
  | 'font'
  | 'object'
  | 'xmlhttprequest'
  | 'ping'
  | 'csp-report'
  | 'media'
  | 'websocket'
  | 'other';

type RequestedHeaders = 'none' | 'cors' | 'all';

type WebRequestInterceptorOptions = {
  urlPatterns: (URLPattern | URLPatternInput)[];
  resourceTypes?: ResourceType[];
  blocking?: boolean;
  includeRequestBody?: boolean;
  includeHeaders?: RequestedHeaders;
};

interface WebRequest {
  createWebRequestInterceptor(
    options: WebRequestInterceptorOptions
  ): WebRequestInterceptor;
}

interface WebRequestInterceptorEventMap {
  authrequired: WebRequestAuthRequiredEvent;
  beforeredirect: WebRequestBeforeRedirectEvent;
  beforerequest: WebRequestBeforeRequestEvent;
  beforesendheaders: WebRequestBeforeSendHeadersEvent;
  completed: WebRequestCompletedEvent;
  erroroccurred: WebRequestErrorOccurredEvent;
  headersreceived: WebRequestHeadersReceivedEvent;
  sendheaders: WebRequestSendHeadersEvent;
  responsestarted: WebRequestResponseStartedEvent;
}

interface WebRequestInterceptor extends EventTarget {
  addEventListener<K extends keyof WebRequestInterceptorEventMap>(
    type: K,
    listener: (
      this: WebRequestInterceptor,
      ev: WebRequestInterceptorEventMap[K]
    ) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof WebRequestInterceptorEventMap>(
    type: K,
    listener: (
      this: WebRequestInterceptor,
      ev: WebRequestInterceptorEventMap[K]
    ) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

type DocumentLifecycle = 'prerender' | 'active' | 'cached' | 'pending-deletion';

type FrameType = 'outermost-frame' | 'fenced-frame' | 'sub-frame';

type WebRequestUploadData = {
  readonly bytes?: ArrayBuffer;
  readonly file?: string;
};

type WebRequestResponse = {
  readonly statusCode: number;
  readonly statusLine: string;
  readonly fromCache: boolean;
  readonly headers?: Headers;
  readonly ip?: string;
  readonly redirectURL?: string;
  readonly auth?: {
    readonly challenger: {
      readonly host: string;
      readonly port: number;
    };
    readonly isProxy: boolean;
    readonly scheme: string;
    readonly realm?: string;
  };
};

interface WebRequestEvent extends Event {
  readonly request: {
    readonly method: string;
    readonly id: string;
    readonly type: ResourceType;
    readonly url: string;
    readonly initiator?: string;
    readonly headers?: Headers;
    readonly body?: {
      readonly error?: string;
      readonly formData: any;
      readonly raw?: readonly WebRequestUploadData[];
    };
  };
  readonly frameId: number;
  readonly frameType?: FrameType;
  readonly documentId?: string;
  readonly documentLifecycle?: DocumentLifecycle;
  readonly parentDocumentId?: string;
  readonly parentFrameId?: number;
}

type WebRequestAuthCredentials = {
  username: string;
  password: string;
};

type WebRequestAuthOptions = {
  signal: AbortSignal;
};

interface WebRequestAuthRequiredEvent extends WebRequestEvent {
  readonly response: WebRequestResponse;
  setCredentials(
    credentials: Promise<WebRequestAuthCredentials>,
    options?: WebRequestAuthOptions
  ): void;
}

interface WebRequestBeforeRedirectEvent extends WebRequestEvent {
  readonly response: WebRequestResponse;
}

interface WebRequestBeforeRequestEvent extends WebRequestEvent {
  redirect(redirectURL: string): void;
}

interface WebRequestBeforeSendHeadersEvent extends WebRequestEvent {
  setRequestHeader(requestHeaders: Headers | HeadersInit): void;
}

interface WebRequestCompletedEvent extends WebRequestEvent {
  readonly response: WebRequestResponse;
}

interface WebRequestErrorOccurredEvent extends WebRequestEvent {
  readonly error: string;
}

interface WebRequestHeadersReceivedEvent extends WebRequestEvent {
  readonly response: WebRequestResponse;
  redirect(redirectURL: string): void;
  setResponseHeaders(responseHeaders: Headers | HeadersInit): void;
}

interface WebRequestResponseStartedEvent extends WebRequestEvent {
  readonly response: WebRequestResponse;
}

interface WebRequestSendHeadersEvent extends WebRequestEvent {}

type ContextMenusContextType =
  | 'all'
  | 'page'
  | 'frame'
  | 'selection'
  | 'link'
  | 'editable'
  | 'image'
  | 'video'
  | 'audio';

type ContextMenusItemType = 'normal' | 'checkbox' | 'radio' | 'separator';

type ContextMenusProperties = {
  checked?: boolean;
  contexts?: ContextMenusContextType[];
  documentURLPatterns?: (URLPattern | URLPatternInput)[];
  enabled?: boolean;
  parentId?: string;
  targetURLPatterns?: (URLPattern | URLPatternInput)[];
  title?: string;
  type?: ContextMenusItemType;
};

type ContextMenusCreateProperties = ContextMenusProperties & {
  id: string;
};

interface ContextMenusEventMap {
  click: ContextMenusClickEvent;
  show: Event;
}

interface ContextMenus extends EventTarget {
  create(properties: ContextMenusCreateProperties): Promise<void>;
  remove(id: string): Promise<void>;
  removeAll(): Promise<void>;
  update(id: string, properties?: ContextMenusProperties): Promise<void>;

  addEventListener<K extends keyof ContextMenusEventMap>(
    type: K,
    listener: (this: ContextMenus, ev: ContextMenusEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions
  ): void;
  removeEventListener<K extends keyof ContextMenusEventMap>(
    type: K,
    listener: (this: ContextMenus, ev: ContextMenusEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions
  ): void;
}

interface ContextMenusClickEvent extends Event {
  readonly menuItem: {
    readonly id: string;
    readonly parentMenuId?: string;
    readonly checked?: boolean;
    readonly wasChecked?: boolean;
  };
  readonly frameId: number;
  readonly frameURL: string;
  readonly pageURL: string;
  readonly editable: boolean;
  readonly linkURL?: string;
  readonly mediaType?: string;
  readonly selectionText?: string;
  readonly srcURL?: string;
}
