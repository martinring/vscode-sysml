/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as path from 'path';

import { workspace, window, languages, Disposable, ExtensionContext, EnterAction, OnTypeFormattingEditProvider, TextDocument, Position,FormattingOptions, CancellationToken, IndentAction } from 'vscode';
import { LanguageClient, LanguageClientOptions, SettingMonitor, ServerOptions, TransportKind, Executable } from 'vscode-languageclient';

export function activate(context: ExtensionContext) {
	languages.setLanguageConfiguration("sysml", {
		wordPattern: /(-?\d.\d\w)|([^`~!\@@#\%\^\&*()-\=+[{]}\|\;\:\'\"\,.\<>\/\?\s]+)/g,
		onEnterRules: [
			{
				beforeText:  /^\s*(block|state\s*machine|(initial\s*)?state)(?:\\s+([\\p{L}$_][\\p{L}$_0-9]*))?\s*(--.*)?/,
				afterText: /\s*(--.*)?$/,
				action: {
					indentAction: IndentAction.Indent
				}
			},
			{
				beforeText:  /^\s*(references|constraints|operations|values|ports|owned\s+behaviors|attributes|properties)\s*(--.*)?/,
				afterText: /\s*(--.*)?$/,
				action: {
					indentAction: IndentAction.Indent
				}
			}
		]
	})
}
