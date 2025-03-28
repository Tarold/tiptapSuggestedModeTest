import { EditorContent, useEditor, useEditorState } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { watchPreviewContent } from '@tiptap-pro/extension-collaboration-history';
import { SnapshotCompare } from '@tiptap-pro/extension-snapshot-compare';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import { Heading } from './DiffHeading';
import { VersionItem } from './VersionItem';

const getVersionName = (version) => {
  if (version.name) {
    return version.name;
  }

  if (version.version === 0) {
    return 'Initial version';
  }

  return `Version ${version.version}`;
};
const colors = [
  '#FAF594',
  '#958DF1',
  '#F98181',
  '#70CFF8',
  '#FBBC88',
  '#94FADB',
  '#B9F18D',
  '#6EE7B7',
];

/**
 * @type {Map<string, string>}
 */
const colorMapping = new Map();

export const VersioningModal = memo(
  ({ versions, isOpen, onClose, provider, onRevert }) => {
    const [currentVersionId, setCurrentVersionId] = useState(null);
    const [selectedVersion, setSelectedVersion] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const editor = useEditor({
      immediatelyRender: true,
      editable: false,
      content: '',
      extensions: [
        Heading,
        StarterKit.configure({ heading: false }),
        SnapshotCompare.configure({
          provider,
          // Allows you to customize how the diffs are rendered as decorations within the editor
          mapDiffToDecorations(ctx) {
            return ctx.defaultMapDiffToDecorations({
              ...ctx,
              attributes: {
                // Add a custom attribute to the diff spans
                'data-my-custom-attribute': 'true',
              },
            });
          },
        }),
      ],
    });

    const { isDiffing, users } = useEditorState({
      editor,
      selector: (ctx) => {
        /**
         * @type {import('@tiptap-pro/extension-snapshot-compare').SnapshotCompareStorage}
         */
        const userHistory = ctx.editor.storage.snapshotCompare;

        return {
          isDiffing: userHistory.isPreviewing,
          users: userHistory.diffs.reduce(
            (acc, { attribution: { userId } }) =>
              userId ? acc.add(userId) : acc,
            new Set()
          ),
        };
      },
    });

    const reversedVersions = useMemo(
      () => versions.slice().reverse(),
      [versions]
    );

    const handleVersionChange = useCallback(
      (newVersion) => {
        if (editor.can().hideDiff()) {
          editor.chain().hideDiff().run();
          setSelectedVersion(null);
        }
        setCurrentVersionId(newVersion);

        if (newVersion === 0) {
          return;
        }

        editor
          .chain()
          .compareVersions({
            toVersion: newVersion,
            fromVersion: newVersion - 1,
            /**
             * To add additional data to a user, we  can use this function to add context on a user
             * We've seen two approaches for this, a hash of the user's id mapping to a color
             * Or, to store the user's color preference in a separate field. For simplicity of this example, we just assign a random color
             */
            hydrateUserData: ({ userId }) => {
              if (!colorMapping.has(userId)) {
                colorMapping.set(
                  userId,
                  colors[(userId || '').length % colors.length]
                );
              }

              return {
                /**
                 * This will control the color of the changes made by the user
                 * Flexibly allowing you to control the color of the text and background, or even by the type of change
                 */
                color: {
                  // This is the default color for the user
                  color: '#000',
                  backgroundColor: `${colorMapping.get(userId)}B0`,
                  // Specifically color deletions as a lighter color
                  delete: {
                    color: '#777',
                    backgroundColor: `${colorMapping.get(userId)}50`,
                  },
                },
              };
            },
            onCompare: (ctx) => {
              if (ctx.error) {
                console.error(ctx.error);
                setErrorMessage(`An error occurred: ${String(ctx.error)}`);
                return;
              }

              editor.commands.showDiff(ctx.tr);
            },
          })
          .run();
      },
      [provider, editor]
    );

    useEffect(() => {
      if (isOpen && currentVersionId === null && versions.length > 0) {
        const initialVersion = versions.at(-1).version;

        setCurrentVersionId(initialVersion);

        handleVersionChange(initialVersion);
      }

      if (!isOpen) {
        setCurrentVersionId(null);
      }
    }, [currentVersionId, versions, isOpen]);

    useEffect(() => {
      if (isOpen) {
        const unbindContentWatcher = watchPreviewContent(
          provider,
          (content) => {
            if (editor) {
              editor.commands.setContent(content);
            }
          }
        );

        return () => {
          unbindContentWatcher();
        };
      }
    }, [isOpen, provider, editor]);

    const handleClose = useCallback(() => {
      onClose();
      setCurrentVersionId(null);
      editor.commands.clearContent();
    }, [onClose, editor]);

    if (!isOpen) {
      return null;
    }

    return (
      <div className="dialog" data-state="open">
        <div className="dialog-content col-group">
          <div className="main">
            {errorMessage}
            {isDiffing && (
              <div className="diff-users">
                {Array.from(users).map((userId) => (
                  <div key={userId} className="diff-user">
                    <span
                      className="diff-user-color"
                      style={{
                        backgroundColor: `${colorMapping.get(userId)}B0`,
                      }}
                    ></span>
                    {userId}
                  </div>
                ))}
              </div>
            )}
            <EditorContent editor={editor} />
          </div>
          <div className="sidebar">
            <div className="sidebar-options">
              <div className="label-large">
                History ({reversedVersions.length} versions)
              </div>
              <div className="versions-group">
                {reversedVersions.map((v) => (
                  <VersionItem
                    date={v.date}
                    title={getVersionName(v)}
                    onClick={() => handleVersionChange(v.version)}
                    isActive={currentVersionId === v.version}
                    isSelected={selectedVersion === v.version}
                    key={`version_item_${v.version}`}
                  />
                ))}
              </div>
              {editor.can().hideDiff() && (
                <div className="hint">
                  Comparing{' '}
                  {versions.find((v) => v.version === currentVersionId)?.name}{' '}
                  with{' '}
                  {
                    versions.find((v) => v.version === currentVersionId - 1)
                      ?.name
                  }
                </div>
              )}
              <div className="button-group">
                <button
                  type="button"
                  onClick={() => {
                    editor.chain().hideDiff().run();
                    handleClose();
                  }}
                >
                  Close
                </button>

                <button
                  className="primary"
                  type="button"
                  disabled={
                    !versions.length ||
                    currentVersionId === versions.at(-1).version
                  }
                  onClick={() => {
                    // eslint-disable-next-line no-restricted-globals
                    const accepted = confirm(
                      'Are you sure you want to revert to this version? Any changes not versioned will be lost.'
                    );

                    if (!accepted) {
                      return;
                    }
                    onRevert(currentVersionId);
                    handleClose();
                  }}
                >
                  Restore
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
);

VersioningModal.displayName = 'VersioningModal';
