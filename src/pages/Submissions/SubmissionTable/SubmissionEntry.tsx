import { createColumnHelper } from "@tanstack/react-table";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";

interface ISubmissionEntry {
  id: number;
  teamName: string;
  assignment: string;
  members: { name: string; id: number }[];
  links: { url: string; displayName: string }[];
  fileInfo: { name: string; size: string; dateModified: string }[];
}

const columnHelper = createColumnHelper<ISubmissionEntry>();

const SubmissionEntry = ({ onGradeClick }: { onGradeClick: (id: number) => void }) => {
  const columns = [
    // Team Name column: Sorting enabled, search disabled
    columnHelper.accessor('teamName', {
      header: ({ column }) => (
        <div
          onClick={column.getToggleSortingHandler()} // Toggle sorting on click
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          Team Name
          {
            !column.getIsSorted() && <span> ⬍</span>
          }
        </div>
      ),
      cell: (info) => (
        <>
          <div>{info.getValue()}</div>
          <Button variant="link" onClick={() => onGradeClick(info.row.original.id)}>
            Assign Grade
          </Button>
        </>
      ),
      size: 25,
      enableSorting: true,
      enableColumnFilter: false, 
      enableGlobalFilter: false,
    }),

    // Team Members column: No search, no sorting
    columnHelper.accessor('members', {
      header: () => 'Team Members',
      cell: (info) =>
        info.getValue().map((member) => (
          <div key={member.id}>
            <Link to={`/profile/${member.id}`}>
              {member.name} (Student {member.id})
            </Link>
          </div>
        )),
      size: 35,
      enableSorting: false,
      enableColumnFilter: false, 
      enableGlobalFilter: false, 
    }),

    // Links column: No search, no sorting
    columnHelper.accessor('links', {
      header: () => 'Links',
      cell: (info) => (
        <div>
          {info.getValue().map((link, idx) => (
            <div key={idx}>
              <a href={link.url}>{link.displayName}</a>
            </div>
          ))}
        </div>
      ),
      size: 15,
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    }),

    // File Info column: No search, no sorting
    columnHelper.accessor('fileInfo', {
      header: () => 'File Info',
      cell: (info) => (
        <div>
          {info.getValue().map((file, idx) => (
            <div key={idx}>
              <div>{file.name}</div>
              <div>Size: {file.size}</div>
              <div>Date Modified: {file.dateModified}</div>
            </div>
          ))}
        </div>
      ),
      size: 25,
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    }),

    // History column: Links to history pages (No search or sorting)
    columnHelper.display({
      id: 'history',
      header: () => 'History',
      cell: (info) => (
        <Link to={`/submissions/history/${info.row.original.id}`}>History</Link>
      ),
      enableSorting: false,
      enableColumnFilter: false,
      enableGlobalFilter: false,
    }),
  ];

  return columns;
};

export default SubmissionEntry;
