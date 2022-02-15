import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import CircularProgress from "@mui/material/CircularProgress";
import { array10 } from "./arrayData";
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledPagination = styled(Pagination)(({ theme }) => ({
  marginTop: '1rem'
}));


export const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [order, setOrder] = useState("ASC");
  const [nbItems, setNbItems] = useState(10);
  const [sort, setSort] = useState("title");
  const [page, setPage] = useState(1);

  const [selectPageItems, setPageItems] = useState(array10);
  const [isLoading, setIsLoading] = useState(false);

  const fillSelectArray = (length) => {
    let arrayLength = 1000 / length;
    let array = []
    for(let i = 1; i < arrayLength + 1; i++){
      array.push(i);
    }
    setPageItems(array);
  }

  const handleLimitChange = (e) => {
    setNbItems(e.target.value);
  };

  const handleOrderChange = (e) => {
    setPage(1);
    setOrder(e.target.value);
  };

  const handleSortChange = (e) => {
    setPage(1);
    setSort(e.target.value);
  };

  const handlePageChange = (e, value) => {
    setPage(value);
  };

  useEffect(() => {
    if(nbItems === 10){
      setPage(1)
      fillSelectArray(10)
    } else if(nbItems === 50){
      setPage(1)
      fillSelectArray(50)
    } else{
      setPage(1)
      fillSelectArray(100)
    }
  }, [nbItems]);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await axios(
        `https://sakilapagination.herokuapp.com/movies?limit=${nbItems}&order=${order}&sort=${sort}&page=${page}`
      );
      setMovies(result.data.movies);
      setIsLoading(false);
    };

    fetchData();
  }, [nbItems, order, sort, page]);

  return (
    <React.Fragment>
      <div style={{ maxWidth: "1500px", margin: "auto", paddingTop: "50px" }}>
        <Box sx={{ display: "grid" }}>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <Select
                  labelId="items-select-label"
                  id="items-select"
                  value={nbItems}
                  label="Items"
                  variant="filled"
                  onChange={handleLimitChange}
                >
                  <MenuItem value={10}>10</MenuItem>
                  <MenuItem value={50}>50</MenuItem>
                  <MenuItem value={100}>100</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <Select
                  labelId="order-select-label"
                  id="order-select"
                  value={order}
                  label="Order"
                  onChange={handleOrderChange}
                  variant="filled"
                >
                  <MenuItem value={"ASC"}>Croissant</MenuItem>
                  <MenuItem value={"DESC"}>Decroissant</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <Select
                  labelId="sort-select-label"
                  id="sort-select"
                  value={sort}
                  label="Sort"
                  onChange={handleSortChange}
                  variant="filled"
                >
                  <MenuItem value={"title"}>Titre</MenuItem>
                  <MenuItem value={"category"}>Genre</MenuItem>
                  <MenuItem value={"rental_number"}>Locations</MenuItem>
                  <MenuItem value={"rental_rate"}>Note locations</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={10}>
              {isLoading ? (
                <CircularProgress />
              ) : (
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 300 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <StyledTableCell align="center">Titre</StyledTableCell>
                        <StyledTableCell align="center">Genre</StyledTableCell>
                        <StyledTableCell align="center">Note</StyledTableCell>
                        <StyledTableCell align="center">Locations</StyledTableCell>
                        <StyledTableCell align="center">Note locations</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {movies.map((movie) => (
                        <TableRow
                          key={movie.title}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <StyledTableCell align="center" component="th" scope="row">
                            {movie.title}
                          </StyledTableCell>
                          <StyledTableCell align="center">{movie.category}</StyledTableCell>
                          <StyledTableCell align="center">{movie.rating}</StyledTableCell>
                          <StyledTableCell align="center">{movie.rental_number}</StyledTableCell>
                          <StyledTableCell align="center">{movie.rental_rate} €</StyledTableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
              <StyledPagination variant="outlined" color="secondary" count={selectPageItems.length} page={page} onChange={handlePageChange} />
          </Grid>
        </Box>
      </div>
    </React.Fragment>
  );
};
