import { useState } from "react";
import Container from "@mui/material/Container";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Typography from "@mui/material/Typography";
import AvatarUploader from "../components/profile/AvatarUploader";
import ProfileInfoForm from "../components/profile/ProfileInfoForm";
import AddressBook from "../components/profile/AddressBook";

// ---------------------------------------------------------------------------
// ProfilePage  (/profile — behind PrivateRoute)
// ---------------------------------------------------------------------------
// Account hub: profile info + avatar, and the address book. Wishlist and orders
// live on their own pages (linked from the account menu).
// ---------------------------------------------------------------------------

const ProfilePage = () => {
  const [tab, setTab] = useState(0);

  return (
    <Container maxWidth="md" sx={{ py: { xs: 3, md: 5 } }}>
      <Typography variant="h3" sx={{ fontWeight: 800, mb: 3 }}>
        My account
      </Typography>

      <Tabs
        value={tab}
        onChange={(_, v) => setTab(v)}
        sx={{ mb: 3, borderBottom: 1, borderColor: "divider" }}
      >
        <Tab label="Profile" />
        <Tab label="Addresses" />
      </Tabs>

      {tab === 0 ? (
        <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 3 }}>
          <AvatarUploader />
          <Divider sx={{ my: 3 }} />
          <ProfileInfoForm />
        </Paper>
      ) : (
        <AddressBook />
      )}
    </Container>
  );
};

export default ProfilePage;
