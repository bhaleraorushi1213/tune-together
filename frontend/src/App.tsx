import { Route, Routes } from "react-router-dom";
import { AuthenticateWithRedirectCallback } from "@clerk/react";
import { Toaster } from "react-hot-toast";

import AuthCallbackPage from "./auth-callback/AuthCallbackPage";
import HomePage from "./pages/home/HomePage";
import MainLayout from "./layout/MainLayout";
import ChatPage from "./pages/chat/ChatPage";
import AlbumPage from "./pages/album/AlbumPage";
import AdminPage from "./pages/admin/AdminPage";
import NotFoundPage from "./pages/404/NotFoundPage";
import PlaylistsPage from "./pages/playlist/PlaylistsPage";
import PlaylistDetailPage from "./pages/playlist/PlaylistDetailPage";
import LikedSongsPage from "./pages/playlist/LikedSongsPage";
import SearchPage from "./pages/search/SearchPage";
import RecentlyPlayedPage from "./pages/recent/RecentlyPlayedPage";

const App = () => {

  return (
    <>
      <Routes>
        <Route path="/auth-callback" element={<AuthCallbackPage />} />
        <Route
          path="/sso-callback"
          element={<AuthenticateWithRedirectCallback signUpForceRedirectUrl={"/auth-callback"} />}
        />
        <Route
          path="/admin"
          element={<AdminPage />}
        />

        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/albums/:albumId" element={<AlbumPage />} />
          <Route path="/*" element={<NotFoundPage />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlists/:playlistId" element={<PlaylistDetailPage />} />
          <Route path="/liked" element={<LikedSongsPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/recent" element={<RecentlyPlayedPage />} />
        </Route>
      </Routes>
      <Toaster />
    </>
  )
}

export default App;