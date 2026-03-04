import { useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Avatar,
  CircularProgress,
  Divider,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { Save, Brightness4, Brightness7, Language } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { t, language, toggleLanguage } = useLanguage();
  const { mode, toggleTheme } = useTheme();

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    projectName: user?.projectName || "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateProfile(formData);
      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        {t("profile")}
      </Typography>

      {/* Profile Header Card - Full Width */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "primary.main",
                fontSize: 32,
                flexShrink: 0,
              }}
            >
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </Avatar>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {user?.name}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {user?.phone}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {user?.projectName}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Edit Profile & Settings - Side by Side */}
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={3}>
                {t("editProfile")}
              </Typography>

              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label={t("name")}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label={t("phone")}
                      value={user?.phone || ""}
                      disabled
                      helperText={t("phoneCannotBeChanged")}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label={t("email")}
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </Grid>

                  <Grid size={12}>
                    <TextField
                      fullWidth
                      label={t("projectName")}
                      name="projectName"
                      value={formData.projectName}
                      onChange={handleChange}
                      helperText={t("displayedInHeader")}
                    />
                  </Grid>

                  <Grid size={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      startIcon={
                        loading ? <CircularProgress size={20} /> : <Save />
                      }
                      disabled={loading}
                    >
                      {t("save")}
                    </Button>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Typography variant="h6" mb={3}>
                {t("settings")}
              </Typography>

              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {/* Language Setting */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    <Language color="action" />
                    <Typography variant="subtitle2">{t("language")}</Typography>
                  </Box>
                  <ToggleButtonGroup
                    value={language}
                    exclusive
                    onChange={(e, newLang) => newLang && toggleLanguage()}
                    size="small"
                  >
                    <ToggleButton value="en" sx={{ px: 3 }}>
                      English
                    </ToggleButton>
                    <ToggleButton value="hi" sx={{ px: 3 }}>
                      हिंदी
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>

                <Divider />

                {/* Theme Setting */}
                <Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 1,
                    }}
                  >
                    {mode === "dark" ? (
                      <Brightness7 color="action" />
                    ) : (
                      <Brightness4 color="action" />
                    )}
                    <Typography variant="subtitle2">{t("theme")}</Typography>
                  </Box>
                  <ToggleButtonGroup
                    value={mode}
                    exclusive
                    onChange={(e, newMode) => newMode && toggleTheme()}
                    size="small"
                  >
                    <ToggleButton value="light" sx={{ px: 3 }}>
                      {t("light")}
                    </ToggleButton>
                    <ToggleButton value="dark" sx={{ px: 3 }}>
                      {t("dark")}
                    </ToggleButton>
                  </ToggleButtonGroup>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Footer Card */}
      <Card sx={{ mt: 4, textAlign: "center", py: 3 }}>
        <CardContent>
          <Typography variant="h5" color="primary" fontWeight="bold" mb={1}>
            {t("appName")}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" mb={1}>
            {t("tagline")}
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            The complete solution for tracking construction materials and
            expenses
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="body2" color="text.secondary" mb={1}>
            © {new Date().getFullYear()} GharBanao. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Developed by Vishal Soni | Rajasthan, India
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Be kind to Animals.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Profile;
