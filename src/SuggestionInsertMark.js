import { Mark, mergeAttributes } from '@tiptap/core';

export const SuggestionInsertMark = Mark.create({
  name: 'suggestion_insert',

  addAttributes() {
    return {
      suggestionId: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-suggestion-id'),
        renderHTML: (attributes) => {
          if (!attributes.suggestionId) return {};
          return {
            'data-suggestion-id': attributes.suggestionId,
          };
        },
      },
      username: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-username'),
        renderHTML: (attrs) =>
          attrs.username ? { 'data-username': attrs.username } : {},
      },
      createdAt: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-created-at'),
        renderHTML: (attrs) =>
          attrs.createdAt ? { 'data-created-at': attrs.createdAt } : {},
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'insert',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'insert',
      mergeAttributes(HTMLAttributes, {
        title: 'Suggested change',
      }),
      0,
    ];
  },
});
