import { useMemo } from "react";
import type { Post } from "../types";

export const useFilteredPosts = (
  allPosts: Post[],
  savedPostIds: string[],
  activeDepartment: string,
  activeTab: "all" | "saved",
) =>
  useMemo(() => {
    const byDepartment =
      activeDepartment === "ሁሉም"
        ? allPosts
        : allPosts.filter((post) => post.department === activeDepartment);

    const byTab =
      activeTab === "saved"
        ? byDepartment.filter((post) => savedPostIds.includes(post.id))
        : byDepartment;

    return [...byTab].sort(
      (a, b) =>
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime(),
    );
  }, [allPosts, savedPostIds, activeDepartment, activeTab]);
