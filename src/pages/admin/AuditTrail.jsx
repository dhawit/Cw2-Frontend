import SearchIcon from '@mui/icons-material/Search';
import { Alert, Box, CircularProgress, Container, IconButton, Paper, Snackbar, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from "react";
import { getAuditLogsApi } from "../../apis/api";

// Function to determine row color based on action type or other criteria
const getRowColor = (action) => {
  switch(action) {
    case 'Created':
      return '#e8f5e9'; // Light green
    case 'Updated':
      return '#fff3e0'; // Light orange
    case 'Deleted':
      return '#ffebee'; // Light red
    default:
      return '#ffffff'; // White
  }
};

const AuditTrail = () => {
  const [logs, setLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAuditLogsApi()
      .then((res) => {
        if (res.data && Array.isArray(res.data)) {
          setLogs(res.data);
          setFilteredLogs(res.data);
        } else {
          setError("Failed to fetch audit logs.");
        }
      })
      .catch(() => {
        setError("Failed to fetch audit logs.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFilteredLogs(
      logs.filter(log =>
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, logs]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(0); // Reset to first page on search
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Container component="main" maxWidth="lg" sx={{ minHeight: '100vh', py: 8 }}>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom sx={{ color: '#004d40', fontWeight: 'bold' }}>
          Audit Trail
        </Typography>
        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'center' }}>
          <TextField
            variant="outlined"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={handleSearchChange}
            InputProps={{
              endAdornment: (
                <IconButton type="submit" sx={{ p: '10px' }}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
            fullWidth
            sx={{ maxWidth: 400 }}
          />
        </Box>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Snackbar open={Boolean(error)} autoHideDuration={6000} onClose={() => setError(null)}>
            <Alert onClose={() => setError(null)} severity="error">
              {error}
            </Alert>
          </Snackbar>
        ) : (
          <>
            <TableContainer component={Paper} elevation={3} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>Action</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>Details</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#004d40', color: '#ffffff' }}>Timestamp</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredLogs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((log) => (
                    <TableRow key={log._id} sx={{ backgroundColor: getRowColor(log.action), '&:hover': { backgroundColor: '#f1f8e9' } }}>
                      <TableCell sx={{ padding: '16px' }}>{log.action}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{log.details}</TableCell>
                      <TableCell sx={{ padding: '16px' }}>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    </TableRow>
                  ))}
                  {filteredLogs.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={3} sx={{ textAlign: 'center', py: 2 }}>
                        No audit logs found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {filteredLogs.length > 0 && (
              <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={filteredLogs.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                sx={{ mt: 2 }}
              />
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default AuditTrail;
