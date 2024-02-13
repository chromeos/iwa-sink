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

/* Scripting Methods
 * https://wicg.github.io/controlled-frame/#api-scripting
 */

type InjectDetails =
  | {
      code: string;
    }
  | {
      file: string;
    };

interface InjectionItems {
  code?: string;
  files?: string[];
}

declare enum RunAt {
  'document_start',
  'document_end',
  'document_idle',
}

interface ContentScriptDetails {
  all_frames?: boolean;
  css?: InjectionItems;
  exclude_globs?: string[];
  exclude_matches?: string[];
  include_globs?: string[];
  js?: InjectionItems;
  match_about_blank?: boolean;
  matches: string[];
  name: string;
  run_at?: RunAt;
}

/* Controlled Frame API
 * https://wicg.github.io/controlled-frame/#controlled-frame-api
 */
declare enum ContextType {
  'all',
  'page',
  'frame',
  'selection',
  'link',
  'editable',
  'image',
  'video',
  'audio',
}

declare enum ItemType {
  'normal',
  'checkbox',
  'radio',
  'separator',
}

interface OnClickData {
  checked?: boolean;
  editable: boolean;
  frameId?: number;
  frameUrl?: string;
  linkUrl?: string;
  mediaType?: string;
  menuItemId: number | string;
  pageUrl?: string;
  parentMenuItemId?: number | string;
  selectionText?: string;
  srcUrl?: string;
  wasChecked?: boolean;
}

type ContextMenusEventListener = (data: OnClickData) => void;

interface ContextMenusProperties {
  checked?: boolean;
  context?: ContextType[];
  documentUrlPatterns?: string;
  enabled?: boolean;
  parentId?: string;
  targetUrlPatterns?: string;
  title?: string;
  type?: ItemType;
  onclick?: ContextMenusEventListener;
}

interface ContextMenusCreateProperties extends ContextMenusProperties {
  id?: string;
}

type ContextMenusCallback = () => void;

interface ContextMenus {
  create(
    properties: ContextMenusCreateProperties,
    callback: ContextMenusCallback,
  ): string | number;
  remove(menuItemId: string | number, callback?: ContextMenusCallback): void;
  removeAll(callback?: ContextMenusCallback): void;
  update(
    id: string | number,
    properties: ContextMenusProperties,
    callback?: ContextMenusCallback,
  ): void;
}

interface ClearDataOptions {
  since?: number;
}

interface ClearDAtaTypeSet {
  appcache?: boolean;
  cache?: boolean;
  cookies?: boolean;
  fileSystems?: boolean;
  indexedDB?: boolean;
  localStorage?: boolean;
  persistentCookies?: boolean;
  sessionCookies?: boolean;
  webSQL?: boolean;
}

/* https://wicg.github.io/controlled-frame/#html-element */
interface ControlledFrame extends HTMLElement {
  src: string;
  name: string;
  allowfullscreen: boolean;
  allowscaling: boolean;
  allowtransparency: boolean;
  autosize: boolean;
  maxheight: string;
  maxwidth: string;
  minheight: string;
  minwidth: string;
  partition: string;

  readonly contentWindow: WindowProxy;
  readonly contextMenus: ContextMenus;

  // Navigation methods
  back(): Promise<void>;
  canGoBack(): boolean;
  canGoForward(): boolean;
  forward(): Promise<void>;
  go(relativeIndex?: number): Promise<void>;
  reload(): void;
  stop(): void;

  // Scripting Methods
  addContentScripts(contentScriptList: ContentScriptDetails[]): Promise<void>;
  executeScript(details?: InjectDetails | {}): Promise<any>;
  insertCSS(details?: InjectDetails): Promise<void>;
  removeContentScripts(scriptNameList: string[]): Promise<void>;

  // Configuration methods
  clearData(options: ClearDataOptions = {}): Promise<void>;
  getAudioState(): Promise<boolean>;
  getZoom(): Promise<number>;
  isAudioMuted(): Promise;
  setAudioMuted(mute: boolean): void;
  setZoom(zoomFactor: number): Promise<void>;

  // Capture methods
  captureVisibleRegion(): void;
  print(): void;
}
