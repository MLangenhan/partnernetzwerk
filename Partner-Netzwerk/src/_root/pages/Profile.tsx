import {
  Route,
  Routes,
  Link,
  Outlet,
  useParams,
  useLocation,
} from "react-router-dom";

import { LikedPosts } from "@/_root/pages";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserById } from "@/lib/react-query/queriesAndMutations";
import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { getNameColor } from "@/lib/utils";

const Profile = () => {
  const { id } = useParams();
  const { user } = useUserContext();
  const { pathname } = useLocation();

  const { data: currentUser } = useGetUserById(id || "");

  const role = currentUser?.role && currentUser.role.length > 0 ? currentUser.role[0] : '';

  const nameColor = getNameColor(role);

  var linkedInUrl: string

  if (currentUser?.linkedin) {
    // Ensure the LinkedIn URL is complete
    linkedInUrl = currentUser?.linkedin.startsWith('http')
      ? currentUser.linkedin
      : `https://${currentUser?.linkedin}`;
  }
  else {
    linkedInUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }


  if (!currentUser)
    return (
      <div className="flex-center w-full h-full">
        <Loader />
      </div>
    );

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={currentUser.imageUrl && currentUser.imageUrl !== "" ? currentUser.imageUrl : "/assets/icons/default_profilepicture.svg"}
            alt="profile"
            className="w-48 h-48 lg:h-64 lg:w-64 rounded-2xl object-cover"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-full font-Univers_LT_Std_57">
                {currentUser.name}
              </h1>
              <p className={`small-regular md:body-medium text-center xl:text-left ${nameColor}`}>
                @{currentUser.username} {currentUser.abteilung !== null && currentUser.abteilung !== '' && (
                  <span> | {currentUser.abteilung}</span>
                )}

              </p>
              <div className="flex gap-2 pt-4">
                {currentUser.telefon_nr !== null && currentUser.telefon_nr !== '' && (
                  <>
                    <img
                      src="/assets/icons/phone-icon-black.svg"
                      alt="phone"
                      width={20}
                      height={20}
                      className="block dark:hidden"
                    />
                    {/* Dark mode image */}
                    <img
                      src="/assets/icons/phone-icon-white.svg"
                      alt="phone"
                      width={20}
                      height={20}
                      className="hidden dark:block"
                    />
                    <p className="">
                      {currentUser.telefon_nr}
                    </p>
                  </>
                )}
              </div>

              <div className="flex gap-2 pt-1">
                <img
                  src="/assets/icons/mail-icon-black.svg"
                  alt="phone"
                  width={20}
                  height={20}
                  className="block dark:hidden"
                />
                {/* Dark mode image */}
                <img
                  src="/assets/icons/mail-icon-white.svg"
                  alt="phone"
                  width={20}
                  height={20}
                  className="hidden dark:block"
                />
                <p className="">
                  {currentUser.email}
                </p>
              </div>
              <div className="flex-left pt-2 pr-64">
                {currentUser.linkedin !== '' && currentUser.linkedin !== null && (
                  <a href={linkedInUrl} target="_blank" className="h-8 bg-ecurie-lightgrey dark:bg-dark-4 text-light-1 flex items-center rounded-lg px-2 w-fit">
                    <img
                      src="/assets/icons/linkedin-icon.svg"
                      alt="linkedin"
                      width={20}
                      height={20}
                      className="mr-2"
                    />
                    <span>|</span>
                    <span className="pt-1 pl-2">{currentUser.name}</span>
                  </a>
                )}
              </div>
            </div>

            {/*   <div className="flex gap-8 mt-10 items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={currentUser.posts.length} label="Posts" />
              <StatBlock value={0} label="Followers" /> 
              <StatBlock value={0} label="Following" />
            </div>
          */}

            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {currentUser.bio}
            </p>

          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== currentUser.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${currentUser.$id}`}
                className={`h-12 bg-ecurie-lightgrey dark:bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${user.id !== currentUser.$id && "hidden"
                  }`}>
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Profil bearbeiten
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-dark-1 dark:border-white w-6/12 my-4"></div>

      {currentUser.$id === user.id && (
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${pathname === `/profile/${id}` && "!bg-ecurie-lightgrey dark:!bg-dark-3"
              }`}>
            <img
              src={"/assets/icons/add-post.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Beiträge
          </Link>
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${pathname === `/profile/${id}/liked-posts` && "!bg-ecurie-lightgrey dark:!bg-dark-3"
              }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Mit „Gefällt mir“ markiert
          </Link>
        </div>
      )}
      <Routes>
        <Route
          index
          element={<GridPostList posts={currentUser.posts} showUser={false} />}
        />
        {currentUser.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPosts />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;