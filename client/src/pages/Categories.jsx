import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  InputAdornment,
  Tooltip,
  CircularProgress,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Add, Edit, Delete, Search, Close, Sync } from "@mui/icons-material";
import toast from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";
import { usePurchases } from "../context/PurchaseContext";
import ConfirmDialog from "../components/Common/ConfirmDialog";

const Categories = () => {
  const { t, language } = useLanguage();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    categories,
    fetchCategories,
    syncCategories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = usePurchases();

  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", nameHi: "" });
  const [savingCategory, setSavingCategory] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deletingCategory, setDeletingCategory] = useState(false);
  const [categorySearch, setCategorySearch] = useState("");
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSyncCategories = async () => {
    setSyncing(true);
    try {
      const result = await syncCategories();
      if (result.added > 0) {
        toast.success(`Added ${result.added} new categories!`);
      } else {
        toast.success("Categories are up to date");
      }
    } catch (error) {
      toast.error("Failed to sync categories");
    } finally {
      setSyncing(false);
    }
  };

  const handleAddCategory = () => {
    setCategoryToEdit(null);
    setCategoryForm({ name: "", nameHi: "" });
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category) => {
    setCategoryToEdit(category);
    setCategoryForm({ name: category.name, nameHi: category.nameHi || "" });
    setCategoryDialogOpen(true);
  };

  const handleDeleteCategory = (category) => {
    if (category.isDefault) {
      toast.error(t("cannotDeleteDefault"));
      return;
    }
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleSaveCategory = async () => {
    if (!categoryForm.name.trim()) {
      toast.error(t("categoryName") + " " + t("required"));
      return;
    }

    setSavingCategory(true);
    try {
      if (categoryToEdit) {
        await updateCategory(categoryToEdit._id, categoryForm);
        toast.success(t("categoryUpdated"));
      } else {
        await addCategory(categoryForm);
        toast.success(t("categoryAdded"));
      }
      setCategoryDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error saving category");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleConfirmDelete = async () => {
    setDeletingCategory(true);
    try {
      await deleteCategory(categoryToDelete._id);
      toast.success(t("categoryDeleted"));
      setDeleteDialogOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting category");
    } finally {
      setDeletingCategory(false);
    }
  };

  // Separate default and custom categories
  const defaultCategories = categories.filter((cat) => cat.isDefault);
  const customCategories = categories.filter((cat) => !cat.isDefault);

  const filterCategories = (cats) =>
    cats.filter(
      (cat) =>
        cat.name.toLowerCase().includes(categorySearch.toLowerCase()) ||
        (cat.nameHi && cat.nameHi.includes(categorySearch))
    );

  const filteredDefault = filterCategories(defaultCategories);
  const filteredCustom = filterCategories(customCategories);

  return (
    <Box sx={{ pb: isMobile ? 10 : 0 }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            {t("manageCategories")}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {categories.length}{" "}
            {language === "hi" ? "श्रेणियां" : "categories"}
          </Typography>
        </Box>
        {!isMobile && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              startIcon={syncing ? <CircularProgress size={16} /> : <Sync />}
              onClick={handleSyncCategories}
              disabled={syncing}
            >
              {t("syncNow")}
            </Button>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddCategory}
            >
              {t("addCategory")}
            </Button>
          </Box>
        )}
      </Box>

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent sx={{ py: 2, "&:last-child": { pb: 2 } }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t("search") + "..."}
            value={categorySearch}
            onChange={(e) => setCategorySearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search fontSize="small" />
                </InputAdornment>
              ),
              endAdornment: categorySearch && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setCategorySearch("")}>
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </CardContent>
      </Card>

      {/* Custom Categories Section */}
      {customCategories.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography
              variant="subtitle2"
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              {t("customCategory")} ({filteredCustom.length})
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {filteredCustom.map((category) => (
                <Chip
                  key={category._id}
                  label={
                    language === "hi"
                      ? category.nameHi || category.name
                      : category.name
                  }
                  onClick={() => handleEditCategory(category)}
                  onDelete={() => handleDeleteCategory(category)}
                  deleteIcon={
                    <Tooltip title={t("delete")}>
                      <Delete fontSize="small" />
                    </Tooltip>
                  }
                  sx={{
                    cursor: "pointer",
                    "& .MuiChip-deleteIcon": {
                      color: "error.main",
                      "&:hover": { color: "error.dark" },
                    },
                  }}
                />
              ))}
              {filteredCustom.length === 0 && categorySearch && (
                <Typography variant="body2" color="text.secondary">
                  {t("noData")}
                </Typography>
              )}
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Default Categories Section */}
      <Card>
        <CardContent>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            sx={{ mb: 2 }}
          >
            {t("defaultCategory")} ({filteredDefault.length})
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {filteredDefault.map((category) => (
              <Tooltip
                key={category._id}
                title={
                  category.nameHi && language !== "hi"
                    ? category.nameHi
                    : language === "hi"
                      ? category.name
                      : ""
                }
                arrow
                placement="top"
              >
                <Chip
                  label={
                    language === "hi"
                      ? category.nameHi || category.name
                      : category.name
                  }
                  variant="outlined"
                  onClick={() => handleEditCategory(category)}
                  sx={{
                    cursor: "pointer",
                    "&:hover": {
                      bgcolor: "action.hover",
                    },
                  }}
                />
              </Tooltip>
            ))}
            {filteredDefault.length === 0 && categorySearch && (
              <Typography variant="body2" color="text.secondary">
                {t("noData")}
              </Typography>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Empty state */}
      {categories.length === 0 && (
        <Card>
          <CardContent sx={{ textAlign: "center", py: 6 }}>
            <Typography color="text.secondary" mb={2}>
              {t("noData")}
            </Typography>
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddCategory}
            >
              {t("addCategory")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Mobile Bottom Actions */}
      {isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            bgcolor: "background.paper",
            borderTop: 1,
            borderColor: "divider",
            display: "flex",
            gap: 1,
            zIndex: 1000,
          }}
        >
          <Button
            variant="outlined"
            startIcon={syncing ? <CircularProgress size={16} /> : <Sync />}
            onClick={handleSyncCategories}
            disabled={syncing}
            sx={{ flex: 1 }}
          >
            {t("syncNow")}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddCategory}
            sx={{ flex: 1 }}
          >
            {t("addCategory")}
          </Button>
        </Box>
      )}

      {/* Category Add/Edit Dialog */}
      <Dialog
        open={categoryDialogOpen}
        onClose={() => setCategoryDialogOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>
          {categoryToEdit ? t("editCategory") : t("addCategory")}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1, display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              fullWidth
              label={t("categoryName") + " *"}
              value={categoryForm.name}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, name: e.target.value })
              }
              autoFocus
            />
            <TextField
              fullWidth
              label={t("categoryNameHi")}
              value={categoryForm.nameHi}
              onChange={(e) =>
                setCategoryForm({ ...categoryForm, nameHi: e.target.value })
              }
              placeholder="हिंदी में नाम"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setCategoryDialogOpen(false)}
            disabled={savingCategory}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveCategory}
            disabled={savingCategory || !categoryForm.name.trim()}
          >
            {savingCategory ? <CircularProgress size={20} /> : t("save")}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        open={deleteDialogOpen}
        title={t("delete") + " " + t("category")}
        message={t("confirmDelete")}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteDialogOpen(false)}
        loading={deletingCategory}
      />
    </Box>
  );
};

export default Categories;
