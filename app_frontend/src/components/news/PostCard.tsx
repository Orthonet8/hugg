import { motion } from "framer-motion";
import { Bookmark, Heart } from "lucide-react";
import { useMemo, useState } from "react";
import { Badge } from "../common/Badge";
import { Card } from "../common/Card";
import { ImageCarousel } from "./ImageCarousel";
import type { Post } from "../../types";
import { departmentStyles } from "../../utils/theme";

interface PostCardProps {
  post: Post;
  liked: boolean;
  saved: boolean;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
}

const MAX_LENGTH = 170;

export const PostCard = ({
  post,
  liked,
  saved,
  onLike,
  onSave,
}: PostCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const displayText = useMemo(() => {
    if (expanded || post.content.length <= MAX_LENGTH) {
      return post.content;
    }

    return `${post.content.slice(0, MAX_LENGTH)}...`;
  }, [expanded, post.content]);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="app-heading text-lg font-bold text-[color:var(--text-primary)]">
              {post.title}
            </h2>
            <p className="mt-1 text-xs text-[color:var(--text-muted)]">
              {post.author} •{" "}
              {new Date(post.publishedAt).toLocaleDateString("am-ET")}
            </p>
          </div>
          <Badge className={departmentStyles[post.department].badge}>
            {post.department}
          </Badge>
        </div>

        <ImageCarousel imageUrls={post.imageUrls} title={post.title} />

        <div className="space-y-2">
          <p className="text-sm leading-6 text-[color:var(--text-secondary)]">
            {displayText}
          </p>
          {post.content.length > MAX_LENGTH ? (
            <button
              type="button"
              onClick={() => setExpanded((previous) => !previous)}
              className="text-sm font-semibold text-[color:var(--primary)] underline decoration-[color:var(--accent)] decoration-2 underline-offset-4"
            >
              {expanded ? "አሳንስ" : "ተጨማሪ አንብብ"}
            </button>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onLike(post.id)}
            className={`inline-flex h-10 items-center gap-1 rounded-xl border px-3 text-sm font-semibold transition ${
              liked
                ? "border-[color:var(--dept-edu-dot)] bg-[color:var(--dept-edu-bg)] text-[color:var(--dept-edu-text)]"
                : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] hover:bg-[color:var(--soft-hover)]"
            }`}
          >
            <Heart size={16} fill={liked ? "currentColor" : "none"} />
            ወድድ
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => onSave(post.id)}
            className={`inline-flex h-10 items-center gap-1 rounded-xl border px-3 text-sm font-semibold transition ${
              saved
                ? "border-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_25%,transparent)] text-[color:var(--on-accent)]"
                : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] hover:bg-[color:var(--soft-hover)]"
            }`}
          >
            <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
            አስቀምጥ
          </motion.button>
        </div>
      </Card>
    </motion.article>
  );
};
