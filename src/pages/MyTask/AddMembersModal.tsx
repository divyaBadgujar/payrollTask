import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Checkbox,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  CircularProgress,
  IconButton,
  Tabs,
  Tab,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store"; // adjust path
import { getCCMembers } from "../../store/slices/memberSlice";

interface Member {
  UserId: number;
  Name: string;
}

interface AddMembersModalProps {
  open: boolean;
  onClose: () => void;
  onSelect: (members: Member[]) => void;
}

const AddMembersModal: React.FC<AddMembersModalProps> = ({
  open,
  onClose,
  onSelect,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { members, isLoading } = useSelector(
    (state: RootState) => state.member
  );

  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [activeTab, setActiveTab] = useState<"users" | "cc">("users");

  useEffect(() => {
    if (open) {
      // 🔹 Dispatch API when modal opens or tab changes
      dispatch(getCCMembers({ from: 1, text: "" }));
    }
  }, [open, activeTab, dispatch]);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleDone = () => {
    const selected = members.filter((m) =>
      selectedIds.includes(Number(m.Id || m.UserId))
    );
    onSelect(
      selected.map((m) => ({
        UserId: Number(m.Id || m.UserId),
        Name: m.Name,
      }))
    );
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            maxWidth: "420px", // Set your desired max-width
          },
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        Assign {activeTab === "users" ? "Users" : "CC"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* 🔹 Tabs for Users / CC */}
      <Tabs
        value={activeTab}
        onChange={(_, val) => setActiveTab(val)}
        indicatorColor="primary"
        textColor="primary"
        centered
      >
        <Tab value="users" label="Users" />
        <Tab value="cc" label="CC" />
      </Tabs>

      <DialogContent dividers>
        {isLoading ? (
          <CircularProgress />
        ) : (
          <List>
            {members.map((member) => {
              const id = Number(member.Id || member.UserId);
              return (
                <ListItem key={id} button onClick={() => toggleSelect(id)}>
                  <ListItemIcon>
                    <Checkbox checked={selectedIds.includes(id)} />
                  </ListItemIcon>
                  <ListItemText primary={member.Name} />
                </ListItem>
              );
            })}
          </List>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleDone}>
          Done
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddMembersModal;
