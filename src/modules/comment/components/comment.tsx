import { ApModal, ApTextInput, IModal } from '@/components';
import { SetStateAction, useEffect, useRef, useState } from 'react';
import { BsFillSendFill } from 'react-icons/bs';
import { FaRegCommentAlt } from 'react-icons/fa';
import { useCommentState } from '../context';
import { IComment } from '../model';

interface CommentIconProps {
  refId: string;
  propName?: string;
  comments: IComment[];
}

const CommentIcon: React.FC<CommentIconProps> = ({ refId, propName, comments }) => {
  const {
    loading,
    saveComment,
    removeComment
  } = useCommentState();

  const [commentList, setCommentList] = useState<IComment[]>(comments || []);

  const [modal, setModal] = useState<IModal<'comment'>>({
    show: false,
    type: 'comment',
    data: null
  });
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    processComment(comments);
  }, [comments]);

  const processComment = (cmmnts: IComment[]) => {
    const commentList = cmmnts?.filter(
      (comment) => comment.refId === refId && (comment.propName || "") === (propName || "")
    )?.filter((comment) => !comment.parentId) || [];
    setCommentList(commentList);
  }

  const handleOpenModal = async () => {
    setModal({ show: true, type: 'comment', data: null });
  };

  const handleSendComment = async () => {
    if (!inputValue.trim()) return;

    try {
      await saveComment({ refId, propName, comment: inputValue.trim() })
        .then((res: any) => {
          processComment([res, ...commentList]);
        });
      setInputValue('');
    } catch (error) {
      console.error('Failed to save comment:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendComment();
    }
  };

  const handleDelete = async (commentId: string) => {
    if (window.confirm('Are you sure you want to delete this comment?')) {
      try {
        await removeComment(commentId);
      } catch (error) {
        console.error('Failed to delete comment:', error);
      }
    }
  };

  const handleChange = (e: string) => {
    setInputValue(e);
  };

  return (
    <>
      <div
        className="relative inline-flex ml-1 items-center cursor-pointer hover:opacity-80 transition-opacity"
        role="button"
        onClick={handleOpenModal}
        aria-label={`${commentList?.length} comments. Click to view.`}
      >
        <FaRegCommentAlt className="text-gray-700 text-lg" />
        {commentList?.length > 0 && (
          <span className="absolute -top-2 -right-2 flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-xs font-medium rounded-full bg-blue-500 text-white">
            {commentList?.length > 99 ? '99+' : commentList?.length}
          </span>
        )}
      </div>

      <ApModal show={modal?.show} onDimiss={() => setModal({ show: false })} width="50%">
        <div className="flex flex-col max-h-[80vh">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-medium">Comments</h3>
            <p className="text-sm text-muted-foreground">
              {commentList?.length} {commentList?.length === 1 ? 'comment' : 'comments'}
            </p>
          </div>

          <div className="flex-1 max-h-[60vh] overflow-scroll py-4 space-y-4">
            {loading ? (
              <div className="text-center py-8 text-gray-500">Loading comments...</div>
            ) : commentList?.length > 0 ? (
              commentList?.map((comment) => (
                <div key={comment._id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex justify-between">
                    <div className="text-sm font-medium text-gray-700">
                      {comment?.user?.firstName || 'Anonymous'}
                    </div>
                    <button
                      className="text-xs text-red-600 hover:text-red-800"
                      onClick={() => handleDelete(comment._id)}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="mt-1 text-gray-800">{comment.comment}</div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">No comments yet.</div>
            )}
          </div>

          <div className=" pt-4 border-t border-gray-200 w-full">
            <div className="flex items-center gap-2">
              <div className='flex-1'>
                <ApTextInput
                  ref={inputRef}
                  ignoreFormik
                  name="comment"
                  type="text"
                  value={inputValue}
                  onChange={handleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a comment..."
                  inputClassName="w-full"
                />
              </div>


              <button
                onClick={handleSendComment}
                className="p-3 rounded-xs bg-blue-500 text-white hover:bg-blue-600 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
                disabled={!inputValue.trim()}
                aria-label="Send comment"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </ApModal>
    </>
  );
};

export default CommentIcon;
