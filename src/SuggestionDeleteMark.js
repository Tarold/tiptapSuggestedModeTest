import { Mark, mergeAttributes } from '@tiptap/core';

export const SuggestionDeleteMark = Mark.create({
  name: 'suggestion_delete',

  addAttributes() {
    return {
      dataSuggestionDelete: {
        default: null,
        parseHTML: (element) => element.getAttribute('data-suggestion-delete'),
        renderHTML: (attributes) =>
          attributes?.dataSuggestionDelete
            ? {
                'data-suggestion-delete': attributes.dataSuggestionDelete,
              }
            : {},
      },
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
        tag: 'span[data-suggestion-delete]',
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(HTMLAttributes, {
        'data-suggestion-delete': 'true',
        title: 'Suggested deletion',
      }),
      0,
    ];
  },
});
