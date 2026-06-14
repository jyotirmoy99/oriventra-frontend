import PlaceholderPage from "./PlaceholderPage";

// Placeholder behind PrivateRoute so the guard is testable now. Replaced by the
// real profile (info, avatar, addresses) in Feature 9.
const ProfilePage = () => (
  <PlaceholderPage title="Profile" feature="Feature 9 · Profile" />
);

export default ProfilePage;
