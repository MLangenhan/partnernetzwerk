// Import necessary components from external libraries
import { Models } from "appwrite"; // Import data models from Appwrite
import { Link } from "react-router-dom"; // Import Link component for routing
import { getNameColor } from "@/lib/utils";

// Define an interface for UserCard component props
type UserCardProps = {
  user: Models.Document; // Prop to hold a document object representing a user
};

// UserCard functional component
const UserCard = ({ user }: UserCardProps) => {
  // Construct the user profile link using user ID
  const userProfileLink = `/profile/${user.$id}`;

  const role = user.role && user.role.length > 0 ? user.role[0] : '';

  const nameColor = getNameColor(role);

  return (
    <Link to={userProfileLink} className="user-card">
      {/* Display user profile picture */}
      <img
        src={user.imageUrl || "/assets/icons/profile-placeholder.svg"}
        alt="creator"
        className="rounded-full w-14 h-14 object-cover"
      />

      {/* Display user name and username */}
      <div className="flex-center flex-col gap-1">
        <p className="base-medium text-light-1 text-center line-clamp-1 font-Univers_LT_Std_57">
          {user.name}
        </p>
        <p className={`small-regular text-center line-clamp-1 ${nameColor}`}>
          @{user.username}
        </p>
      </div>
    </Link>
  );
};

// Export the UserCard component to be used in other parts of the application
export default UserCard;
