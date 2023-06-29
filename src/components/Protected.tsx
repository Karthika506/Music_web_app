import React, { useEffect, useRef } from "react";
import SideBar from "./Home/SideBar";
import Home from "./Home/Hero";
import Favourites from "./Home/Favourites";
import Playlists from "./Home/Playlists";
import Search from "./Home/Search";
import { useSelector } from "react-redux";
import { RootState, ViewOption } from "../store/types";
import * as jose from "jose";
import "./Home/home_styles.css";

interface Props {
  token: string | null;
}

async function authenticate(token: string) {
  const spki =
    "-----BEGIN PUBLIC KEY-----MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAj+bVnBBPaiS3GA8Qs6l1Gb2K6MAWiLu0U9dkyJcluYIYUypUNxV6drkbgibQ72R3yLzg4kadNeVUpbw3MnjOxWTBWtcoxoQEvhFwd+IOVxc8MzB7Jwvf2j8PmzAGC+sNTJJW/NnQb7NAkBs4jQieERBwLfy8kby4e2x175V7ZRfTNM05Jld44w1rdB/OLwtboaKew+6G36LvfFqL2JYzWaZ0Kquh3fAMhLc/aXHjzm33xIgfkaMmOs0tsNaaB7q7LsgLhN5KrciUnm2664uiNhkYINLHXdxr7tG/bwP2OjBNR7NNEUmLV1HiyscyhnhMv3yQa4+jLBsc/2zFkvfl5wIDAQAB-----END PUBLIC KEY-----";
  const alg = "RS256";
  const publicKey = await jose.importSPKI(spki, alg);
  const { payload, protectedHeader } = await jose.jwtVerify(token, publicKey);
  return payload;
}

const Protected: React.FC<Props> = ({ token }) => {
  const [data, setData] = React.useState<any>();
  useEffect(() => {
    if (token) {
      authenticate(token as string).then((payload) =>
        setData({
          [payload.preferred_username as string]: {
            playlists: [],
            favourites: [],
          },
        })
      );
    }
  }, [token]);
  const setIsFavourite = (id: string) => {
    const newData = { ...data };
    newData[Object.keys(newData as any)[0]].favourites.push(id);
    setData(newData);
  };

  const deleteIsFavourite = (id: string) => {
    const newData = { ...data };
    const index =
      newData[Object.keys(newData as any)[0]].favourites.indexOf(id);
    newData[Object.keys(newData as any)[0]].favourites.splice(index, 1);
    setData(newData);
  };
  useEffect(() => {
    localStorage.setItem("data", JSON.stringify(data));
  }, [data]);
  const userName = data ? Object.keys(data as any)[0] : "";
  const selectedView = useSelector((state: RootState) => state.selectedView);
  const HomeView: ViewOption = "Home" as ViewOption;
  const FavouritesView: ViewOption = "Favourites" as ViewOption;
  const PlaylistsView: ViewOption = "Playlists" as ViewOption;
  const SearchView: ViewOption = "Search" as ViewOption;
  return (
    <div className="container-fluid p-0">
      <div className="row m-0 d-flex protected--container">
        <SideBar />
        {selectedView === HomeView && (
          <Home
            userName={userName}
            setIsFavourite={setIsFavourite}
            deleteFavourite={deleteIsFavourite}
          />
        )}
        {selectedView === FavouritesView && (
          <Favourites
            favourites={data[userName].favourites}
            setFavourite={setIsFavourite}
            deleteFavourite={deleteIsFavourite}
          />
        )}
        {selectedView === PlaylistsView && <Playlists />}
        {selectedView === SearchView && (
          <Search
            setFavourite={setIsFavourite}
            deleteFavourite={deleteIsFavourite}
          />
        )}
      </div>
    </div>
  );
};

export default Protected;
