import { Row as TRow } from "@tanstack/react-table";
import Table from "components/Table/Table";
import useAPI from "hooks/useAPI";
import { useCallback, useEffect, useMemo, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { alertActions } from "store/slices/alertSlice";
import { RootState } from "../../store/store";
import { ICourseResponse, ROLE } from "../../utils/interfaces";
import { courseColumns as COURSE_COLUMNS } from "./CourseColumns";
import CopyCourse from "./CourseCopy";
import DeleteCourse from "./CourseDelete";
import { formatDate, mergeDataAndNamesAndInstructors } from "./CourseUtil";
import { ICourseResponse as ICourse } from "../../utils/interfaces";

/**
 * Courses Component: Displays and manages courses, including CRUD operations.
 */

const Courses = () => {
  const { error, isLoading, data: CourseResponse, sendRequest: fetchCourses } = useAPI();
  const { data: InstitutionResponse, sendRequest: fetchInstitutions } = useAPI();
  const { data: InstructorResponse, sendRequest: fetchInstructors } = useAPI();
  const auth = useSelector(
    (state: RootState) => state.authentication,
    (prev, next) => prev.isAuthenticated === next.isAuthenticated
  );
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  

  // State for course details modal
  const [showDetailsModal, setShowDetailsModal] = useState<boolean>(false);
  const [selectedCourse, setSelectedCourse] = useState<ICourse | null>(null);

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState<{
    visible: boolean;
    data?: ICourseResponse;
  }>({ visible: false });

  const [showCopyConfirmation, setShowCopyConfirmation] = useState<{
    visible: boolean;
    data?: ICourseResponse;
  }>({ visible: false });

  // Utility function to handle modals
  const showModal = (
    setModalState: React.Dispatch<React.SetStateAction<boolean>>,
    setData?: (data: ICourse | null) => void,
    data?: ICourse
  ) => {
    if (setData) {
      setData(data || null);
    }
    setModalState(true);
  };

  const handleShowDetails = (course: ICourse) =>
    showModal(setShowDetailsModal, setSelectedCourse, course);

  useEffect(() => {
    // Ensure the API fetch happens unless modals are active
    if (!showDeleteConfirmation.visible || !showCopyConfirmation.visible) {
      fetchCourses({ url: `/courses` });
      fetchInstitutions({ url: `/institutions` });
      fetchInstructors({ url: `/users` });
    }
  }, [
    fetchCourses,
    fetchInstitutions,
    fetchInstructors,
    location,
    showDeleteConfirmation.visible,
    auth.user.id,
    showCopyConfirmation.visible,
  ]);

  useEffect(() => {
    if (error) {
      dispatch(alertActions.showAlert({ variant: "danger", message: error }));
    }
  }, [error, dispatch]);

  const onDeleteCourseHandler = useCallback(
    () => setShowDeleteConfirmation({ visible: false }),
    []
  );

  const onCopyCourseHandler = useCallback(
    () => setShowCopyConfirmation({ visible: false }),
    []
  );

  const onEditHandle = useCallback(
    (row: TRow<ICourseResponse>) => navigate(`edit/${row.original.id}`),
    [navigate]
  );

  const onTAHandle = useCallback(
    (row: TRow<ICourseResponse>) => navigate(`${row.original.id}/tas`),
    [navigate]
  );

  const onDeleteHandle = useCallback(
    (row: TRow<ICourseResponse>) =>
      setShowDeleteConfirmation({ visible: true, data: row.original }),
    []
  );

  const onCopyHandle = useCallback(
    (row: TRow<ICourseResponse>) =>
      setShowCopyConfirmation({ visible: true, data: row.original }),
    []
  );

  const tableColumns = useMemo(
    () =>
      COURSE_COLUMNS(onEditHandle, onDeleteHandle, onTAHandle, onCopyHandle),
    [onDeleteHandle, onEditHandle, onTAHandle, onCopyHandle]
  );

  const tableData = useMemo(
    () => (isLoading || !CourseResponse?.data ? [] : CourseResponse.data),
    [CourseResponse?.data, isLoading]
  );

  const institutionData = useMemo(
    () => (isLoading || !InstitutionResponse?.data ? [] : InstitutionResponse.data),
    [InstitutionResponse?.data, isLoading]
  );

  const instructorData = useMemo(
    () => (isLoading || !InstructorResponse?.data ? [] : InstructorResponse.data),
    [InstructorResponse?.data, isLoading]
  );

  const mergedTableData = useMemo(
    () =>
      mergeDataAndNamesAndInstructors(tableData, institutionData, instructorData).map(
        (item: any) => ({
          ...item,
          created_at: formatDate(item.created_at),
          updated_at: formatDate(item.updated_at),
        })
      ),
    [tableData, institutionData, instructorData]
  );

  const loggedInUserRole = auth.user.role;

  const visibleCourses = useMemo(() => {
    if (
      loggedInUserRole === ROLE.ADMIN.valueOf() ||
      loggedInUserRole === ROLE.SUPER_ADMIN.valueOf()
    ) {
      return mergedTableData;
    }
    return mergedTableData.filter(
      (CourseResponse: { instructor_id: number }) =>
        CourseResponse.instructor_id === auth.user.id
    );
  }, [mergedTableData, loggedInUserRole]);

  return (
    <>
      <Outlet />
      <main>
        <Container fluid className="px-md-4">
          <Row className="mt-4 mb-4">
            <Col className="text-center">
              <h2>
                {auth.user.role === ROLE.INSTRUCTOR.valueOf() ? (
                  <>Instructed by: {auth.user.full_name}</>
                ) : auth.user.role === ROLE.TA.valueOf() ? (
                  <>Assisted by: {auth.user.full_name}</>
                ) : (
                  <>Manage Courses</>
                )}
              </h2>
            </Col>
          </Row>

          <Row>

          <Col md={{ span: 1, offset: 11 }} style={{ paddingBottom: "10px" }}>
              <Button className="btn pull-right new-button btn-md" variant="danger" onClick={() => navigate("new")}>
                Create
              </Button>
            </Col>
          </Row>

          {showDeleteConfirmation.visible && (
            <DeleteCourse
              courseData={showDeleteConfirmation.data!}
              onClose={onDeleteCourseHandler}
            />
          )}
          {showCopyConfirmation.visible && (
            <CopyCourse
              courseData={showCopyConfirmation.data!}
              onClose={onCopyCourseHandler}
            />
          )}

          <Row >
            <div style={{ fontSize: "15px", lineHeight: "1.428em" }}>
              <Table
                data={visibleCourses}
                columns={tableColumns}
                columnVisibility={{
                  id: false,
                  institution: auth.user.role === ROLE.SUPER_ADMIN.valueOf(),
                  instructor: auth.user.role === ROLE.SUPER_ADMIN.valueOf(),
                }}
                showGlobalFilter={false}
                showColumnFilter={false}
                disableGlobalFilter={true}
              />
            </div>
          </Row>
        </Container>
      </main>
    </>
  );
};

export default Courses;
