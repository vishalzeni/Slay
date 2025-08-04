import React, { useState, useEffect } from "react";
import { Box, Typography, TextField, Button, List, ListItem, IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import colors from "../colors";
import axios from "axios";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const { data } = await axios.get("http://localhost:5000/api/announcements");
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to fetch announcements:", error);
    }
  };

  const addAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    try {
      const { data } = await axios.post("http://localhost:5000/api/announcements", { text: newAnnouncement });
      setAnnouncements(data);
      setNewAnnouncement("");
    } catch (error) {
      console.error("Failed to add announcement:", error);
    }
  };

  const deleteAnnouncement = async (id) => {
    try {
      const { data } = await axios.delete(`http://localhost:5000/api/announcements/${id}`);
      setAnnouncements(data);
    } catch (error) {
      console.error("Failed to delete announcement:", error);
    }
  };

  return (
    <Box>
      <Typography variant="h5" mb={2}>
        Manage Announcements
      </Typography>

      <Box display="flex" mb={2}>
        <TextField
          label="New Announcement"
          variant="outlined"
          value={newAnnouncement}
          onChange={(e) => setNewAnnouncement(e.target.value)}
          fullWidth
          sx={{ mr: 2 }}
        />
        <Button variant="contained" color="primary" onClick={addAnnouncement}>
          Add
        </Button>
      </Box>

      <List>
        {announcements.map((announcement) => (
          <ListItem
            key={announcement._id}
            sx={{
              bgcolor: colors.drawerBg,
              borderRadius: 2,
              mb: 1,
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            {announcement.text}
            <IconButton color="error" onClick={() => deleteAnnouncement(announcement._id)}>
              <DeleteIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default Announcements;
