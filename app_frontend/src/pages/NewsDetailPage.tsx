import { motion } from "framer-motion";
import { ArrowLeft, Bookmark, Heart, Share2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Badge } from "../components/common/Badge";
import { Button } from "../components/common/Button";
import { Card } from "../components/common/Card";
import { ImageCarousel } from "../components/news/ImageCarousel";
import { useAppStore } from "../context/useAppStore";
import { posts as fallbackPosts } from "../data";
import { useI18n } from "../i18n/I18nProvider";
import type { Post } from "../types";
import { departmentStyles } from "../utils/theme";

export const NewsDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useI18n();

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  const likedPosts = useAppStore((state) => state.likedPosts);
  const savedPosts = useAppStore((state) => state.savedPosts);
  const toggleLikePost = useAppStore((state) => state.toggleLikePost);
  const toggleSavePost = useAppStore((state) => state.toggleSavePost);

  useEffect(() => {
    if (!id) return;

    const API_BASE = import.meta.env.VITE_API_BASE || "";
    setLoading(true);

    fetch(`${API_BASE}/api/posts/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data: Post) => {
        setPost(data);
      })
      .catch(() => {
        // Fallback to local posts data if offline or direct static match
        const found = fallbackPosts.find((p) => p.id === id);
        setPost(found || null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const isLiked = post ? likedPosts.includes(post.id) : false;
  const isSaved = post ? savedPosts.includes(post.id) : false;

  const handleShare = async () => {
    const shareData = {
      title: post?.title || "News",
      text: post?.content ? `${post.content.slice(0, 100)}...` : "",
      url: window.location.href,
    };

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // Fallback to clipboard
      }
    }

    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore copy error
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[color:var(--primary)] border-t-transparent" />
      </div>
    );
  }

  if (!post) {
    return (
      <section className="space-y-4 py-8 text-center">
        <Card className="mx-auto max-w-md p-6 space-y-4">
          <p className="text-sm text-[color:var(--text-muted)]">
            {t("news.notFound")}
          </p>
          <Button
            variant="primary"
            onClick={() => navigate("/news")}
            className="w-full"
          >
            {t("news.backToNews")}
          </Button>
        </Card>
      </section>
    );
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-4"
    >
      {/* Top back navigation */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => navigate("/news")}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] shadow-xs transition hover:bg-[color:var(--soft-hover)] active:scale-95"
        >
          <ArrowLeft size={16} />
          {t("common.back")}
        </button>

        <button
          type="button"
          onClick={handleShare}
          className="inline-flex items-center gap-1.5 rounded-xl border border-[color:var(--border)] bg-[color:var(--surface)] px-3 py-2 text-xs font-semibold text-[color:var(--text-secondary)] shadow-xs transition hover:bg-[color:var(--soft-hover)] active:scale-95"
          title="Share"
        >
          {copied ? (
            <>
              <Check size={16} className="text-emerald-600" />
              <span className="text-emerald-600 font-bold">{t("news.copied")}</span>
            </>
          ) : (
            <>
              <Share2 size={16} />
              <span>{t("news.share")}</span>
            </>
          )}
        </button>
      </div>

      <Card className="space-y-5 p-5 md:p-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <Badge className={departmentStyles[post.department]?.badge || ""}>
              {post.department}
            </Badge>
            <span className="text-xs text-[color:var(--text-muted)]">
              {new Date(post.publishedAt).toLocaleDateString("am-ET", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>

          <h1 className="app-heading text-xl font-bold leading-tight text-[color:var(--text-primary)] sm:text-2xl">
            {post.title}
          </h1>

          <p className="text-xs text-[color:var(--text-muted)]">
            {post.author}
          </p>
        </div>

        {post.imageUrls && post.imageUrls.length > 0 && (
          <div className="overflow-hidden rounded-2xl">
            <ImageCarousel
              imageUrls={post.imageUrls}
              title={post.title}
              aspectClass="h-64 sm:h-96"
            />
          </div>
        )}

        {/* Content body */}
        <div className="border-t border-[color:var(--border)] pt-4">
          <p className="whitespace-pre-line text-sm leading-7 text-[color:var(--text-secondary)] sm:text-base sm:leading-8">
            {post.content}
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 border-t border-[color:var(--border)] pt-4">
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => toggleLikePost(post.id)}
            className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-4 text-sm font-semibold transition ${
              isLiked
                ? "border-[color:var(--dept-edu-dot)] bg-[color:var(--dept-edu-bg)] text-[color:var(--dept-edu-text)]"
                : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] hover:bg-[color:var(--soft-hover)]"
            }`}
          >
            <Heart size={16} fill={isLiked ? "currentColor" : "none"} />
            <span>ወድድ</span>
          </motion.button>

          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => toggleSavePost(post.id)}
            className={`inline-flex h-10 items-center gap-1.5 rounded-xl border px-4 text-sm font-semibold transition ${
              isSaved
                ? "border-[color:var(--accent)] bg-[color:color-mix(in_srgb,var(--accent)_25%,transparent)] text-[color:var(--on-accent)]"
                : "border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--text-muted)] hover:bg-[color:var(--soft-hover)]"
            }`}
          >
            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
            <span>አስቀምጥ</span>
          </motion.button>
        </div>
      </Card>
    </motion.section>
  );
};
