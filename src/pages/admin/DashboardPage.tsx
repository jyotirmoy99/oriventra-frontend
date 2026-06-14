import PlaceholderPage from "../PlaceholderPage";

// Placeholder behind AdminRoute + AdminLayout so both are testable now.
// Replaced by the real dashboard (stats, charts) in Feature 11.
const DashboardPage = () => (
  <PlaceholderPage title="Admin Dashboard" feature="Feature 11 · Admin" />
);

export default DashboardPage;
