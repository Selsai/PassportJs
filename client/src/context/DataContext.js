import { createContext, useContext, useEffect, useState } from "react";
import { posts as basePosts } from "../data";

const DataContext = createContext(null);

const FAVORITES_KEY = "tunisia_explorer_favorites";
const CUSTOM_POSTS_KEY = "tunisia_explorer_custom_posts";

const readStorage = (key, fallback) => {
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const DataProvider = ({ children }) => {
  const [customPosts, setCustomPosts] = useState(() =>
    readStorage(CUSTOM_POSTS_KEY, [])
  );
  const [favorites, setFavorites] = useState(() =>
    readStorage(FAVORITES_KEY, [])
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(CUSTOM_POSTS_KEY, JSON.stringify(customPosts));
    } catch {
      // ignore write errors (e.g. private browsing)
    }
  }, [customPosts]);

  useEffect(() => {
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch {
      // ignore write errors
    }
  }, [favorites]);

  // articles créés par l'utilisateur en premier, puis le catalogue de base
  const posts = [...customPosts, ...basePosts];

  const addPost = (data) => {
    const newPost = { id: Date.now(), rating: 5, ...data };
    setCustomPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  // Seuls les articles créés par l'utilisateur (customPosts) peuvent être
  // supprimés — le catalogue de base (data.js) n'est jamais modifié ici.
  const deletePost = (id) => {
    setCustomPosts((prev) => prev.filter((p) => p.id !== id));
    setFavorites((prev) => prev.filter((f) => f !== id));
  };

  const isCustomPost = (id) => customPosts.some((p) => p.id === id);

  const isFavorite = (id) => favorites.includes(id);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const favoritePosts = posts.filter((p) => favorites.includes(p.id));

  return (
    <DataContext.Provider
      value={{
        posts,
        customPosts,
        addPost,
        deletePost,
        isCustomPost,
        isFavorite,
        toggleFavorite,
        favoritePosts
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);