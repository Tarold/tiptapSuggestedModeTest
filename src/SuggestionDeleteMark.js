import { Mark, mergeAttributes } from '@tiptap/core';

export const SuggestionDeleteMark = Mark.create({
  name: 'suggestion_delete',

  addAttributes() {
    return {
      suggestionId: {
        default: null,
        parseHTML: (el) => el.getAttribute('data-suggestion-id'),
        renderHTML: (attrs) =>
          attrs.suggestionId
            ? { 'data-suggestion-id': attrs.suggestionId }
            : {},
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
        tag: 'delete',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'delete',
      mergeAttributes(HTMLAttributes, {
        title: 'Suggested deletion',
      }),
      0,
    ];
  },
});
