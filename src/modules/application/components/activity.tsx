import CommentIcon from '@/modules/comment/components/comment';

export const ActivityItem = ({ item, noCommentIcon }: { item: any, noCommentIcon?: boolean }) => {
  return (
    <div className="border p-3 rounded-lg">
      <div className="flex justify-between items-center">
        <p className="flex items-center gap-2">
          {item?.type} : <span className="text-primary font-semibold">{item?.name}</span>
          {!noCommentIcon && <CommentIcon refId={item._id} comments={item.comments} />}
        </p>
      </div>
      <p className="leading-loose text-sm mb-2">{item?.description}</p>

      {item?.children && item?.children?.length > 0 && (
        <div>
          {item?.children?.map((child?: any) => <ActivityItem key={child?._id} item={child} />)}
        </div>
      )}
    </div>
  );
};
