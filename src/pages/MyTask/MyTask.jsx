// import React, { useState } from "react";
// import { Box, Button, Container, TextField } from "@mui/material";
// import useDebounce from "../../Hooks/useDebounce";

// const MyTask = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const debounceSearch = useDebounce(searchTerm, 1000);
//   const handleSearchChange = (event) => {
//     setSearchTerm(event.target.value);
//   };

//   return (
//     <Box className={styles.MyTaskPage}>
//       <Box
//         display={"flex"}
//         justifyContent={"space-between"}
//         alignItems={"center"}
//         height={"4rem"}
//         width={"100%"}
//         className={styles.actionContainer}
//       >
//         {/* <Button variant="contained">Filter</Button> */}
//         <FilterButton  />
//         <Box display={"flex"} alignItems={"center"} gap={2}>
//           <TextField
//             label="Search"
//             variant="outlined"
//             value={searchTerm}
//             onChange={handleSearchChange}
//           />
//           <AddTaskButtonGroup />
//           <Button variant="contained">Settings</Button>
//           <Button variant="contained">Export</Button>
//         </Box>
//       </Box>
//       <AppliedFilters/>
//       <TaskTable search={debounceSearch} />
//     </Box>
//   );
// };

// export default MyTask;