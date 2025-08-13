import React, { useEffect, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TableSortLabel from "@mui/material/TableSortLabel";
import { visuallyHidden } from "@mui/utils";
import Box from "@mui/material/Box";
import { Avatar } from "@mui/material";
import TelaCadastro from "./telaCadastro";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../firebase";
import { useRegistering } from "../contexts/registeringContext";

// Helper functions for sorting
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// Define table header columns
interface HeadCell {
  id: string;
  label: string;
  align: "left" | "right";
}

const headCells: readonly HeadCell[] = [
  { id: "name", label: "Nome", align: "left" },
  { id: "email", label: "Email", align: "right" },
  { id: "dpto", label: "Departamento", align: "right" },
  { id: "ativo", label: "ativo", align: "right" },
];

function EnhancedTableHead(props: {
  onRequestSort: (event: React.MouseEvent<unknown>, property: string) => void;
  order: Order;
  orderBy: string;
}) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler =
    (property: string) => (event: React.MouseEvent<unknown>) => {
      onRequestSort(event, property);
    };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id as React.Key}
            align={headCell.align}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : "asc"}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <Box component="span" sx={visuallyHidden}>
                  {order === "desc" ? "sorted descending" : "sorted ascending"}
                </Box>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

export default function Colaboradores() {
  const [order, setOrder] = useState<Order>("asc");
  const [orderBy, setOrderBy] = useState<string>("name");
  //   const [tableData, setTableData] = useState();
  const [rows, setRows] = useState<any[]>([]);
  const { isRegistering, setIsRegistering } = useRegistering();

  const handleRequestSort = (
    _event: React.MouseEvent<unknown>,
    property: string
  ) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const getColaboradores = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "colaboradores"));
      const colaboradoresData = querySnapshot.docs.map((doc) => doc.data());
      setRows(
        colaboradoresData.map((data) => ({
          name: data.titulo,
          email: data.email,
          dpto: data.departamento.label,
          ativo: data.ativo ? "Sim" : "Não",
        }))
      );
      console.log(
        "Colaboradores fetched successfully:",
        colaboradoresData.map((doc) => doc.ativo)
      );
    } catch (e) {
      console.error("Error fetching colaboradores: ", e);
    }
  };
  useEffect(() => {
    getColaboradores();
  }, [isRegistering]);

  return (
    <div style={styles.colaboradoresContainer}>
      {isRegistering ? (
        <TelaCadastro />
      ) : (
        <>
          <div style={styles.colaboradoresHeader}>
            <h2>Colaboradores</h2>
            <button
              style={styles.colaboradoresButton}
              onClick={() => setIsRegistering(true)}
            >
              Novo Colaborador
            </button>
          </div>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <EnhancedTableHead
                order={order}
                orderBy={orderBy}
                onRequestSort={handleRequestSort}
              />
              <TableBody>
                {rows
                  .slice()
                  .sort(getComparator(order, orderBy))
                  .map((row, index) => (
                    <TableRow
                      key={row.name}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                    >
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{ display: "flex", alignItems: "center" }}
                      >
                        <Avatar
                          alt={row.name}
                          src={`/static/images/avatar/${index + 1}.jpg`}
                          sx={{ width: 24, height: 24, marginRight: 1 }}
                        ></Avatar>
                        {row.name}
                      </TableCell>
                      <TableCell align="right">{row.email}</TableCell>
                      <TableCell align="right">{row.dpto}</TableCell>
                      <TableCell align="right">{row.ativo}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </div>
  );
}

const styles = {
  colaboradoresContainer: {
    padding: "20px",
    backgroundColor: "#f5f5f5",
  },

  colaboradoresHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "10px",
    borderBottom: "1px solid #ccc",
    marginBottom: "20px",
  },

  colaboradoresButton: {
    padding: "10px 20px",
    backgroundColor: "#25c362",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
};
