import { useEffect, useState } from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import SubmissionList from "./SubmissionTable/SubmissionList";

const SubmissionView = () => {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<any[]>([]);
  const [assignmentFilter, setAssignmentFilter] = useState<string>("");

  // Dummy assignments for filtering
  const assignments = ["Assignment 1", "Assignment 2", "Assignment 3"];

  useEffect(() => {
    // Simulating data fetching
    const fetchSubmissions = async () => {
      const data = [
        {
          id: 1,
          teamName: "Anonymized_Team_38121",
          assignment: "Assignment 1",
          members: [
            { name: "Student 10566", id: 10566 },
            { name: "Student 10559", id: 10559 },
            { name: "Student 10359", id: 10359 },
          ],
          links: [
            { url: "https://github.com/example/repo", displayName: "GitHub Repository" },
            { url: "http://google.com", displayName: "Submission Link" },
          ],
          fileInfo: [
            { name: "README.md", size: "14.9 KB", dateModified: "2024-10-03 23:36:57" },
          ],
        },
        {
          id: 2,
          teamName: "Anonymized_Team_38122",
          assignment: "Assignment 2",
          members: [
            { name: "Student 10593", id: 10593 },
            { name: "Student 10623", id: 10623 },
          ],
          links: [
            { url: "https://github.com/example/repo2", displayName: "GitHub Repository" },
          ],
          fileInfo: [
            { name: "README.md", size: "11.7 KB", dateModified: "2024-10-01 12:15:00" },
          ],
        },
      ];

      setSubmissions(data);
      setFilteredSubmissions(data);
    };

    fetchSubmissions();
  }, []);

  const handleGradeClick = (id: number) => {
    console.log(`Assign Grade clicked for submission ID ${id}`);
  };

  const handleAssignmentChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const selectedAssignment = e.target.value;
    setAssignmentFilter(selectedAssignment);
    if (selectedAssignment) {
      setFilteredSubmissions(submissions.filter(sub => sub.assignment === selectedAssignment));
    } else {
      setFilteredSubmissions(submissions);
    }
  };

  return (
    <Container className="mt-4">
      <Row>
        <Col md={3}>
          <h1>Submissions</h1>
          <hr />
          <Form.Group controlId="assignmentFilter">
            <Form.Label>Filter by Assignment</Form.Label>
            <Form.Control as="select" value={assignmentFilter} onChange={(e) => handleAssignmentChange(e as any)}>
              <option value="">All Assignments</option>
              {assignments.map((assignment, index) => (
                <option key={index} value={assignment}>{assignment}</option>
              ))}
            </Form.Control>
          </Form.Group>
        </Col>

        <Col md={9}>
          <SubmissionList submissions={filteredSubmissions} onGradeClick={handleGradeClick} />
        </Col>
      </Row>
    </Container>
  );
};

export default SubmissionView;
