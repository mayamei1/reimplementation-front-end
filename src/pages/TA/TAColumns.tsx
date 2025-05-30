// Importing necessary interfaces and modules
import { createColumnHelper, Row } from "@tanstack/react-table";
import { Button } from "react-bootstrap";
import { BsPersonXFill } from "react-icons/bs";
import { ITAResponse as ITA } from "../../utils/interfaces";
import ColumnButton from "../../components/ColumnButton";

/**
 * @author Atharva Thorve, on December, 2023
 * @author Divit Kalathil, on December, 2023
 */

type Fn = (row: Row<ITA>) => void;
const columnHelper = createColumnHelper<ITA>();
export const TAColumns = (handleDelete: Fn) => [
  columnHelper.accessor("id", {
    header: "Id",
    enableColumnFilter: false,
    enableSorting: false,
  }),
  //create TA Name column Header
  columnHelper.accessor("name", {
    header: "TA name",
    enableSorting: true,
  }),
  //create Full TA Name column Header
  columnHelper.accessor("full_name", {
    header: "Full name",
    enableSorting: true,
    enableMultiSort: true,
  }),
  //create Email column Header
  columnHelper.accessor("email", {
    header: "Email",
  }),

  columnHelper.display({
    id: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <>
        <ColumnButton
          id="delete-ta"
          variant="danger"
          size="sm"
          className="p-0 m-0 border-0 bg-transparent"
          onClick={() => handleDelete(row)}
          tooltip="Delete TA"
          icon={<img
            src={process.env.PUBLIC_URL + "/assets/images/delete-icon-24.png"}
            alt="Remove TA"
            width="25px"
            height="20px"
          />}
        />
      </>
    ),
  }),
];
