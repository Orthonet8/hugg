import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { Card } from "../components/common/Card";
import { PageHeader } from "../components/common/PageHeader";
import { FilterBar } from "../components/news/FilterBar";
import { PostCard } from "../components/news/PostCard";
import { useAppStore } from "../context/useAppStore";
import { posts } from "../data";
import { useFilteredPosts } from "../hooks/useFilteredPosts";

export const NewsPage = () => {
  const [activeDepartment, setActiveDepartment] = useState("ሁሉም");
  const [activeTab, setActiveTab] = useState<"all" | "saved">("all");

  const likedPosts = useAppStore((state) => state.likedPosts);
  const savedPosts = useAppStore((state) => state.savedPosts);
  const toggleLikePost = useAppStore((state) => state.toggleLikePost);
  const toggleSavePost = useAppStore((state) => state.toggleSavePost);

  const departments = useMemo(
    () => Array.from(new Set(posts.map((post) => post.department))),
    [],
  );

  const filteredPosts = useFilteredPosts(
    posts,
    savedPosts,
    activeDepartment,
    activeTab,
  );

  return (
    <section className="space-y-5">
      <PageHeader title="ዜና" subtitle="የግቢ ጉባኤ የቅርብ ጊዜ ማስታወቂያዎች" />

      <Card className="space-y-3 p-4">
        <div className="app-subtle-panel flex gap-2 rounded-2xl p-1.5">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            data-active={activeTab === "all"}
            className="data-[active=true]:app-gradient flex-1 rounded-xl py-2 text-sm font-semibold text-[color:var(--text-muted)] transition data-[active=true]:text-[color:var(--on-primary)]"
          >
            ሁሉም ዜና
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("saved")}
            data-active={activeTab === "saved"}
            className="data-[active=true]:app-gradient flex-1 rounded-xl py-2 text-sm font-semibold text-[color:var(--text-muted)] transition data-[active=true]:text-[color:var(--on-primary)]"
          >
            የተቀመጡ
          </button>
        </div>

        <FilterBar
          departments={departments}
          activeDepartment={activeDepartment}
          onChange={setActiveDepartment}
        />
      </Card>

      <motion.div layout className="space-y-4">
        <AnimatePresence mode="popLayout">
          {filteredPosts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              liked={likedPosts.includes(post.id)}
              saved={savedPosts.includes(post.id)}
              onLike={toggleLikePost}
              onSave={toggleSavePost}
            />
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredPosts.length === 0 ? (
        <Card className="py-10 text-center">
          <p className="text-sm text-[color:var(--text-muted)]">
            {activeTab === "saved"
              ? "እስካሁን የተቀመጠ ዜና የለም።"
              : "በዚህ ክፍል የሚታይ ዜና አልተገኘም።"}
          </p>
        </Card>
      ) : null}
    </section>
  );
};
