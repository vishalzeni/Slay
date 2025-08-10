import React, { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  Card,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TextField,
  TableSortLabel,
} from "@mui/material";
import colors from "../colors";
import * as XLSX from "xlsx";

const UsersList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [search, setSearch] = useState("");
  const [orderBy, setOrderBy] = useState("name");
  const [order, setOrder] = useState("asc");

  useEffect(() => {
    setLoading(true);
    setErr("");
    fetch("http://localhost:5000/api/users", {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setUsers(data);
        else setErr(data.error || "Failed to fetch users");
      })
      .catch(() => setErr("Failed to fetch users"))
      .finally(() => setLoading(false));
  }, []);

  // Handle sorting
  const handleSort = (property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  // Filter + sort users
  const filteredUsers = useMemo(() => {
    const searchLower = search.toLowerCase();
    return [...users]
      .filter(
        (u) =>
          u.name?.toLowerCase().includes(searchLower) ||
          u.email?.toLowerCase().includes(searchLower) ||
          u.phone?.toLowerCase().includes(searchLower) ||
          u.userId?.toLowerCase().includes(searchLower)
      )
      .sort((a, b) => {
        const valA = a[orderBy]?.toString().toLowerCase() || "";
        const valB = b[orderBy]?.toString().toLowerCase() || "";
        if (valA < valB) return order === "asc" ? -1 : 1;
        if (valA > valB) return order === "asc" ? 1 : -1;
        return 0;
      });
  }, [users, search, orderBy, order]);

  // Export users to Excel
  const handleExport = () => {
    if (!filteredUsers.length) return;
    const data = filteredUsers.map((u) => ({
      Name: u.name,
      Email: u.email,
      Phone: u.phone,
      "User ID": u.userId,
      Registered: u.createdAt ? new Date(u.createdAt).toLocaleString() : "",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Users");
    XLSX.writeFile(wb, "all_users.xlsx");
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" flexWrap="wrap" alignItems="center" justifyContent="space-between" mb={3} gap={2}>
        <Typography variant="h5" sx={{ color: colors.primary, fontWeight: 700 }}>
          All Users
        </Typography>
        <Box display="flex" gap={2}>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <Button
            variant="contained"
            color="primary"
            onClick={handleExport}
            sx={{ textTransform: "none", borderRadius: 2, fontWeight: 600, background: colors.primary }}
            disabled={!filteredUsers.length}
          >
            Export
          </Button>
        </Box>
      </Box>

      {/* Content */}
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : err ? (
        <Card sx={{ p: 2, bgcolor: "error.light" }}>
          <Typography color="error">{err}</Typography>
        </Card>
      ) : filteredUsers.length === 0 ? (
        <Typography>No users found.</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow>
                {[
                  { key: "name", label: "Name" },
                  { key: "email", label: "Email" },
                  { key: "phone", label: "Phone" },
                  { key: "userId", label: "User ID" },
                  { key: "createdAt", label: "Registered" },
                ].map((col) => (
                  <TableCell key={col.key}>
                    <TableSortLabel
                      active={orderBy === col.key}
                      direction={orderBy === col.key ? order : "asc"}
                      onClick={() => handleSort(col.key)}
                    >
                      <b>{col.label}</b>
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((u) => (
                <TableRow key={u._id}>
                  <TableCell>{u.name}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>{u.phone}</TableCell>
                  <TableCell>{u.userId}</TableCell>
                  <TableCell>
                    {u.createdAt ? new Date(u.createdAt).toLocaleString() : ""}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default UsersList;
