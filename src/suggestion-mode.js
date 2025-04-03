import { Extension } from '@tiptap/core';
import {
  suggestionModePlugin,
  suggestionPluginKey,
  toggleSuggestionMode,
  setSuggestionMode,
} from 'prosemirror-suggestion-mode';

export const SuggestionModeExtension = Extension.create({
  name: 'suggestionMode',

  addOptions() {
    return {
      suggestionUsername: 'User',
    };
  },

  addProseMirrorPlugins() {
    return [
      suggestionModePlugin({
        username: this.options.suggestionUsername,
        inSuggestionMode: true,
      }),
    ];
  },

  addStorage() {
    return {
      toggleSuggestionMode,
      setSuggestionMode,
      getSuggestionMode: (state) => {
        return suggestionPluginKey.getState(state)?.inSuggestionMode ?? false;
      },
    };
  },
});
